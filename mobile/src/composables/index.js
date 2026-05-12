import { createResource, toast } from 'frappe-ui'

function getFileReader() {
  const fileReader = new FileReader()
  const zoneOriginalInstance = fileReader['__zone_symbol__originalInstance']
  return zoneOriginalInstance || fileReader
}

export class FileAttachment {
  constructor(fileObj) {
    this.fileObj = fileObj
    this.fileName = fileObj.name
  }

  async upload(documentType, documentName, fieldName) {
    return new Promise((resolve, reject) => {
      const reader = getFileReader()
      const uploader = createResource({
        url: 'projectit.api.upload_base64_file',
        onSuccess: (fileDoc) => resolve(fileDoc),
        onError: (error) => {
          toast({
            title: 'Error',
            text: `File upload failed for ${this.fileName}. ${
              error.messages?.[0] || ''
            }`,
            icon: 'alert-circle',
            position: 'bottom-center',
            iconClasses: 'text-red-500',
          })
          reject(error)
        },
      })

      reader.onload = () => {
        console.log('Loaded successfully ✅')
        this.fileContents = reader.result.toString().split(',')[1]

        uploader.submit({
          content: this.fileContents,
          dt: documentType,
          dn: documentName,
          filename: this.fileName,
          fieldname: fieldName,
        })
      }
      reader.readAsDataURL(this.fileObj)
    })
  }

  // delete() {
  // 	return createResource({
  // 		url: "aaspa.api.delete_attachment",
  // 		onSuccess: () => {
  // 			console.log("Deleted successfully ✅")
  // 		},
  // 		onError: (error) => {
  // 			toast({
  // 				title: "Error",
  // 				text: `File deletion failed. ${error.messages?.[0] || ""}`,
  // 				icon: "alert-circle",
  // 				position: "bottom-center",
  // 				iconClasses: "text-red-500",
  // 			})
  // 		},
  // 	}).submit({
  // 		filename: this.fileName,
  // 	})
  // }
}
