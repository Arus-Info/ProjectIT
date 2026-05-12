// Copyright (c) 2025, frappe.dev@arus.co.in and contributors
// For license information, please see license.txt

frappe.ui.form.on("Project Allocation and Instrucions", {
  refresh(frm) {
    frm.add_custom_button("Back", () => {
      frappe.set_route("Form", "Project", frm.doc.project);
    });
  },
});
