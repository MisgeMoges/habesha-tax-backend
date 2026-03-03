# Copyright (c) 2026, misganmoges03@gmail.com and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import flt


class ClientEmployee(Document):
	pass

@frappe.whitelist(allow_guest=True)
def post_employee_payroll(payroll):
	data = frappe.parse_json(payroll) if isinstance(payroll, str) else payroll
	print(f"Received payroll data: {data}")  # Debugging line to check the input data
	if not isinstance(data, dict):
		frappe.throw("Invalid payroll payload.")

	client_employee = (
		data.get("client_employee")
		or data.get("employee_id")
		or data.get("employee")
		or data.get("name")
	)
	if not client_employee:
		frappe.throw("Client Employee is required.")

	payroll_period = data.get("payroll_period")
	posting_date = data.get("posting_date")
	worked_hours = data.get("worked_hours")
	if not payroll_period or not posting_date or worked_hours in (None, ""):
		frappe.throw("Payroll period, posting date, and worked hours are required.")

	hourly_rate_payload = data.get("hourly_rate") or data.get("salary_rate")
	hourly_rate = hourly_rate_payload
	if hourly_rate in (None, ""):
		hourly_rate = frappe.db.get_value("Client Employee", client_employee, "hourly_rate")
	if hourly_rate in (None, ""):
		frappe.throw("Hourly rate is required.")

	worked_hours_flt = flt(worked_hours)
	hourly_rate_flt = flt(hourly_rate)
	total_amount = flt(worked_hours_flt * hourly_rate_flt)

	doc = frappe.get_doc("Client Employee", client_employee)
	child = doc.append(
		"payroll_details",
		{
			"employee_name": data.get("employee_name") or doc.employee_name,
			"position": data.get("position") or doc.position,
			"payroll_period": payroll_period,
			"posting_date": posting_date,
			"hourly_rate": hourly_rate_flt,
			"worked_hours": worked_hours_flt,
			"total_amount": total_amount,
		},
	)

	doc.save(ignore_permissions=True)

	return {
		"client_employee": doc.name,
		"payroll_detail": child.name,
		"hourly_rate": hourly_rate_flt,
		"hourly_rate_source": "payload" if hourly_rate_payload not in (None, "") else "client_employee",
		"total_amount": total_amount,
	}
