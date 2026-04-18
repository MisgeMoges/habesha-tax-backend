# Copyright (c) 2026, misganmoges03@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ClientInvoices(Document):
	pass

@frappe.whitelist()
def custom_download_pdf(doctype, name, format=None):
    html = frappe.get_print(doctype, name, print_format=format)

    pdf = frappe.utils.pdf.get_pdf(html, {
        "load-error-handling": "ignore",
        "load-media-error-handling": "ignore"
    })

    frappe.local.response.filename = f"{name}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "pdf"