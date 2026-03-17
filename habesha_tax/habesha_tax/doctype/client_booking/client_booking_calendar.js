frappe.views.calendar["Client Booking"] = {
    field_map: {
        start: "booking_date",
        end: 'booking_date',
        id: "name",
        title: "full_name",
        status: "status"
    },

    

    get_events_method: "frappe.desk.calendar.get_events",

    event_render: function(info) {
        let status = info.event.extendedProps.status;

        if (status === "Pending") {
            info.el.style.backgroundColor = "#f39c12";
        } else if (status === "Confirmed") {
            info.el.style.backgroundColor = "#28a745";
        } else if (status === "Reschedule") {
            info.el.style.backgroundColor = "#dc3545";
        }
    }


};