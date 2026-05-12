import './index.css'

import { createApp, reactive } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

let employeeId = localStorage.getItem('employee_id')
if (!employeeId) {
  const employeeIdJSON = JSON.stringify({
    name: '',
  })
  localStorage.setItem('employee_id', employeeIdJSON)
  employeeId = {
    name: '',
  }
} else {
  employeeId = JSON.parse(employeeId)
}
const employee = reactive(employeeId)

let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.provide('employee_id', employee)

app.mount('#app')

// const registerServiceWorker = async () => {

// 	if ("serviceWorker" in navigator) {
// 		// let serviceWorkerURL = "/public/sw.js"
// 		let serviceWorkerURL = "/assets/projectit/projectit/sw.js"
// 		let config = ""

// 		navigator.serviceWorker
// 			.register(serviceWorkerURL, {
// 				type: "classic",
// 			})
// 			.then((registration) => {
// 				if (config) {
//           console.log("Service Worker Initialised")
// 				}
// 			})
// 			.catch((err) => {
// 				console.error("Failed to register service worker", err)
// 			})
// 	} else {
// 		console.error("Service worker not enabled/supported by the browser")
// 	}
// }

// router.isReady().then(async () => {
//   registerServiceWorker()
//   app.mount('#app')
// })
