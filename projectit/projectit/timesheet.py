import frappe


def on_submit_of_timesheet(doc, event):
    attendance_list = frappe.get_list(
        "Attendance",
        filters={"employee": doc.employee, "attendance_date": doc.start_date},
    )
    if not attendance_list:
        attendance = frappe.new_doc("Attendance")
        attendance.employee = doc.employee
        attendance.attendance_date = doc.start_date
        attendance.save()
