import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime
import time

from zoneinfo import ZoneInfo
from frappe.utils import get_datetime

def _as_iso_with_offset(value):
    tz_name = frappe.get_system_settings("time_zone") or "UTC"
    site_tz = ZoneInfo(tz_name)

    dt = get_datetime(value)
    if not dt:
        return None

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=site_tz)
    else:
        dt = dt.astimezone(site_tz)

    return dt.isoformat(timespec="microseconds")


class ChatMessage(Document):
    def before_insert(self):
        # fallback sender from logged in user
        if not self.sender:
            if frappe.session.user and frappe.session.user != "Guest":
                self.sender = frappe.session.user
            else:
                frappe.throw("Sender is required.")

        if not self.timestamp:
            self.timestamp = now_datetime()

    def after_insert(self):
        frappe.db.set_value(
            self.doctype,
            self.name,
            {
                "creation_iso": _as_iso_with_offset(self.creation),
              
            },
            update_modified=False,
        )
    # def validate(self):
    #     if not self.sender:
    #         frappe.throw("Sender is required.")
    #     if not self.receiver:
    #         frappe.throw("Receiver is required.")
    #     if not self.message or not self.message.strip():
    #         frappe.throw("Message is required.")


# SEND MESSAGE
@frappe.whitelist()
def send_message(receiver, message, sender=None):

    if sender is None:
        sender = frappe.session.user

    # find existing conversation
    conv = frappe.get_all(
        "Conversation",
        filters=[
            ["sender", "in", [sender, receiver]],
            ["receiver", "in", [sender, receiver]]
        ],
        limit=1
    )

    if conv:
        conv_name = conv[0].name
    else:
        conv_doc = frappe.get_doc({
            "doctype": "Conversation",
            "sender": sender,
            "receiver": receiver
        })
        conv_doc.insert(ignore_permissions=True)
        conv_name = conv_doc.name

    # create message
    msg = frappe.get_doc({
        "doctype": "Chat Message",
        "conversation": conv_name,
        "sender": sender,
        "receiver": receiver,
        "message": message,
        "timestamp": frappe.utils.now()
    })

    msg.insert(ignore_permissions=True)

    frappe.publish_realtime(
    event="new_chat_message",
    message={
        "name": msg.name,
        "sender": msg.sender,
        "receiver": msg.receiver,
        "message": msg.message,
        "timestamp": msg.timestamp
    },
    user=receiver
    )
    frappe.publish_realtime(
        event="new_chat_message",
        message={
            "name": msg.name,
            "sender": msg.sender,
            "receiver": msg.receiver,
            "message": msg.message,
            "timestamp": msg.timestamp
        },
        user=frappe.session.user
    )


    return msg


# GET MESSAGES
@frappe.whitelist()
def get_messages(user):

    current_user = frappe.session.user

    conv = frappe.get_all(
        "Conversation",
        filters=[
            ["sender", "in", [current_user, user]],
            ["receiver", "in", [current_user, user]]
        ],
        limit=1
    )

    if not conv:
        return []

    return frappe.get_all(
        "Chat Message",
        filters={"conversation": conv[0].name},
        fields=["sender", "receiver", "message", "timestamp"],
        order_by="timestamp asc"
    )


# GET CHAT USERS
@frappe.whitelist()
def get_chat_users():

    user = frappe.session.user

    conversations = frappe.get_all(
        "Conversation",
        filters=[
            ["sender", "=", user],
        ],
        fields=["receiver"]
    )

    conversations += frappe.get_all(
        "Conversation",
        filters=[
            ["receiver", "=", user],
        ],
        fields=["sender"]
    )

    users = set()

    for c in conversations:
        if c.get("receiver"):
            users.add(c["receiver"])
        if c.get("sender"):
            users.add(c["sender"])

    print("chat users:", list(users))

    return list(users)


@frappe.whitelist()
def get_chat_sidebar_users():
    current_user = frappe.session.user

    rows = frappe.db.sql(
        """
        SELECT
            u.name AS email,
            u.first_name,
            u.last_name,
            u.user_image,
            (
                SELECT m.message
                FROM `tabChat Message` m
                WHERE (
                    (m.sender = u.name AND m.receiver = %(current_user)s)
                    OR (m.sender = %(current_user)s AND m.receiver = u.name)
                )
                ORDER BY m.timestamp DESC, m.creation DESC
                LIMIT 1
            ) AS last_message,
            (
                SELECT m.timestamp
                FROM `tabChat Message` m
                WHERE (
                    (m.sender = u.name AND m.receiver = %(current_user)s)
                    OR (m.sender = %(current_user)s AND m.receiver = u.name)
                )
                ORDER BY m.timestamp DESC, m.creation DESC
                LIMIT 1
            ) AS last_timestamp,
            (
                SELECT COUNT(1)
                FROM `tabChat Message` m
                WHERE m.sender = u.name
                  AND m.receiver = %(current_user)s
                  AND IFNULL(m.is_read, 0) = 0
            ) AS unread_count
        FROM `tabUser` u
        INNER JOIN `tabHas Role` hr
            ON hr.parent = u.name
           AND hr.role = 'Client'
        WHERE u.enabled = 1
          AND u.name NOT IN ('Administrator', 'Guest', %(current_user)s)
        GROUP BY u.name, u.first_name, u.last_name, u.user_image
        ORDER BY last_timestamp DESC, u.name ASC
        """,
        {"current_user": current_user},
        as_dict=True,
    )

    for row in rows:
        row["unread_count"] = int(row.get("unread_count") or 0)

    return rows


@frappe.whitelist()
def get_clients():

    return frappe.get_all(
        "Conversation",
        fields=["client"],
        distinct=True
    )

@frappe.whitelist()
def mark_as_read(user):
    """
    Mark all messages from a specific sender to current user as read
    """

    retries = 3

    for attempt in range(retries):
        try:
            frappe.db.sql(
                """
                UPDATE `tabChat Message`
                SET is_read = 1,
                    read_at = %s
                WHERE sender = %s
                AND receiver = %s
                AND is_read = 0
                """,
                (frappe.utils.now(), user, frappe.session.user),
            )
            frappe.db.commit()
            break
        except frappe.QueryDeadlockError:
            frappe.db.rollback()
            if attempt == retries - 1:
                return {"status": "success"}
            time.sleep(0.1 * (attempt + 1))

    return {"status": "success"}

@frappe.whitelist()
def mark_messages_as_read(sender: str, receiver: str):
    frappe.db.sql("""
        UPDATE `tabChat Message`
        SET is_read = 1
        WHERE sender = %s
          AND receiver = %s
          AND IFNULL(is_read, 0) = 0
    """, (sender, receiver))
    frappe.db.commit()
    return {"ok": True}