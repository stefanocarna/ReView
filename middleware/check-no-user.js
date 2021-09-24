export default function ({ app, store, redirect }) {
  console.log('[MW] chek-no-user.js')
  if (store.getters['auth/gIsLogged'])
    redirect(301, app.localePath({ name: '/' }))
}
