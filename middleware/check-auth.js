export default function (context) {
  const accessToken = context.store.state.auth.accessToken

  if (!accessToken)
    context.redirect(301, context.app.localePath({ name: 'login' }))
}
