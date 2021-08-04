import { NuxtAxiosInstance } from '@nuxtjs/axios'

let $axios: NuxtAxiosInstance

export function initializeAxios(axiosInstance: NuxtAxiosInstance) {
  console.log('Initializing this SHIIIIIIIIIIIIIIIIIIIIT')
  $axios = axiosInstance
  console.log($axios)
}

export { $axios }
