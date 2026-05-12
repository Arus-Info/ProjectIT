import frappe


def after_insert_of_project(doc, event):
    pai = frappe.new_doc("Project Allocation and Instrucions")
    pai.project = doc.name
    pai.save()
