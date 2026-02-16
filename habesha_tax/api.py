# api.py in your Frappe app
import frappe
from frappe import _

@frappe.whitelist(allow_guest=True, methods=['POST'])
def register_client_user(user_data, client_data):
    """
    Custom registration endpoint for mobile app
    Creates User and custom Client records simultaneously
    """
    try:
        # Validate required fields
        required_user_fields = ['email', 'first_name', 'last_name', 'password']
        required_client_fields = ['business_type', 'status', 'tin_number', 'tax_category', 
                                 'address_line_1', 'city', 'state']
        
        for field in required_user_fields:
            if not user_data.get(field):
                return {"success": False, "message": f"Missing required field: {field}"}
        
        for field in required_client_fields:
            if not client_data.get(field):
                return {"success": False, "message": f"Missing required field: {field}"}
        
        # Check if email already exists
        if frappe.db.exists("User", user_data.get("email")):
            return {"success": False, "message": "Email already registered"}
        
        # 1. Create User
        user = frappe.get_doc({
            "doctype": "User",
            "email": user_data.get("email"),
            "first_name": user_data.get("first_name"),
            "middle_name": user_data.get("middle_name", ""),
            "last_name": user_data.get("last_name"),
            "full_name": f"{user_data.get('first_name')} {user_data.get('last_name')}".strip(),
            "username": user_data.get("email").split("@")[0],
            "mobile_no": user_data.get("mobile_no", ""),
            "phone": user_data.get("phone_number", ""),  # From your form
            "language": user_data.get("language", "en"),
            "time_zone": user_data.get("time_zone", "Africa/Addis_Ababa"),
            "country": user_data.get("country"),
            "user_category": user_data.get("user_category", "Business Owner"),
            "send_welcome_email": 0,
            "user_type": "Website User",
            "enabled": 1
        })
        
        # Set password
        # user.new_password = user_data.get("password")

        from frappe.utils.password import update_password
        user.insert(ignore_permissions=True)
        
        # Update password properly
        update_password(user.name, user_data.get("password"))
        
        # Save again to commit changes
        user.save(ignore_permissions=True)
        

        
        # 2. Create YOUR Custom Client Doctype
        client = frappe.get_doc({
            "doctype": "Client",  # Your custom doctype name
            "first_name": user_data.get("first_name"),
            "middle_name": user_data.get("middle_name", ""),
            "last_name": user_data.get("last_name"),
            "full_name": f"{user_data.get('first_name')} {user_data.get('last_name')}".strip(),
            "user_id": user.name,  # Link to user
            "email": user_data.get("email"),
            "phone_number": user_data.get("phone_number", ""),
            "address_line_1": client_data.get("address_line_1"),
            "address_line_2": client_data.get("address_line_2", ""),
            "city": client_data.get("city"),
            "state": client_data.get("state"),
            "tax_id": client_data.get("tin_number"),
            "tax_category": client_data.get("tax_category"),
            "business_type": client_data.get("business_type"),
            "business_status": client_data.get("status")
        })
        
        client.insert(ignore_permissions=True)
        
        
        # 4. Add "Client" role to user
        if not frappe.db.exists("Role", "Client"):
            # Create Client role if it doesn't exist
            role = frappe.get_doc({
                "doctype": "Role",
                "role_name": "Client",
                "desk_access": 0,  # No desk access for clients
                "is_custom": 1
            })
            role.insert(ignore_permissions=True)
        
        user.add_roles("Client")
        
        frappe.db.commit()
        
        return {
            "success": True,
            "message": "Registration successful",
            "user_id": user.name,
            "client_id": client.name,
            "email": user.email
        }
        
    except frappe.exceptions.ValidationError as e:
        frappe.db.rollback()
        print(f"Validation Error: {str(e)}")
        return {
            "success": False,
            "message": f"Validation Error: {str(e)}"
        }
    except Exception as e:
        frappe.db.rollback()
        frappe.log_error(f"Registration failed: {str(e)}", "Client Registration")
        print(f"Registration failed: {str(e)}")
        return {
            "success": False,
            "message": "Registration failed. Please try again."
        }
    
@frappe.whitelist(allow_guest=True)
def forgot_password(email, password):
    """Handle forgot password requests"""
    try:
        user = frappe.get_doc("User", email)
        if user:
            from frappe.utils.password import update_password
            update_password(user.name, password)
            user.save(ignore_permissions=True)  
            return {"success": True, "message": "Password updated successfully"}
        else:
            return {"success": False, "message": "Email not found"}
    except Exception as e:
        print(f"Forgot password failed: {str(e)}")
        frappe.log_error(f"Forgot password failed: {str(e)}", "Forgot Password")
        return {"success": False, "message": "Failed to update password. Please try again."}
    

@frappe.whitelist(allow_guest=True)
def get_all_lookups():
    """Get all lookup data in one call (optimized for mobile)"""
    try:
        countries = frappe.get_all(
            "Country",
            fields=["name"],
            order_by="name asc"
        )
        if frappe.db.exists("DocType", "Business Type"):
            business_types = frappe.get_all(
                "Business Type",
                fields=["name"],
                order_by="name asc"
            )
            business_types_list = [b["name"] for b in business_types]
        else:
            business_types_list = [
                "Sole Proprietorship",
                "Partnership", 
                "LLC",
                "Corporation",
                "Non-Profit"
            ]
            
        if frappe.db.exists("DocType", "Tax Category"):
            tax_categories = frappe.get_all(
                "Tax Category",
                fields=["name"],
                order_by="name asc"
            )
            tax_categories_list = [t["name"] for t in tax_categories]
        else:
            tax_categories_list = [
                "VAT Registered",
                "Non-VAT",
                "Exempt",
                "Zero Rated"
            ]
        
        result = { "success": True, "data": {
            "countries": [c["name"] for c in countries],
            "business_types": business_types_list,
            "tax_categories": tax_categories_list
        }}
     
        return {
            "success": True,
            "data": {
                "countries": [c["name"] for c in countries],
                "business_types": business_types_list,
                "tax_categories": tax_categories_list
            }
        }
        
    except Exception as e:
        frappe.log_error(f"Failed to get all lookups: {str(e)}")
        return {
            "success": False,
            "message": str(e),
            "data": {
                "countries": [],
                "business_types": [],
                "tax_categories": []
            }
        }