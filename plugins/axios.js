const REC_REDI = 0 // 0
const REC_SUCC = 1 // 1
const REC_FAIL = 2 // 2

let isRecovering = false
let recPromise = null

const waitForRecover = function (store) {
  if (!isRecovering) {
    isRecovering = true
    return (recPromise = store
      .dispatch('auth/refreshToken')
      .then(function () {
        isRecovering = false
        return REC_SUCC
      })
      .catch(function () {
        isRecovering = false
        return REC_REDI
      }))
  } else {
    return recPromise.then(function (r) {
      return r === REC_SUCC ? REC_SUCC : REC_FAIL
    })
  }
}

export default function ({ $axios, redirect, store }) {
  const onResponseInterceptor = async (err) => {
    const code = parseInt(err.response && err.response.status)
    if (!err.response) {
      console.error('Network Problem')
      return err
    }

    if (err.code === 'ECONNABORTED' || code === 408) {
      console.error('A timeout happend on url', err.config.url)
      if (!err.config._retry) err.config._retry = 3
      if (--err.config._retry) {
        return $axios(err.config)
      } else {
        redirect('/err')
      }
    }

    if (code === 500) {
      redirect(301, '/err')
    }

    // Token issue
    if (code === 401) {
      const originalRequest = err.response.config

      // console.log('Refresh before pending')

      const noAuth = !originalRequest.headers.Authorization
      const rec = noAuth ? REC_FAIL : await waitForRecover(store)

      // console.log('Here accessToken:', store.state.auth.accessToken)

      // TODO verify the main login when the refresh token is expired
      if (rec === REC_SUCC) {
        // Update token for this request
        originalRequest.headers.Authorization =
          'bearer ' + store.state.auth.accessToken
        return $axios(originalRequest)
      } else if (rec === REC_REDI) {
        redirect(301, '/login')
        return {}
      }
    }

    throw new Error(code)
  }

  $axios.onResponseError(onResponseInterceptor)
}
