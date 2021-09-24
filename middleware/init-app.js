export default async function({ store }) {
  console.log('[MW] init-app.js')
  /* if this page is the fisrt to be loaded, then init the application */
  if (!store.state.app.appInit) await store.dispatch('app/initialize')
}
