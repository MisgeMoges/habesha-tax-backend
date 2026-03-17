// frappe.pages['chat'].on_page_load = function(wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: "Client Chat",
//         single_column: true
//     });

//     $(page.main).html(`
//         <div class="chat-container">
//             <div class="chat-users">
//                 <div id="user-list"></div>
//             </div>

//             <div class="chat-area">
//                 <div class="chat-header">
//                     Chat with <span id="chat-user"></span>
//                 </div>

//                 <div id="messages"></div>

//                 <div class="chat-input">
//                     <input id="message-box" placeholder="Type message">
//                     <button id="send-btn">Send</button>
//                 </div>
//             </div>
//         </div>
//     `);

//     $("<style>").html(`
//         .chat-container {
//             display:flex;
//             height:100%;
//             font-family: Arial;
//         }

//         .chat-users {
//             width:300px;
//             border-right:1px solid #eee;
//             background:#f7f7f7;
//             overflow-y:auto;
//         }

//         .chat-user {
//             padding:10px;
//             cursor:pointer;
//             display:flex;
//             gap:10px;
//             align-items:center;
//             border-bottom:1px solid #eee;
//         }

//         .chat-user:hover {
//             background:#e8e8e8;
//         }

//         .avatar {
//             width:36px;
//             height:36px;
//             border-radius:50%;
//         }

//         .chat-area {
//             flex:1;
//             display:flex;
//             flex-direction:column;
//         }

//         .chat-header {
//             padding:12px;
//             font-weight:bold;
//             border-bottom:1px solid #eee;
//             background:#fafafa;
//         }

//         #messages {
//             flex:1;
//             padding:20px;
//             overflow-y:auto;
//             background:white;
//         }

//         .message-left {
//             background:#f1f1f1;
//             padding:10px 14px;
//             border-radius:10px;
//             margin-bottom:10px;
//             max-width:60%;
//         }

//         .message-right {
//             background:#DCF8C6;
//             padding:10px 14px;
//             border-radius:10px;
//             margin-bottom:10px;
//             max-width:60%;
//             margin-left:auto;
//         }

//         .chat-input {
//             display:flex;
//             padding:10px;
//             gap:10px;
//             border-top:1px solid #eee;
//             background:#fafafa;
//         }

//         #message-box {
//             flex:1;
//             padding:8px 12px;
//             border-radius:20px;
//             border:1px solid #ccc;
//         }

//         #send-btn {
//             background:#8A56E8;
//             border:none;
//             padding:8px 18px;
//             border-radius:20px;
//             color:white;
//             cursor:pointer;
//         }

//         #send-btn:hover {
//             background:#7338c8;
//         }

//     `).appendTo("head");


//     let current_user_chat = null;


//     // -----------------------------
//     // LOAD CHAT USERS
//     // -----------------------------

//     function load_users(){

//         frappe.call({
// 			// method:"frappe.core.doctype.user.user.get_system_users",
// 			method:"frappe.client.get_list",
//             args:{
//                 doctype:"User",
//                 fields:["email", "first_name", "last_name"]
//             },
//             // method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_chat_users",
//             callback:function(r){

//                 $("#user-list").html("");

//                 r.message.forEach(user => {

//                     if(user.email === "admin@example.com" || user.email === "guest@example.com") return;

//                     $("#user-list").append(`
//                         <div class="chat-user" onclick="open_chat('${user.email}')">
//                             <img class="avatar" src='${user.avatar}' alt="${user.first_name[0]}${user.last_name[0]}'">
//                             <div>${user.first_name} ${user.last_name}</div>
//                         </div>
//                     `);

//                 });

//             }
//         });

//     }


//     // -----------------------------
//     // OPEN CHAT
//     // -----------------------------

//     window.open_chat = function(user){

//         current_user_chat = user;

//         $("#chat-user").text(user);

//         load_messages();

//     }


//     // -----------------------------
//     // LOAD MESSAGES
//     // -----------------------------

//     function load_messages(){

//         if(!current_user_chat) return;

//         frappe.call({

//             method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",

//             args:{
//                 user: current_user_chat
//             },

//             callback:function(r){

//                 $("#messages").html("");

//                 r.message.forEach(msg => {

//                     let side = msg.sender === frappe.session.user
//                         ? "message-right"
//                         : "message-left";

//                     $("#messages").append(`
//                         <div class="${side}">
//                             ${msg.message}
//                         </div>
//                     `);

//                 });

//                 scroll_bottom();

//             }

//         });

//     }


//     // -----------------------------
//     // SEND MESSAGE
//     // -----------------------------

//     $("#send-btn").on("click",function(){

//         let message = $("#message-box").val().trim();

//         if(!message || !current_user_chat) return;

//         frappe.call({

//             method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",

//             args:{
//                 receiver: current_user_chat,
//                 message: message
//             },

//             callback:function(){

//                 $("#message-box").val("");

//                 load_messages();

//             }

//         });

//     });



//     // -----------------------------
//     // AUTO REFRESH
//     // -----------------------------

//     setInterval(function(){

//         if(current_user_chat){
//             load_messages();
//         }

//     },3000);



//     // -----------------------------
//     // SCROLL
//     // -----------------------------

//     function scroll_bottom(){

//         let m = $("#messages");

//         m.scrollTop(m[0].scrollHeight);

//     }


//     load_users();

// }
// frappe.pages['chat'].on_page_load = function(wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: "Client Chat",
//         single_column: true
//     });

//     $(page.main).html(`
//         <div class="chat-main-wrapper">
//             <div class="chat-container">
//                 <div class="chat-users">
//                     <div class="sidebar-header">Contacts</div>
//                     <div id="user-list"></div>
//                 </div>

//                 <div class="chat-area">
//                     <div class="chat-header">
//                         <div id="header-avatar" class="avatar-circle"></div>
//                         <div class="header-info">
//                             <span id="chat-user">Select a user</span>
//                         </div>
//                     </div>

//                     <div id="messages"></div>

//                     <div class="chat-input">
//                         <input id="message-box" placeholder="Type a message...">
//                         <button id="send-btn">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);

//     $("<style>").html(`
//         .chat-main-wrapper {
//             height: calc(100vh - 160px);
//             display: flex;
//             justify-content: center;
//             background-color: #f0f2f5;
//             padding: 20px;
//         }

//         .chat-container {
//             display: flex;
//             width: 100%;
//             max-width: 1200px;
//             height: 100%;
//             background: white;
//             border-radius: 12px;
//             box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//             overflow: hidden;
//         }

//         .chat-users {
//             width: 320px;
//             border-right: 1px solid #ebebeb;
//             background: #ffffff;
//             display: flex;
//             flex-direction: column;
//         }

//         .sidebar-header {
//             padding: 20px;
//             font-size: 18px;
//             font-weight: 700;
//             border-bottom: 1px solid #f0f0f0;
//         }

//         .chat-user {
//             padding: 15px 20px;
//             cursor: pointer;
//             display: flex;
//             gap: 12px;
//             align-items: center;
//             border-bottom: 1px solid #f9f9f9;
//             transition: background 0.2s;
//         }

//         .chat-user:hover { background: #f5f7fb; }

//         .avatar-circle {
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             background: #8A56E8;
//             color: white;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: bold;
//             flex-shrink: 0;
//             overflow: hidden;
//             font-size: 14px;
//         }

//         .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

//         .chat-area {
//             flex: 1;
//             display: flex;
//             flex-direction: column;
//             background: #fdfdfd;
//         }

//         .chat-header {
//             padding: 15px 25px;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             border-bottom: 1px solid #eee;
//             background: white;
//         }

//         #chat-user { font-weight: 600; font-size: 16px; }

//         #messages {
//             flex: 1;
//             padding: 25px;
//             overflow-y: auto;
//             background: #f8f9fa;
//             display: flex;
//             flex-direction: column;
//         }

//         .message-left, .message-right {
//             padding: 10px 16px;
//             margin-bottom: 8px;
//             max-width: 65%;
//             font-size: 14px;
//             line-height: 1.4;
//             box-shadow: 0 1px 2px rgba(0,0,0,0.05);
//         }

//         .message-left {
//             background: white;
//             color: #333;
//             border-radius: 18px 18px 18px 4px;
//             align-self: flex-start;
//         }

//         .message-right {
//             background: #8A56E8;
//             color: white;
//             border-radius: 18px 18px 4px 18px;
//             align-self: flex-end;
//         }

//         .chat-input {
//             display: flex;
//             padding: 20px;
//             gap: 12px;
//             background: white;
//             border-top: 1px solid #eee;
//         }

//         #message-box {
//             flex: 1;
//             padding: 12px 20px;
//             border-radius: 25px;
//             border: 1px solid #e0e0e0;
//             outline: none;
//             font-size: 14px;
//         }

//         #message-box:focus { border-color: #8A56E8; }

//         #send-btn {
//             background: #8A56E8;
//             border: none;
//             width: 45px;
//             height: 45px;
//             border-radius: 50%;
//             color: white;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             transition: background 0.2s;
//         }

//         #send-btn:hover { background: #7338c8; }
//     `).appendTo("head");


//     let current_user_chat = null;

//     // Helper to handle avatars
//     function get_avatar(user) {
//         if (user.avatar) {
//             return `<img src='${user.avatar}'>`;
//         } else {
//             const initials = (user.first_name?.[0] || "") + (user.last_name?.[0] || "");
//             return `<span>${initials.toUpperCase() || '?'}</span>`;
//         }
//     }

//     // -----------------------------
//     // LOAD CHAT USERS
//     // -----------------------------
//     function load_users(){
//         frappe.call({
//             method:"frappe.client.get_list",
//             args:{
//                 doctype:"User",
//                 fields:["email", "first_name", "last_name", "user_image as avatar"]
//             },
//             callback:function(r){
//                 $("#user-list").empty();
//                 r.message.forEach(user => {
//                     if(user.email === "admin@example.com" || user.email === "guest@example.com" || user.email === frappe.session.user) return;

//                     let avatar_html = get_avatar(user);

//                     $("#user-list").append(`
//                         <div class="chat-user" onclick="open_chat('${user.email}', '${user.first_name} ${user.last_name}', '${user.avatar || ''}')">
//                             <div class="avatar-circle">${avatar_html}</div>
//                             <div style="font-weight:500;">${user.first_name} ${user.last_name}</div>
//                         </div>
//                     `);
//                 });
//             }
//         });
//     }

//     // -----------------------------
//     // OPEN CHAT
//     // -----------------------------
//     window.open_chat = function(user, full_name, avatar_url){
//         current_user_chat = user;
//         $("#chat-user").text(full_name || user);
        
//         let header_avatar = avatar_url ? `<img src="${avatar_url}">` : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
//         $("#header-avatar").html(header_avatar);

//         load_messages();
//     }

//     // -----------------------------
//     // LOAD MESSAGES
//     // -----------------------------
//     function load_messages(){
//         if(!current_user_chat) return;
//         frappe.call({
//             method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",
//             args:{ user: current_user_chat },
//             callback:function(r){
//                 $("#messages").html("");
//                 r.message.forEach(msg => {
//                     let side = msg.sender === frappe.session.user ? "message-right" : "message-left";
//                     $("#messages").append(`<div class="${side}">${msg.message}</div>`);
//                 });
//                 scroll_bottom();
//             }
//         });
//     }

//     // -----------------------------
//     // SEND MESSAGE
//     // -----------------------------
//     $("#send-btn").on("click",function(){
//         let message = $("#message-box").val().trim();
//         if(!message || !current_user_chat) return;
//         frappe.call({
//             method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",
//             args:{ receiver: current_user_chat, message: message },
//             callback:function(){
//                 $("#message-box").val("");
//                 load_messages();
//             }
//         });
//     });

//     // Handle Enter Key
//     $("#message-box").on("keypress", function(e) {
//         if(e.which == 13) $("#send-btn").trigger("click");
//     });

//     setInterval(function(){
//         if(current_user_chat){ load_messages(); }
//     }, 3000);

//     function scroll_bottom(){
//         let m = $("#messages");
//         m.scrollTop(m[0].scrollHeight);
//     }

//     load_users();
// }


// frappe.pages['chat'].on_page_load = function(wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: __("Client Chat"),
//         single_column: true
//     });

//     $(page.main).html(`
//         <div class="chat-wrapper">
//             <div class="chat-container">
//                 <div class="chat-users">
//                     <div class="sidebar-header">Messages</div>
//                     <div id="user-list"></div>
//                 </div>

//                 <div class="chat-area">
//                     <div class="chat-header">
//                          <div id="header-avatar" class="avatar-circle"></div>
//                          <div class="header-info">
//                             <span id="chat-user">Select a contact</span>
//                          </div>
//                     </div>

//                     <div id="messages"></div>

//                     <div class="chat-input-container">
//                         <input id="message-box" placeholder="Type message..." autocomplete="off">
//                         <button id="send-btn">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);

//     $("<style>").html(`
//         .chat-wrapper {
//             height: calc(100vh - 160px);
//             display: flex;
//             justify-content: center;
//             padding: 20px;
//             background-color: var(--bg-light);
//         }

//         .chat-container {
//             width: 100%;
//             max-width: 1100px;
//             height: 100%;
//             display: flex;
//             background: #fff;
//             border-radius: 12px;
//             box-shadow: 0 8px 24px rgba(0,0,0,0.08);
//             overflow: hidden;
//             border: 1px solid var(--border-color);
//         }

//         .chat-users {
//             width: 300px;
//             border-right: 1px solid var(--border-color);
//             background: #fdfdfd;
//             overflow-y: auto;
//         }

//         .sidebar-header {
//             padding: 20px;
//             font-size: 1.1rem;
//             font-weight: 700;
//             border-bottom: 1px solid var(--border-color);
//         }

//         .chat-user {
//             padding: 12px 15px;
//             cursor: pointer;
//             display: flex;
//             gap: 12px;
//             align-items: center;
//             border-bottom: 1px solid #f5f5f5;
//             transition: background 0.2s;
//         }

//         .chat-user:hover { background: var(--control-bg); }

//         .avatar-circle {
//             width: 38px;
//             height: 38px;
//             border-radius: 50%;
//             background: var(--primary);
//             color: white;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: bold;
//             font-size: 13px;
//             flex-shrink: 0;
//             overflow: hidden;
//         }

//         .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

//         .chat-area { flex: 1; display: flex; flex-direction: column; background: #fff; }

//         .chat-header {
//             padding: 12px 20px;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             border-bottom: 1px solid var(--border-color);
//             background: #fff;
//             font-weight: bold;
//         }

//         #messages {
//             flex: 1;
//             padding: 20px;
//             overflow-y: auto;
//             background: #f8f9fa;
//             display: flex;
//             flex-direction: column;
//         }

//         .message-left, .message-right {
//             max-width: 65%;
//             padding: 10px 14px;
//             margin-bottom: 10px;
//             font-size: 14px;
//             line-height: 1.4;
//         }

//         .message-left {
//             background: white;
//             border-radius: 15px 15px 15px 2px;
//             align-self: flex-start;
//             border: 1px solid #eee;
//             color: var(--text-color);
//         }

//         .message-right {
//             background: var(--blue-500);
//             color: white;
//             border-radius: 15px 15px 2px 15px;
//             align-self: flex-end;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }

//         .chat-input-container {
//             display: flex;
//             padding: 15px;
//             gap: 10px;
//             border-top: 1px solid var(--border-color);
//             background: #fff;
//         }

//         #message-box {
//             flex: 1;
//             padding: 10px 18px;
//             border-radius: 20px;
//             border: 1px solid var(--border-color);
//             outline: none;
//             background-color: var(--control-bg);
//         }

//         #send-btn {
//             background: var(--blue-500);
//             border: none;
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             color: white;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             transition: background 0.2s;
//         }

//         #send-btn:hover {
//             background: var(--blue-600);
//         }
//     `).appendTo("head");

//     let current_user_chat = null;

//     // -----------------------------
//     // LOAD CHAT USERS
//     // -----------------------------
//     function load_users(){
//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "User",
//                 fields: ["email", "first_name", "last_name", "user_image"]
//             },
//             callback: function(r) {
//                 $("#user-list").html("");
//                 r.message.forEach(user => {
//                     if (user.email === "admin@example.com" || user.email === "guest@example.com" || user.email === frappe.session.user) return;

//                     let avatar_content = user.user_image 
//                         ? `<img src="${user.user_image}">` 
//                         : `<span>${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}</span>`;

//                     $("#user-list").append(`
//                         <div class="chat-user" onclick="open_chat('${user.email}', '${user.first_name} ${user.last_name}', '${user.user_image || ''}')">
//                             <div class="avatar-circle">${avatar_content.toUpperCase()}</div>
//                             <div>${user.first_name} ${user.last_name || ''}</div>
//                         </div>
//                     `);
//                 });
//             }
//         });
//     }

//     // -----------------------------
//     // OPEN CHAT
//     // -----------------------------
//     window.open_chat = function(user, full_name, avatar_url){
//         current_user_chat = user;
//         $("#chat-user").text(full_name || user);

//         let header_html = avatar_url 
//             ? `<img src="${avatar_url}">` 
//             : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
//         $("#header-avatar").html(header_html);

//         load_messages();
//     }

//     // -----------------------------
//     // LOAD MESSAGES
//     // -----------------------------
//     function load_messages(){
//         if(!current_user_chat) return;
//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",
//             args: { user: current_user_chat },
//             callback: function(r) {
//                 $("#messages").html("");
//                 r.message.forEach(msg => {
//                     let side = msg.sender === frappe.session.user ? "message-right" : "message-left";
//                     $("#messages").append(`<div class="${side}">${msg.message}</div>`);
//                 });
//                 scroll_bottom();
//             }
//         });
//     }

//     // -----------------------------
//     // SEND MESSAGE
//     // -----------------------------
//     $("#send-btn").on("click", function(){
//         let message = $("#message-box").val().trim();
//         if(!message || !current_user_chat) return;
//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",
//             args: { receiver: current_user_chat, message: message },
//             callback: function() {
//                 $("#message-box").val("");
//                 load_messages();
//             }
//         });
//     });

//     $("#message-box").on("keypress", function(e) {
//         if(e.which == 13) $("#send-btn").trigger("click");
//     });

//     setInterval(function(){
//         if(current_user_chat){ load_messages(); }
//     }, 3000);

//     function scroll_bottom(){
//         let m = $("#messages");
//         if(m.length) m.scrollTop(m[0].scrollHeight);
//     }

//     load_users();
// };

// frappe.pages['chat'].on_page_load = function(wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: __("Client Chat"),
//         single_column: true
//     });

//     $(page.main).html(`
//         <div class="chat-wrapper">
//             <div class="chat-container">
//                 <div class="chat-users">
//                     <div class="sidebar-header">Messages</div>

//                     <div style="padding:10px">
//                         <input id="user-search" placeholder="Search user..."
//                         style="width:100%;padding:6px;border:1px solid #ddd;border-radius:6px;">
//                     </div>

//                     <div id="user-list"></div>
//                 </div>

//                 <div class="chat-area">
//                     <div class="chat-header">
//                          <div id="header-avatar" class="avatar-circle"></div>
//                          <div class="header-info">
//                             <span id="chat-user">Select a contact</span>
//                          </div>
//                     </div>

//                     <div id="messages"></div>

//                     <div class="chat-input-container">
//                         <input id="message-box" placeholder="Type message..." autocomplete="off">
//                         <button id="send-btn">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                                 <line x1="22" y1="2" x2="11" y2="13"></line>
//                                 <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);

//     $("<style>").html(`
//         .chat-wrapper {
//             height: calc(100vh - 160px);
//             display: flex;
//             justify-content: center;
//             padding: 20px;
//             background-color: var(--bg-light);
//         }

//         .chat-container {
//             width: 100%;
//             max-width: 1100px;
//             height: 100%;
//             display: flex;
//             background: #fff;
//             border-radius: 12px;
//             box-shadow: 0 8px 24px rgba(0,0,0,0.08);
//             overflow: hidden;
//             border: 1px solid var(--border-color);
//         }

//         .chat-users {
//             width: 300px;
//             border-right: 1px solid var(--border-color);
//             background: #fdfdfd;
//             overflow-y: auto;
//         }

//         .sidebar-header {
//             padding: 20px;
//             font-size: 1.1rem;
//             font-weight: 700;
//             border-bottom: 1px solid var(--border-color);
//         }

//         .chat-user {
//             padding: 12px 15px;
//             cursor: pointer;
//             display: flex;
//             gap: 12px;
//             align-items: center;
//             border-bottom: 1px solid #f5f5f5;
//             transition: background 0.2s;
//         }

//         .chat-user:hover { background: var(--control-bg); }

//         .avatar-circle {
//             width: 38px;
//             height: 38px;
//             border-radius: 50%;
//             background: var(--primary);
//             color: white;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: bold;
//             font-size: 13px;
//             flex-shrink: 0;
//             overflow: hidden;
//         }

//         .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

//         .unread-badge{
//             background:#ff3b30;
//             color:white;
//             font-size:11px;
//             padding:2px 7px;
//             border-radius:12px;
//             font-weight:600;
//             min-width:18px;
//             text-align:center;
//         }

//         .chat-area { flex: 1; display: flex; flex-direction: column; background: #fff; }

//         .chat-header {
//             padding: 12px 20px;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             border-bottom: 1px solid var(--border-color);
//             background: #fff;
//             font-weight: bold;
//         }

//         #messages {
//             flex: 1;
//             padding: 20px;
//             overflow-y: auto;
//             background: #f8f9fa;
//             display: flex;
//             flex-direction: column;
//         }

//         .message-left, .message-right {
//             max-width: 65%;
//             padding: 10px 14px;
//             margin-bottom: 10px;
//             font-size: 14px;
//             line-height: 1.4;
//         }

//         .message-left {
//             background: white;
//             border-radius: 15px 15px 15px 2px;
//             align-self: flex-start;
//             border: 1px solid #eee;
//         }

//         .message-right {
//             background: var(--blue-500);
//             color: white;
//             border-radius: 15px 15px 2px 15px;
//             align-self: flex-end;
//         }

//         .chat-input-container {
//             display: flex;
//             padding: 15px;
//             gap: 10px;
//             border-top: 1px solid var(--border-color);
//             background: #fff;
//         }

//         #message-box {
//             flex: 1;
//             padding: 10px 18px;
//             border-radius: 20px;
//             border: 1px solid var(--border-color);
//         }

//         #send-btn {
//             background: var(--blue-500);
//             border: none;
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             color: white;
//             cursor: pointer;
//         }
//     `).appendTo("head");

//     let current_user_chat = null;

//     function load_users(){
//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "User",
//                 fields: ["email", "first_name", "last_name", "user_image"]
//             },
//             callback: function(r) {

//                 $("#user-list").html("");

//                 r.message.forEach(user => {

//                     if (user.email === "admin@example.com" || user.email === "guest@example.com" || user.email === frappe.session.user) return;

//                     frappe.call({
//                         method:"frappe.client.get_list",
//                         args:{
//                             doctype:"Has Role",
//                             filters:{ parent:user.email, role:"Client" }
//                         },
//                         callback:function(role){

//                             if(!role.message.length) return;

//                             frappe.call({
//                                 method:"frappe.client.get_list",
//                                 args:{
//                                     doctype:"Chat Message",
//                                     fields:["message","timestamp"],
//                                     filters:[
//                                         ["sender","in",[user.email,frappe.session.user]],
//                                         ["receiver","in",[user.email,frappe.session.user]]
//                                     ],
//                                     order_by:"timestamp desc",
//                                     limit:1
//                                 },
//                                 callback:function(last){

//                                     let last_msg = "";
//                                     let last_time = "";

//                                     if(last.message.length){
//                                         last_msg = last.message[0].message;
//                                         if(last_msg.length > 15){
//                                             last_msg = last_msg.substring(0,15) + "...";
//                                         }
//                                         last_time = frappe.datetime.str_to_user(last.message[0].timestamp);
//                                     }

//                                     let avatar_content = user.user_image 
//                                         ? `<img src="${user.user_image}">` 
//                                         : `<span>${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}</span>`;

//                                     frappe.call({
//                                         method:"frappe.client.get_count",
//                                         args:{
//                                             doctype:"Chat Message",
//                                             filters:{
//                                                 sender:user.email,
//                                                 receiver:frappe.session.user,
//                                                 is_read:0
//                                             }
//                                         },
//                                         callback:function(unread){

//                                             let unread_badge = "";
//                                             if(unread.message > 0){
//                                                 unread_badge = `<div class="unread-badge">${unread.message}</div>`;
//                                             }

//                                             $("#user-list").append(`
//                                                 <div class="chat-user"
//                                                 onclick="open_chat('${user.email}', '${user.first_name} ${user.last_name}', '${user.user_image || ''}')">

//                                                     <div class="avatar-circle">${avatar_content}</div>

//                                                     <div style="flex:1">
//                                                         <div>${user.first_name} ${user.last_name || ''}</div>
//                                                         <div style="font-size:12px;color:#777">${last_msg}</div>
//                                                     </div>

//                                                     <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
//                                                         <div style="font-size:11px;color:#aaa">${last_time}</div>
//                                                         ${unread_badge}
//                                                     </div>
//                                                 </div>
//                                             `);
//                                         }
//                                     });

//                                 }
//                             });

//                         }
//                     });

//                 });
//             }
//         });
//     }

//     window.open_chat = function(user, full_name, avatar_url){

//         current_user_chat = user;
//         $("#chat-user").text(full_name || user);

//         let header_html = avatar_url 
//             ? `<img src="${avatar_url}">` 
//             : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
//         $("#header-avatar").html(header_html);

//         frappe.call({
//             method:"habesha_tax.habesha_tax.doctype.chat_message.chat_message.mark_as_read",
//             args:{ user:user }
//         });

//         load_messages();
//         load_users();
//     }

//     function load_messages(){
//         if(!current_user_chat) return;

//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",
//             args: { user: current_user_chat },
//             callback: function(r) {

//                 $("#messages").html("");

//                 r.message.forEach(msg => {

//                     let side = msg.sender === frappe.session.user ? "message-right" : "message-left";
//                     let time = frappe.datetime.str_to_user(msg.timestamp);

//                     $("#messages").append(`
//                         <div class="${side}">
//                             <div>${msg.message}</div>
//                             <div style="font-size:10px;opacity:.6;margin-top:4px">${time}</div>
//                         </div>
//                     `);

//                 });

//                 scroll_bottom();
//             }
//         });
//     }

//     $("#send-btn").on("click", function(){

//         let message = $("#message-box").val().trim();
//         if(!message || !current_user_chat) return;

//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",
//             args: { receiver: current_user_chat, message: message },
//             callback: function() {

//                 $("#message-box").val("");
//                 load_messages();
//                 load_users();

//             }
//         });
//     });

//     $("#message-box").on("keypress", function(e) {
//         if(e.which == 13) $("#send-btn").trigger("click");
//     });

//     // setInterval(function(){
//     //     if(current_user_chat){ load_messages(); }
//     // }, 3000);

//     function scroll_bottom(){
//         let m = $("#messages");
//         if(m.length) m.scrollTop(m[0].scrollHeight);
//     }

//     load_users();
// };

// frappe.pages['chat'].on_page_load = function(wrapper) {

//     let page = frappe.ui.make_app_page({
//         parent: wrapper,
//         title: __("Client Chat"),
//         single_column: true
//     });

//     $(page.main).html(`
//         <div class="chat-wrapper">
//             <div class="chat-container">
//                 <div class="chat-users">
//                     <div class="sidebar-header">Messages</div>

//                     <div style="padding:10px">
//                         <input id="user-search" placeholder="Search user..."
//                         style="width:100%;padding:6px;border:1px solid #ddd;border-radius:6px;">
//                     </div>

//                     <div id="user-list"></div>
//                 </div>

//                 <div class="chat-area">
//                     <div class="chat-header">
//                          <div id="header-avatar" class="avatar-circle"></div>
//                          <div class="header-info">
//                             <span id="chat-user">Select a contact</span>
//                          </div>
//                     </div>

//                     <div id="messages"></div>

//                     <div class="chat-input-container">
//                         <input id="message-box" placeholder="Type message..." autocomplete="off">
//                         <button id="send-btn">
//                             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
//                                 <line x1="22" y1="2" x2="11" y2="13"></line>
//                                 <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
//                             </svg>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     `);

//     $("<style>").html(`
//         .chat-wrapper {
//             height: calc(100vh - 160px);
//             display: flex;
//             justify-content: center;
//             padding: 20px;
//             background-color: var(--bg-light);
//         }

//         .chat-container {
//             width: 100%;
//             max-width: 1100px;
//             height: 100%;
//             display: flex;
//             background: #fff;
//             border-radius: 12px;
//             box-shadow: 0 8px 24px rgba(0,0,0,0.08);
//             overflow: hidden;
//             border: 1px solid var(--border-color);
//         }

//         .chat-users {
//             width: 300px;
//             border-right: 1px solid var(--border-color);
//             background: #fdfdfd;
//             overflow-y: auto;
//         }

//         .sidebar-header {
//             padding: 20px;
//             font-size: 1.1rem;
//             font-weight: 700;
//             border-bottom: 1px solid var(--border-color);
//         }

//         .chat-user {
//             padding: 12px 15px;
//             cursor: pointer;
//             display: flex;
//             gap: 12px;
//             align-items: center;
//             border-bottom: 1px solid #f5f5f5;
//             transition: background 0.2s;
//         }

//         .chat-user:hover { background: var(--control-bg); }

//         .avatar-circle {
//             width: 38px;
//             height: 38px;
//             border-radius: 50%;
//             background: var(--primary);
//             color: white;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//             font-weight: bold;
//             font-size: 13px;
//             flex-shrink: 0;
//             overflow: hidden;
//         }

//         .avatar-circle img { width: 100%; height: 100%; object-fit: cover; }

//         .chat-area { flex: 1; display: flex; flex-direction: column; background: #fff; }

//         .chat-header {
//             padding: 12px 20px;
//             display: flex;
//             align-items: center;
//             gap: 12px;
//             border-bottom: 1px solid var(--border-color);
//             background: #fff;
//             font-weight: bold;
//         }

//         #messages {
//             flex: 1;
//             padding: 20px;
//             overflow-y: auto;
//             background: #f8f9fa;
//             display: flex;
//             flex-direction: column;
//         }

//         .message-left, .message-right {
//             max-width: 65%;
//             padding: 10px 14px;
//             margin-bottom: 10px;
//             font-size: 14px;
//             line-height: 1.4;
//         }

//         .message-left {
//             background: white;
//             border-radius: 15px 15px 15px 2px;
//             align-self: flex-start;
//             border: 1px solid #eee;
//             color: var(--text-color);
//         }

//         .message-right {
//             background: var(--blue-500);
//             color: white;
//             border-radius: 15px 15px 2px 15px;
//             align-self: flex-end;
//             box-shadow: 0 2px 4px rgba(0,0,0,0.1);
//         }

//         .chat-input-container {
//             display: flex;
//             padding: 15px;
//             gap: 10px;
//             border-top: 1px solid var(--border-color);
//             background: #fff;
//         }

//         #message-box {
//             flex: 1;
//             padding: 10px 18px;
//             border-radius: 20px;
//             border: 1px solid var(--border-color);
//             outline: none;
//             background-color: var(--control-bg);
//         }

//         #send-btn {
//             background: var(--blue-500);
//             border: none;
//             width: 40px;
//             height: 40px;
//             border-radius: 50%;
//             color: white;
//             cursor: pointer;
//             display: flex;
//             align-items: center;
//             justify-content: center;
//         }
//     `).appendTo("head");

//     let current_user_chat = null;

//     function load_users(){
//         frappe.call({
//             method: "frappe.client.get_list",
//             args: {
//                 doctype: "User",
//                 fields: ["email", "first_name", "last_name", "user_image"]
//             },
//             callback: function(r) {

//                 $("#user-list").html("");

//                 r.message.forEach(user => {

//                     if (user.email === "admin@example.com" || user.email === "guest@example.com" || user.email === frappe.session.user) return;

//                     frappe.call({
//                         method:"frappe.client.get_list",
//                         args:{
//                             doctype:"Has Role",
//                             filters:{ parent:user.email, role:"Client" }
//                         },
//                         callback:function(role){

//                             if(!role.message.length) return;

//                             frappe.call({
//                                 method:"frappe.client.get_list",
//                                 args:{
//                                     doctype:"Chat Message",
//                                     fields:["message","timestamp"],
//                                     filters:[
//                                         ["sender","in",[user.email,frappe.session.user]],
//                                         ["receiver","in",[user.email,frappe.session.user]]
//                                     ],
//                                     order_by:"timestamp desc",
//                                     limit:1
//                                 },
//                                 callback:function(last){

//                                     let last_msg = "";
//                                     let last_time = "";

//                                     if(last.message.length){

//                                         last_msg = last.message[0].message;

//                                         // truncate long message
//                                         if(last_msg.length > 15){
//                                             last_msg = last_msg.substring(0,15) + "...";
//                                         }

//                                         last_time = frappe.datetime.str_to_user(last.message[0].timestamp);
//                                     }

//                                     let avatar_content = user.user_image 
//                                         ? `<img src="${user.user_image}">` 
//                                         : `<span>${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}</span>`;

//                                     $("#user-list").append(`
//                                         <div class="chat-user"
//                                         onclick="open_chat('${user.email}', '${user.first_name} ${user.last_name}', '${user.user_image || ''}')">

//                                             <div class="avatar-circle">${avatar_content}</div>

//                                             <div style="flex:1">
//                                                 <div>${user.first_name} ${user.last_name || ''}</div>
//                                                 <div style="font-size:12px;color:#777">${last_msg}</div>
//                                             </div>

//                                             <div style="font-size:11px;color:#aaa">${last_time}</div>
//                                         </div>
//                                     `);

//                                 }
//                             });

//                         }
//                     });

//                 });
//             }
//         });
//     }

//     $(document).on("keyup","#user-search",function(){
//         let value = $(this).val().toLowerCase();
//         $(".chat-user").filter(function(){
//             $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
//         });
//     });

//     window.open_chat = function(user, full_name, avatar_url){
//         current_user_chat = user;
//         $("#chat-user").text(full_name || user);

//         let header_html = avatar_url 
//             ? `<img src="${avatar_url}">` 
//             : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
//         $("#header-avatar").html(header_html);

//         load_messages();
//     }

//     function load_messages(){
//         if(!current_user_chat) return;
//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.get_messages",
//             args: { user: current_user_chat },
//             callback: function(r) {
//                 $("#messages").html("");
//                 r.message.forEach(msg => {

//                     let side = msg.sender === frappe.session.user ? "message-right" : "message-left";
//                     let time = frappe.datetime.str_to_user(msg.timestamp);

//                     $("#messages").append(`
//                         <div class="${side}">
//                             <div>${msg.message}</div>
//                             <div style="font-size:10px;opacity:.6;margin-top:4px">${time}</div>
//                         </div>
//                     `);

//                 });
//                 scroll_bottom();
//             }
//         });
//     }

//     $("#send-btn").on("click", function(){
//         let message = $("#message-box").val().trim();
//         if(!message || !current_user_chat) return;

//         frappe.call({
//             method: "habesha_tax.habesha_tax.doctype.chat_message.chat_message.send_message",
//             args: { receiver: current_user_chat, message: message },
//             callback: function() {
//                 $("#message-box").val("");
//                 load_messages();
//                 load_users();
//             }
//         });
//     });

//     $("#message-box").on("keypress", function(e) {
//         if(e.which == 13) $("#send-btn").trigger("click");
//     });

//     // setInterval(function(){
//     //     if(current_user_chat){ load_messages(); }
//     // }, 3000);

//     function scroll_bottom(){
//         let m = $("#messages");
//         if(m.length) m.scrollTop(m[0].scrollHeight);
//     }

//     load_users();
// };

// frappe.realtime.on("new_chat_message", function(data){

//     // if chat with this user is open
//     if(current_user_chat === data.sender || current_user_chat === data.receiver){
//         load_messages();
//     }

//     // refresh sidebar users
//     load_users();
// });

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
    `).appendTo("head");

    let current_user_chat = null;

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

    function load_users(){
        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "User",
                fields: ["email", "first_name", "last_name", "user_image"]
            },
            callback: function(r) {

                $("#user-list").html("");

                r.message.forEach(user => {

                    if (user.email === "admin@example.com" || user.email === "guest@example.com" || user.email === frappe.session.user) return;

                    frappe.call({
                        method:"frappe.client.get_list",
                        args:{
                            doctype:"Has Role",
                            filters:{ parent:user.email, role:"Client" }
                        },
                        callback:function(role){

                            if(!role.message.length) return;

                            frappe.call({
                                method:"frappe.client.get_list",
                                args:{
                                    doctype:"Chat Message",
                                    fields:["message","timestamp"],
                                    filters:[
                                        ["sender","in",[user.email,frappe.session.user]],
                                        ["receiver","in",[user.email,frappe.session.user]]
                                    ],
                                    order_by:"timestamp desc",
                                    limit:1
                                },
                                callback:function(last){

                                    let last_msg = "";
                                    let last_time = "";

                                    if(last.message.length){

                                        last_msg = last.message[0].message;

                                        if(last_msg.length > 15){
                                            last_msg = last_msg.substring(0,15) + "...";
                                        }

                                        last_time = format_sidebar_time(last.message[0].timestamp);
                                    }

                                    let avatar_content = user.user_image 
                                        ? `<img src="${user.user_image}">` 
                                        : `<span>${user.first_name[0]}${user.last_name ? user.last_name[0] : ''}</span>`;

                                    $("#user-list").append(`
                                        <div class="chat-user"
                                        onclick="open_chat('${user.email}', '${user.first_name} ${user.last_name}', '${user.user_image || ''}')">

                                            <div class="avatar-circle">${avatar_content}</div>

                                            <div style="flex:1">
                                                <div>${user.first_name} ${user.last_name || ''}</div>
                                                <div style="font-size:12px;color:#777">${last_msg}</div>
                                            </div>

                                            <div style="font-size:11px;color:#aaa">${last_time}</div>
                                        </div>
                                    `);

                                }
                            });

                        }
                    });

                });
            }
        });
    }

    $(document).on("keyup","#user-search",function(){
        let value = $(this).val().toLowerCase();
        $(".chat-user").filter(function(){
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });

    window.open_chat = function(user, full_name, avatar_url){
        current_user_chat = user;
        $("#chat-user").text(full_name || user);

        let header_html = avatar_url 
            ? `<img src="${avatar_url}">` 
            : `<span>${(full_name || user)[0].toUpperCase()}</span>`;
        $("#header-avatar").html(header_html);

        load_messages();
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

    setInterval(function(){
        if(current_user_chat){ load_messages(); }
    }, 3000);
    function scroll_bottom(){
        let m = $("#messages");
        if(m.length) m.scrollTop(m[0].scrollHeight);
    }

    load_users();
};

frappe.realtime.on("new_chat_message", function(data){

    if(current_user_chat === data.sender || current_user_chat === data.receiver){
        load_messages();
    }

    load_users();
});