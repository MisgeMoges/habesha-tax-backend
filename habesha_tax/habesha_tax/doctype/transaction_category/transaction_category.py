# Copyright (c) 2026, misganmoges03@gmail.com and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document


class TransactionCategory(Document):
	pass
@frappe.whitelist(allow_guest=True)
def get_transaction_categories():
    """API to get all transaction categories"""
    try:
        categories = frappe.get_all(
            "Transaction Category",
            fields=["name", "category_name"],
            order_by="category_name asc"
        )
        # Return both name and category_name
        return {
            "success": True, 
            "data": [
                {
                    "id": c["name"],           # Unique identifier (store this)
                    "name": c["category_name"] # Display name (show this)
                } 
                for c in categories
            ]
        }
    except Exception as e:
        frappe.log_error(f"Failed to get transaction categories: {str(e)}")
        return {"success": False, "message": "Failed to fetch transaction categories."}