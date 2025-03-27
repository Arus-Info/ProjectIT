import { createRouter, createWebHistory } from 'vue-router'
import { session } from './data/session'
import { userResource } from '@/data/user'
import { createResource } from 'frappe-ui'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
  },
  {
    path : '/workit',
    name : 'WorkIT',
    component : () => import('@/pages/WorkIT.vue'),
  },
  {
    path : '/manageit',
    name : 'ManageIT',
    component : () => import('@/pages/ManageIT.vue'),
  },
  {
    path : '/manageit/edit-instructions/:project_name',
    name : 'EditInstructions',
    component : () => import('@/pages/EditInstructions.vue'),
  },
  {
    path : '/manageit/allocate-employees/:project_name',
    name : 'AllocateEmployees',
    component : () => import('@/pages/AllocateEmployees.vue'),
  },
  {
    name: 'Login',
    path: '/account/login',
    component: () => import('@/pages/Login.vue'),
  },
]

let router = createRouter({
  history: createWebHistory('/projectit'),
  routes,
})

router.beforeEach(async (to, from, next) => {
  let isLoggedIn = session.isLoggedIn
  try {
    await userResource.Promise
  } catch (error) {
    isLoggedIn = false
  }
  if (to.name === 'Login' && isLoggedIn) {
    next({ name: "Home" })
  } else if (to.name !== 'Login' && !isLoggedIn) {
    next({ name: 'Login' })
  } 
  else if(to.name === 'Login' && !isLoggedIn){
    next()
  }
  else {
    const mobileModules = createResource({
      type: "POST",
      url: "projectit.api.get_modules_for_router",
      makeParams() {
        return {
          user_id: userResource.data
        }
      },
      onSuccess(data) {
        let allowed = false;
        for (let d of data){
          if(to.path.match(d)){
            allowed =  true;
            break;
          }
        }
        if(allowed === true){
            next()
        }
        else{
          next({name : "Home"})
        }
      },
    })

    await mobileModules.fetch()
  }
})

export default router