
frappe.pages['chat'].on_page_load = function(wrapper) {

    let page = frappe.ui.make_app_page({
        parent: wrapper,
        title: __("Client Chat"),
        single_column: true
    });

    $(page.main).html(`
        <div class="chat-wrapper">
            <div class="chat-container">
                <div class="chat-users">
                    <div class="sidebar-header">Messages</div>

                    <div style="padding:10px">
                        <input id="user-search" placeholder="Search user..."
                        style="width:100%;padding:6px;border:1px solid #ddd;border-radius:6px;">
                    </div>

                    <div id="user-list"></div>
                </div>

                <div class="chat-area">
                    <div class="chat-header">
                         <div id="header-avatar" class="avatar-circle"></div>
                         <div class="header-info">
                            <span id="chat-user">Select a contact</span>
                         </div>
                    </div>

                    <div id="messages"></div>

                    <div class="chat-input-container">
                        <input id="message-box" placeholder="Type message..." autocomplete="off">
                        <button id="send-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `);

    $("<style>").html(`
        .chat-wrapper {
            height: calc(100vh - 160px);
            display: flex;
            justify-content: center;
            padding: 20px;
            background-color: var(--bg-light);
        }

        .chat-container {
            width: 100%;
            max-width: 1100px;
            height: 100%;
            display: flex;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid var(--border-color);
        }

        .chat-users {
            width: 300px;
            border-right: 1px solid var(--border-color);
            background: #fdfdfd;
            overflow-y: auto;
        }

        .sidebar-header {
            padding: 20px;
            font-size: 1.1rem;
            font-weight: 700;
            border-bottom: 1px solid var(--border-color);
        }

        .chat-user {
            padding: 12px 15px;
            cursor: pointer;
            display: flex;
            gap: 12px;
            align-items: center;
            border-bottom: 1px solid #f5f5f5;
            transition: background 0.2s;
        }

        .chat-user:hover { background: var(--control-bg); }

        .avatar-circle {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            background: var(--primary);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 13px;
            flex-shrink: 0;
            overflow: hidden;
        }

        .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

        .chat-area { flex: 1; display: flex; flex-direction: column; background: #fff; }

        .chat-header {
            padding: 12px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid var(--border-color);
            background: #fff;
            font-weight: bold;
        }

        #messages {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            background: #f8f9fa;
            display: flex;
            flex-direction: column;
        }

        .date-divider {
            text-align: center;
            margin: 10px 0;
            font-size: 12px;
            color: #000;
        }

        .date-divider span {
            background: #f8f9fa;
            padding: 4px 10px;
            border-radius: 10px;
        }

        .message-left, .message-right {
            max-width: 65%;
            padding: 10px 14px;
            margin-bottom: 10px;
            font-size: 14px;
            line-height: 1.4;
        }

        .message-left {
            background: white;
            border-radius: 15px 15px 15px 2px;
            align-self: flex-start;
            border: 1px solid #eee;
            color: var(--text-color);
        }

        .message-right {
            background: var(--blue-500);
            color: white;
            border-radius: 15px 15px 2px 15px;
            align-self: flex-end;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .chat-input-container {
            display: flex;
            padding: 15px;
            gap: 10px;
            border-top: 1px solid var(--border-color);
            background: #fff;
        }

        #message-box {
            flex: 1;
            padding: 10px 18px;
            border-radius: 20px;
            border: 1px solid var(--border-color);
            outline: none;
            background-color: var(--control-bg);
        }

        #send-btn {
            background: var(--blue-500);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .unread-badge {
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            border-radius: 10px;
            background: var(--red-500, #e53935);
            color: #fff;
            font-size: 11px;
            font-weight: 600;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-top: 6px;
        }
    `).appendTo("head");

    let current_user_chat = null;
    let last_user_list_html = "";
    let load_users_request_id = 0;
    let mark_read_inflight_user = null;

    // ✅ NEW: time formatter
    function format_time(ts){
        let d = frappe.datetime.str_to_obj(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ✅ NEW: date grouping label
    function get_date_label(ts){
        let msgDate = frappe.datetime.str_to_obj(ts);
        let today = frappe.datetime.str_to_obj(frappe.datetime.now_datetime());

        let msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
        let todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        let diff = (todayDay - msgDay) / (1000 * 60 * 60 * 24);

        if(diff === 0) return "Today";
        if(diff === 1) return "Yesterday";

        if(diff < 7){
            return msgDate.toLocaleDateString([], { weekday: 'short' });
        }

        return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }

    function format_sidebar_time(ts){
    let msgDate = frappe.datetime.str_to_obj(ts);
    let today = frappe.datetime.str_to_obj(frappe.datetime.now_datetime());

    let msgDay = new Date(msgDate.getFullYear(), msgDate.getMonth(), msgDate.getDate());
    let todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    let diff = (todayDay - msgDay) / (1000 * 60 * 60 * 24);

    if(diff === 0){
        return msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if(diff === 1){
        return "Yesterday";
    }

    if(diff < 7){
        return msgDate.toLocaleDateString([], { weekday: 'short' });
    }

    return msgDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

    function mark_messages_as_read(user, callback){
        if(!user){
            if(typeof callback === "function") callback();
            return;
        }

        if(mark_read_inflight_user === user){
            if(typeof callback === "function") callback();
            return;
        }

        mark_read_inflight_user = user;
        frappe.call({
            method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.mark_as_read",
            args: { user: user },
            callback: function(){
                mark_read_inflight_user = null;
                if(typeof callback === "function") callback();
            }
        });
    }

    function frappe_call_async(options){
        return new Promise((resolve) => {
            frappe.call({
                ...options,
                callback: function(r){
                    resolve(r || {});
                }
            });
        });
    }

    function parse_ts(ts){
        if(!ts) return 0;
        let d = frappe.datetime.str_to_obj(ts);
        return d ? d.getTime() : 0;
    }

    function esc_attr(value){
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;");
    }

    async function load_users(){
        const request_id = ++load_users_request_id;

        const users_res = await frappe_call_async({
            method: "frappe.client.get_list",
            args: {
                doctype: "User",
                fields: ["email", "first_name", "last_name", "user_image"],
                order_by: "email asc",
                limit_page_length: 500
            }
        });

        let users = (users_res.message || []).filter(user => {
            return user.email !== "admin@example.com"
                && user.email !== "guest@example.com"
                && user.email !== frappe.session.user;
        });

        let list_items = await Promise.all(users.map(async (user) => {
            const role = await frappe_call_async({
                method: "frappe.client.get_list",
                args: {
                    doctype: "Has Role",
                    filters: { parent: user.email, role: "Client" },
                    fields: ["name"],
                    limit: 1
                }
            });

            if(!(role.message || []).length) return null;

            const [last, unread_res] = await Promise.all([
                frappe_call_async({
                    method: "frappe.client.get_list",
                    args: {
                        doctype: "Chat Message",
                        fields: ["message", "timestamp"],
                        filters: [
                            ["sender", "in", [user.email, frappe.session.user]],
                            ["receiver", "in", [user.email, frappe.session.user]]
                        ],
                        order_by: "timestamp desc",
                        limit: 1
                    }
                }),
                frappe_call_async({
                    method: "frappe.client.get_count",
                    args: {
                        doctype: "Chat Message",
                        filters: {
                            sender: user.email,
                            receiver: frappe.session.user,
                            is_read: 0
                        }
                    }
                })
            ]);

            let last_msg = "";
            let last_time = "";
            let last_ts = "";
            let last_ts_value = 0;
            let last_messages = last.message || [];

            if(last_messages.length){
                last_msg = last_messages[0].message || "";
                if(last_msg.length > 15){
                    last_msg = last_msg.substring(0, 15) + "...";
                }

                last_ts = last_messages[0].timestamp;
                last_time = format_sidebar_time(last_ts);
                last_ts_value = parse_ts(last_ts);
            }

            let unread_count = unread_res.message || 0;
            let first_name = user.first_name || user.email;
            let last_name = user.last_name || "";
            let full_name = `${first_name} ${last_name}`.trim();
            let initials = `${first_name[0] || ""}${last_name[0] || ""}` || (user.email[0] || "?");

            let avatar_content = user.user_image
                ? `<img src="${esc_attr(user.user_image)}">`
                : `<span>${initials}</span>`;

            let unread_badge = "";
            if(unread_count > 0){
                unread_badge = `<div class="unread-badge">${unread_count > 99 ? "99+" : unread_count}</div>`;
            }

            return {
                sort_key: last_ts_value,
                email: user.email,
                html: `
                    <div class="chat-user"
                        data-email="${esc_attr(user.email)}"
                        data-full-name="${esc_attr(full_name)}"
                        data-avatar-url="${esc_attr(user.user_image || "")}">

                        <div class="avatar-circle">${avatar_content}</div>

                        <div style="flex:1">
                            <div>${first_name} ${last_name}</div>
                            <div style="font-size:12px;color:#777">${last_msg}</div>
                        </div>

                        <div style="font-size:11px;color:#aaa;display:flex;flex-direction:column;align-items:flex-end">
                            <div>${last_time}</div>
                            ${unread_badge}
                        </div>
                    </div>
                `
            };
        }));

        if(request_id !== load_users_request_id) return;

        list_items = list_items
            .filter(Boolean)
            .sort((a, b) => {
                if(b.sort_key !== a.sort_key) return b.sort_key - a.sort_key;
                return a.email.localeCompare(b.email);
            });

        const new_html = list_items.map(item => item.html).join("");

        if(new_html !== last_user_list_html){
            $("#user-list").html(new_html);
            last_user_list_html = new_html;
        }
    }

    $(document).off("keyup.chat", "#user-search");
    $(document).on("keyup.chat", "#user-search", function(){
        let value = $(this).val().toLowerCase();
        $(".chat-user").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    $(document).off("click.chat", "#user-list .chat-user");
    $(document).on("click.chat", "#user-list .chat-user", function(){
        let user = $(this).data("email");
        let full_name = $(this).data("fullName");
        let avatar_url = $(this).data("avatarUrl");
        open_chat(user, full_name, avatar_url);
    });

    window.open_chat = function(user, full_name, avatar_url){
        current_user_chat = user;
        $("#chat-user").text(full_name || user);

        let header_html = avatar_url 
            ? `<img src="${avatar_url}">` 
            : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
        $("#header-avatar").html(header_html);

        mark_messages_as_read(user, function(){
            load_messages();
            load_users();
        });
    }

    function load_messages(){
        if(!current_user_chat) return;

        frappe.call({
            method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",
            args: { user: current_user_chat },
            callback: function(r) {

                $("#messages").html("");

                let last_date_label = null;

                r.message.forEach(msg => {

                    let side = msg.sender === frappe.session.user ? "message-right" : "message-left";
                    let date_label = get_date_label(msg.timestamp);
                    let time = format_time(msg.timestamp);

                    if(date_label !== last_date_label){
                        $("#messages").append(`
                            <div class="date-divider">
                                <span>${date_label}</span>
                            </div>
                        `);
                        last_date_label = date_label;
                    }

                    $("#messages").append(`
                        <div class="${side}">
                            <div>${msg.message}</div>
                            <div style="font-size:10px;opacity:.6;margin-top:4px">${time}</div>
                        </div>
                    `);

                });

                scroll_bottom();
            }
        });
    }

    $("#send-btn").on("click", function(){
        let message = $("#message-box").val().trim();
        if(!message || !current_user_chat) return;

        frappe.call({
            method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",
            args: { receiver: current_user_chat, message: message },
            callback: function() {
                $("#message-box").val("");
                load_messages();
                load_users();
            }
        });
    });

    $("#message-box").on("keypress", function(e) {
        if(e.which == 13) $("#send-btn").trigger("click");
    });

    // setInterval(function(){
    //     if(current_user_chat){ load_messages(); }
    //     load_users();
    // }, 3000);
    function scroll_bottom(){
        let m = $("#messages");
        if(m.length) m.scrollTop(m[0].scrollHeight);
    }

    load_users();

    if(window.__chat_realtime_handler && frappe.realtime.off){
        frappe.realtime.off("new_chat_message", window.__chat_realtime_handler);
    }

    window.__chat_realtime_handler = function(data){

        if(current_user_chat && data.sender === current_user_chat && data.receiver === frappe.session.user){
            mark_messages_as_read(current_user_chat, function(){
                load_messages();
                load_users();
            });
            return;
        }

        if(current_user_chat === data.sender || current_user_chat === data.receiver){
            load_messages();
        }

        load_users();
    };

    frappe.realtime.on("new_chat_message", window.__chat_realtime_handler);
};