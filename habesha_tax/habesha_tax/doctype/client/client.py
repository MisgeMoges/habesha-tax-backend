# Copyright (c) 2026, misganmoges03@gmail.com and contributors
# For license information, please see license.txt

# import frappe
import frappe
from frappe.model.document import Document
from frappe.auth import get_logged_user


class Client(Document):
	pass
@frappe.whitelist(allow_guest=True)
def get_clients():
	"""API to get all clients"""
	user = get_logged_user()
	print(f"Fetching clients for user: {user}")  # Debugging line to check the
	try:
		clients = frappe.get_all(
			"Client",
			filters={"status": "Active", "user_id": user},  
			fields=["name"],
			
		)
		result = {
			"success": True, 
			"data": [
				{
					"id": c["name"]           # Unique identifier (store this)
					 
				} 
				for c in clients
			]
		}
		print(result)  # Debugging line to check the output
		# Return both name and client_name
		return {
			"success": True, 
			"data": [
				{
					"id": c["name"],          # Unique identifier (store this)
				}
				for c in clients
			]
		}
	except Exception as e:
		frappe.log_error(f"Failed to get clients: {str(e)}")
		return {"success": False, "message": "Failed to fetch clients.", "error": str(e)}
@frappe.whitelist(allow_guest=True)
def get_logged_in_user():
	"""API to get the currently logged-in user"""
	try:
		user = get_logged_user()
		print(f"Logged-in user: {user}")  # Debugging line to check the output
		return {"success": True, "user": "misge@gmail.com"}
	except Exception as e:
		frappe.log_error(f"Failed to get logged-in user: {str(e)}")
		return {"success": False, "message": "Failed to fetch logged-in user.", "error": str(e)}