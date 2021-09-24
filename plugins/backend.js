import { io } from 'socket.io-client'

const backend = {
  baseUrl: 'http://127.0.0.1:8001/',
  apiUrl: '/api/',
}

if (process.env.NODE_ENV === 'production') {
  backend.baseUrl = 'https://app-review-backend.herokuapp.com/'
  backend.apiUrl = backend.baseUrl + 'api/'
}

/*******************************************************/
/*  this is the generic method to make axios request   */
/*******************************************************/

backend.call = function (request, auth, unpack, axios = this.axios) {
  if (!request)
    Error('backend.js:call invalid params:', request, auth, unpack, axios)

  if (auth) {
    if (!this.auth.accessToken) {
      console.warn("You're not logged in. Stop request: ", request)
    }
    if (request.headers)
      request.headers.Authorization = 'bearer ' + this.auth.accessToken
    else request.headers = { Authorization: 'bearer ' + this.auth.accessToken }
  }

  // Add here the apiUrl, this may change with mutiple endpoints
  request.url = this.apiUrl + request.url
  return axios(request).then((response) => (unpack ? response.data : response))
}

/*******************************************************/
/* these methods are placeholder for the HTTP requests */
/*******************************************************/

backend.deleteAPI = function (api, params, auth = true, unpack = true) {
  if (!api) Error('backend.js:deleteAPI invalid params:', api)
  console.log('backend.js:deleteAPI api:', api)
  return this.call({ method: 'delete', url: api, params }, auth, unpack)
}

backend.getAPI = function (
  api,
  params,
  data,
  query,
  auth = true,
  unpack = true
) {
  if (!api) Error('backend.js:getAPI invalid params:', api)
  console.log('backend.js:getAPI api:', api)
  return this.call(
    { method: 'get', url: api, params, data, query },
    auth,
    unpack
  )
}

backend.patchAPI = function (api, params, data, auth = true, unpack = true) {
  if (!api) Error('backend.js:patchAPI invalid params:', api, data, params)
  console.log('backend.js:patchAPI api:', api)
  return this.call({ method: 'patch', url: api, params, data }, auth, unpack)
}

backend.postAPI = function (api, params, data, auth = true, unpack = true) {
  if (!api) Error('backend.js:postAPI invalid params:', api, data)
  console.log('backend.js:postAPI api:', api)
  return this.call({ method: 'post', url: api, params, data }, auth, unpack)
}

backend.putAPI = function (api, data, auth = true, unpack = true) {
  if (!api) Error('backend.js:putAPI invalid params:', api)
  console.log('backend.js:putAPI api:', api, data)
  return this.call({ method: 'put', url: api, data }, auth, unpack)
}

// /*******************************************************/
// /*                Freeble API shortcuts                */
// /*******************************************************/

// /* ----------------------------------------------------- */
// /*                   Authorization                     */
// /* ----------------------------------------------------- */

backend.authRegister = function (name, email, password) {
  console.log('backend.js:authRegister')
  const END_API = 'auth/register'
  return this.postAPI(END_API, null, { name, email, password }, false)
}

backend.authLogin = function (email, password) {
  console.log('backend.js:authLogin')
  const END_API = 'auth/login'
  return this.postAPI(END_API, null, { email, password }, false)
}

backend.authLogout = function () {
  console.log('backend.js:authLogout')
  const END_API = 'auth/logout'
  return this.postAPI(END_API, null)
}

backend.getAuth = function () {
  console.log('backend.js:getAuth')
  const END_API = 'auth/'
  return this.getAPI(END_API, null)
}

backend.getProfile = function () {
  console.log('backend.js:getProfile')
  const END_API = 'profile'
  return this.getAPI(END_API)
}

backend.postProfile = function (data) {
  console.log('backend.js:postProfile')
  const END_API = 'profile'
  return this.postAPI(END_API, null, { data })
}

backend.openSocket = function () {
  if (!this.auth.accessToken) {
    console.warn("You're not logged in. Cannot open Socket")
    return null
  }

  const socket = io(this.baseUrl, {
    auth: { token: this.auth.accessToken },
  })

  return socket
}

// backend.postAuthAccess_Firebase = function (data) {
//   console.log('backend.js:getUserEmployment', this)
//   const END_API = 'accessFirebase'
//   // TODO create a preliminary section to define global variables
//   // data.isEmployee = true
//   return this.postAPI(API_GATEWAY + END_API, null, data, false)
// }

// backend.postAuthToken = function (data) {
//   console.log('backend.js:getUserEmployment')
//   const END_API = 'token'
//   return this.postAPI(API_GATEWAY + END_API, null, data, false)
// }

// /* params : {loginRole, locale, firebaseToken } */
// backend.getAuthTerms = function (query) {
//   console.log('backend.js:getUserAccount')
//   const END_API = 'auth/terms'
//   return this.getAPI(API_AUTH + END_API, query, null, null, false)
// }
// /* ----------------------------------------------------- */
// /*                        User                           */
// /* ----------------------------------------------------- */

// backend.getUser = function () {
//   console.log('backend.js:getUserAccount')
//   const END_API = 'user'
//   return this.getAPI(API_AUTH + END_API)
// }

// backend.getUserAccount = function () {
//   console.log('backend.js:getUserAccount')
//   const END_API = 'user/account'
//   return this.getAPI(API_AUTH + END_API)
// }

// backend.putUserAccount = function (user) {
//   console.log('backend.js:putUserAccount')
//   const END_API = 'user/account'
//   return this.putAPI(API_AUTH + END_API, user)
// }

// /* This api is different from the others, then I use a */
// /* custom post implementation                          */
// backend.getUserAccountId_File = function () {
//   console.log('backend.js:getUserAccountId_File')
//   const END_API = 'user/account/idFile'
//   const api = API_AUTH + END_API
//   return this.call(
//     { method: 'get', url: api, responseType: 'blob' },
//     true,
//     false
//   )
// }

// // backend.putUserAccountId_File = async function(files) {
// //   console.log('backend.js:putUserAccountId_File', files)
// //   const END_API = 'user/account/idFile'
// //   const api = API_AUTH + END_API

// //   // const a = new Date()
// //   const data = new FormData()
// //   for (let i = 0; i < files.length; ++i) {
// //     if (files[i].type === 'application/pdf') {
// //       data.append('images', files[i])
// //     } else {
// //       // eslint-disable-next-line no-new
// //       await ImageCompressor.prototype.compress(files[i], {
// //         quality: 0.7,
// //         success(result) {
// //           // console.log('Compressed', files[i], result)
// //           data.append('images', result)
// //         },
// //         error(e) {
// //           // console.log('Error on compression', e.message)
// //         }
// //       })
// //     }
// //   }

// //   // console.log('Time', new Date() - a)
// //   const request = {
// //     method: 'put',
// //     url: api,
// //     data,
// //     headers: { 'Content-Type': 'multipart/form-data' }
// //   }

// //   console.log('backend.js:putAPI api:', api)
// //   return this.call(request, true, true)
// // }

// backend.deleteUserEmploymentPending = function (employmentRequestId) {
//   console.log('backend.js:deleteUserEmploymentPending')
//   const END_API = 'user/employment/pending/' + employmentRequestId
//   return this.deleteAPI(API_AUTH + END_API)
// }

// backend.getUserEmploymentPending = function () {
//   console.log('backend.js:getUserEmploymentPending')
//   const END_API = 'user/employment/pending'
//   return this.getAPI(API_AUTH + END_API)
// }

// backend.postUserEmploymentPending = function (employmentRequestId) {
//   console.log('backend.js:postUserEmploymentPending')
//   const END_API = 'user/employment/pending/' + employmentRequestId
//   return this.postAPI(API_AUTH + END_API)
// }

// backend.getUserEmployment = function (storeId = null) {
//   console.log('backend.js:getUserEmployment')
//   const END_API = 'user/employment' + (storeId ? '' + storeId : '')
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.patchUserEmployment = function (storeId, enable) {
//   console.log('backend.js:getUserEmployment')
//   const END_API = 'user/employment/' + storeId
//   return this.patchAPI(
//     API_BUSINESS + END_API,
//     { enabled: enable },
//     null,
//     true,
//     false
//   )
// }

// // TODO make dynamic when introducing i18n plugin
// backend.postUserPrepurchasable = function (productId) {
//   const successUri = window.location.origin + '/checkout/completed'
//   const abortUri = window.location.origin + '/checkout/cancelled'
//   console.log('backend.js:postUserPrepurchasable (NO DYNAMIC LINKS)')
//   const END_API = 'user/prepurchasable'
//   return this.postAPI(API_BUSINESS + END_API, {
//     productId,
//     successUri,
//     abortUri,
//   })
// }

// backend.getUserFreebles = function (prepurchasedOnly = true) {
//   console.log('backend.js:getUserFreebles')
//   const END_API = 'user/freebles'
//   return this.getAPI(API_BUSINESS + END_API, { prepurchasedOnly })
// }

// /* ----------------------------------------------------- */
// /*                      Category                       */
// /* ----------------------------------------------------- */

// backend.getCategory = function (categoryId = null) {
//   console.log('backend.js:getCategory', categoryId)
//   const END_API = 'category' + (categoryId ? '/' + categoryId : '')
//   return this.getAPI(API_BUSINESS + END_API, null, null, null, false)
// }

// backend.getDashboardCategory = function () {
//   console.log('backend.js:getDashboardCategory')
//   const END_API = 'initCategories'
//   return this.getAPI(API_DASHBOARD + END_API, null, null, null, false)
// }

// backend.putDashboardCategory = function (categoryName, categoryImage) {
//   console.log('backend.js:putDashboardCategory', categoryName)
//   const END_API = 'category'

//   const data = new FormData()
//   data.append('file', categoryImage)

//   const request = {
//     method: 'put',
//     // data: data,
//     url: API_DASHBOARD + END_API,
//     // headers: { 'Content-Type': 'multipart/form-data' },
//     params: { name: categoryName },
//   }

//   console.log('backend.js:putAPI api:', API_DASHBOARD + END_API)
//   return this.call(request, true, true)
// }

// /* ----------------------------------------------------- */
// /*                        Store                        */
// /* ----------------------------------------------------- */

// backend.getStore = function (storeId = null) {
//   console.log('backend.js:getStore', storeId)
//   const END_API = 'store' + (storeId ? '/' + storeId : '')
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.postStore = function (store) {
//   console.log('backend.js:postStore', store)
//   const END_API = 'store'
//   return this.postAPI(API_BUSINESS + END_API, null, store)
// }

// backend.putStore = function (store, storeId) {
//   console.log('backend.js:putStore', store, storeId)
//   const END_API = 'store/' + storeId
//   return this.putAPI(API_BUSINESS + END_API, store)
// }

// backend.putStoreImage = function (storeId, image) {
//   console.log('backend.js:putStoreImage', storeId)

//   const END_API = 'store/' + storeId + '/image'
//   const api = API_BUSINESS + END_API

//   const data = new FormData()
//   data.append('image', image)

//   const request = {
//     method: 'put',
//     url: api,
//     data,
//     headers: { 'Content-Type': 'multipart/form-data' },
//   }

//   console.log('backend.js:putAPI api:', api)
//   return this.call(request, true, true)
// }

// backend.getStoreAdministration = function (storeId) {
//   console.log('backend.js:getStoreAdministration', storeId)
//   const END_API = 'store/' + storeId + '/administration'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.getStoreCertificate = function (storeId) {
//   console.log('backend.js:getStoreAdministration', storeId)

//   const END_API = 'store/' + storeId + '/certificate'
//   const api = API_BUSINESS + END_API

//   return this.call(
//     { method: 'get', url: api, responseType: 'blob' },
//     true,
//     false
//   )
// }

// // backend.putStoreCertificate = async function(storeId, files) {
// //   console.log('backend.js:putStoreCertificate', storeId, files)

// //   const END_API = 'store/' + storeId + '/certificate'
// //   const api = API_BUSINESS + END_API

// //   const data = new FormData()

// //   for (let i = 0; i < files.length; ++i) {
// //     if (files[i].type === 'application/pdf') {
// //       data.append('images', files[i])
// //     } else {
// //       // eslint-disable-next-line no-new
// //       await ImageCompressor.prototype.compress(files[i], {
// //         quality: 0.7,
// //         success(result) {
// //           // console.log('Compressed', files[i], result)
// //           data.append('images', result)
// //         },
// //         error(e) {
// //           // console.log('Error on compression', e.message)
// //         }
// //       })
// //     }
// //   }

// //   const request = {
// //     method: 'put',
// //     url: api,
// //     data,
// //     headers: { 'Content-Type': 'multipart/form-data' }
// //   }

// //   console.log('backend.js:putAPI api:', api)
// //   return this.call(request, true, true)
// //   // return this.putAPI(API_BUSINESS + END_API)
// // }

// backend.deleteStoreEmployees = function (storeId, employeeId) {
//   console.log('backend.js:deleteStoreEmployees', storeId, employeeId)
//   const END_API = 'store/' + storeId + '/employees'
//   return this.deleteAPI(API_BUSINESS + END_API, { employeeId })
// }

// backend.getStoreEmployees = function (storeId) {
//   console.log('backend.js:getStoreEmployees', storeId)
//   const END_API = 'store/' + storeId + '/employees'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.patchStoreEmployees = function (storeId, employeeId, isManager) {
//   console.log('backend.js:patchStoreEmployees', storeId)
//   const END_API = 'store/' + storeId + '/employees'
//   return this.patchAPI(API_BUSINESS + END_API, {
//     employeeId,
//     isManager,
//   })
// }

// backend.postStoreEmployees = function (storeId, employeeMail, isManager) {
//   console.log('backend.js:postStoreEmployees', storeId, employeeMail, isManager)
//   const END_API = 'store/' + storeId + '/employees'
//   return this.postAPI(API_AUTH + END_API, {
//     employeeMail,
//     isManager,
//   })
// }

// backend.deleteStoreEmployeesPending = function (storeId, employmentRequestId) {
//   console.log('backend.js:deleteStoreEmployeesPending', employmentRequestId)
//   const END_API =
//     'store/' + storeId + '/employees/pending/' + employmentRequestId
//   return this.deleteAPI(API_AUTH + END_API)
// }

// backend.getStoreEmployeesPending = function (storeId) {
//   console.log('backend.js:getStoreEmployeesPending')
//   const END_API = 'store/' + storeId + '/employees/pending'
//   return this.getAPI(API_AUTH + END_API)
// }

// backend.getStoreStatistics = function (storeId) {
//   console.log('backend.js:getStoreStatistics', storeId)
//   const END_API = 'store/' + storeId + '/statistics'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.getStoreStatisticsWeek = function (storeId) {
//   console.log('backend.js:getStoreStatistics', storeId)
//   const END_API = 'store/' + storeId + '/statistics/week'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.getStoreStatisticsMonth = function (storeId, month, year) {
//   console.log('backend.js:getStoreStatistics', storeId)
//   const END_API = 'store/' + storeId + '/statistics/month'
//   return this.getAPI(API_BUSINESS + END_API, { month, year })
// }

// backend.getStoreStatisticsYear = function (storeId, year) {
//   console.log('backend.js:getStoreStatistics', storeId)
//   const END_API = 'store/' + storeId + '/statistics/year'
//   return this.getAPI(API_BUSINESS + END_API, { year })
// }

// backend.getStoreProducts = function (storeId) {
//   console.log('backend.js:getStoreProducts', storeId)
//   const END_API = 'store/' + storeId + '/products'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.postStoreProducts = function (storeId, data) {
//   console.log('backend.js:postStoreProducts', storeId)
//   const END_API = 'store/' + storeId + '/products'
//   return this.postAPI(API_BUSINESS + END_API, null, data)
// }

// backend.patchStoreStripeId = function (storeId, code) {
//   console.log('backend.js:patchStoreStripeId', storeId)
//   const END_API = 'store/' + storeId + '/stripeId'
//   return this.patchAPI(API_BUSINESS + END_API, { code })
// }

// /* ----------------------------------------------------- */
// /*                       Product                         */
// /* ----------------------------------------------------- */

// backend.deleteProduct = function (productId) {
//   console.log('backend.js:deleteProduct', productId)
//   const END_API = 'product/' + productId
//   return this.deleteAPI(API_BUSINESS + END_API)
// }

// backend.patchProduct = function (productId, enable) {
//   console.log('backend.js:patchProduct', productId)
//   const END_API = 'product/' + productId
//   return this.patchAPI(API_BUSINESS + END_API, { enable }, null, true, false)
// }

// backend.putProduct = function (productId, data) {
//   console.log('backend.js:putProduct', productId)
//   const END_API = 'product/' + productId
//   return this.putAPI(API_BUSINESS + END_API, data)
// }

// backend.getProductStatistics = function (productId) {
//   console.log('backend.js:getProductStatistics', productId)
//   const END_API = 'product/' + productId + '/statistics'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.getProductStatisticsWeek = function (productId) {
//   console.log('backend.js:getProductStatisticsWeek', productId)
//   const END_API = 'product/' + productId + '/statistics/week'
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.getProductStatisticsMonth = function (productId, month, year) {
//   console.log('backend.js:getProductStatisticsMonth', productId)
//   const END_API = 'product/' + productId + '/statistics/month'
//   return this.getAPI(API_BUSINESS + END_API, { month, year })
// }

// backend.getProductStatisticsYear = function (productId, year) {
//   console.log('backend.js:getProductStatisticsYear', productId)
//   const END_API = 'product/' + productId + '/statistics/year'
//   return this.getAPI(API_BUSINESS + END_API, { year })
// }

// // Return the list of preprurchasable only product (no auth)
// backend.getProductPrepurchasable = function () {
//   console.log('backend.js:getProductPrepurchasable')
//   const END_API = 'product/prepurchasable'
//   return this.getAPI(API_BUSINESS + END_API, null, null, null, false)
// }

// /* ----------------------------------------------------- */
// /*                       Payment                         */
// /* ----------------------------------------------------- */

// backend.getPayment = function (paymentId = null) {
//   console.log('backend.js:getPayment', paymentId)
//   const END_API = 'payment' + (paymentId ? '/' + paymentId : '')
//   return this.getAPI(API_BUSINESS + END_API)
// }

// backend.deletePayment = function (paymentId) {
//   console.log('backend.js:deletePayment')
//   const END_API = 'payment/' + paymentId
//   return this.deleteAPI(API_BUSINESS + END_API)
// }

// backend.patchPaymentComplete = function (paymentId) {
//   console.log('backend.js:patchPaymentComplete', paymentId)
//   const END_API = 'payment/' + paymentId + '/complete'
//   return this.patchAPI(API_BUSINESS + END_API)
// }

// /*******************************************************/
// /*         NUXT plugin and reference injection         */
// /*******************************************************/

export default function (context, inject) {
  console.log('[CALL] backend.js')

  /* assign global $axios instance */
  backend.axios = context.$axios

  /* assign auth instance to access tokens */
  backend.auth = context.store.state.auth

  /* inject backend reference into application instance */
  inject('backend', backend)
}
