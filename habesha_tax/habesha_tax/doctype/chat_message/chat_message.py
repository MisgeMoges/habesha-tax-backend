import frappe
from frappe.model.document import Document
from frappe.utils import now_datetime


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

    frappe.db.sql("""
        UPDATE `tabChat Message`
        SET is_read = 1
        WHERE sender = %s
        AND receiver = %s
        AND is_read = 0
    """, (user, frappe.session.user))

    frappe.db.commit()

    return {"status": "success"}