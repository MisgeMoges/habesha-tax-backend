frappe.listview_settings["Client Booking"] = {
    onload: function(listview) {
        if (frappe.get_route()[2] !== "calendar") {
            frappe.set_route("List", "Client Booking", "Calendar");
        }
    }
};