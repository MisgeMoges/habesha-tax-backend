# Copyright (c) 2026, misganmoges03@gmail.com and contributors
# For license information, please see license.txt

# import frappe
import base64
import mimetypes
from urllib.parse import urlparse

import frappe
from frappe.utils import get_url, cstr
from frappe.utils.pdf import get_pdf
from frappe.www.printview import get_rendered_template, get_print_style

from frappe.model.document import Document


class ClientInvoices(Document):
	pass
# apps/habesha_tax/habesha_tax/api/pdf_download.py



def _file_url_to_abs(url: str) -> str:
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("/"):
        return get_url(url)
    return get_url("/" + url)


def _embed_logo_as_data_uri(file_url: str) -> str:
    """Return data URI for /files or /private/files; empty string if not resolvable."""
    if not file_url:
        return ""

    parsed = urlparse(file_url)
    path = parsed.path if parsed.scheme else file_url

    # Handle only frappe file paths
    if not (path.startswith("/files/") or path.startswith("/private/files/")):
        return ""

    file_doc = frappe.db.get_value(
        "File",
        {"file_url": path},
        ["name", "content_hash"],
        as_dict=True,
    )
    if not file_doc:
        return ""

    f = frappe.get_doc("File", file_doc["name"])
    content = f.get_content()  # bytes
    if not content:
        return ""

    mime = mimetypes.guess_type(path)[0] or "image/png"
    b64 = base64.b64encode(content).decode("utf-8")
    return f"data:{mime};base64,{b64}"


@frappe.whitelist()
def download_invoice_pdf_safe(name: str, print_format: str | None = None):
    doctype = "Client Invoices"
    doc = frappe.get_doc(doctype, name)
    frappe.has_permission(doctype=doctype, ptype="read", doc=doc, throw=True)

    # Build a temp render-context copy so we don't mutate DB
    render_doc = frappe._dict(doc.as_dict())

    logo = cstr(render_doc.get("company_logo") or "").strip()
    data_uri = _embed_logo_as_data_uri(logo)

    if data_uri:
        render_doc["company_logo"] = data_uri
    else:
        # fallback to absolute URL (for public files / external URLs)
        render_doc["company_logo"] = _file_url_to_abs(logo)

    html = get_rendered_template(
        doc=render_doc,
        print_format=print_format,
        no_letterhead=0,
        letterhead=None,
        trigger_print=False,
        settings={},
    )
    html = get_print_style(print_format or "Standard") + html

    options = {
        "encoding": "UTF-8",
        "enable-local-file-access": "",
        "load-error-handling": "ignore",
        "load-media-error-handling": "ignore",
        "print-media-type": "",
    }

    pdf = get_pdf(html, options=options)

    frappe.local.response.filename = f"{name}.pdf"
    frappe.local.response.filecontent = pdf
    frappe.local.response.type = "download"