frappe.ui.form.on("Project", {
  refresh(frm) {
    frm.add_custom_button(
      "Allocation and Instructions",
      () => {
        frappe.db
          .get_list("Project Allocation and Instrucions", {
            filters: { project: frm.doc.name },
          })
          .then((data) => {
            if (data.length) {
              frappe.set_route(
                "Form",
                "Project Allocation and Instrucions",
                data[0].name
              );
            }
          });
      },
      "Actions"
    );
  },
});
