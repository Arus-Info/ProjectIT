import { createResource } from 'frappe-ui'

export async function get_instructions(date, project_name, employee_id) {
  const instructions = createResource({
    url: 'projectit.api.get_instructions',
    makeParams() {
      return {
        date: date,
        project_name: project_name,
        employee_id: employee_id,
      }
    },
  })
  return await instructions.fetch()
}
