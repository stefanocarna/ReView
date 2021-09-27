// let isRefreshing = false
// let refPromise = null

// const waitForRefresh = function (context) {
//   if (!isRefreshing) {
//     isRefreshing = true
//     return (refPromise = context
//       .dispatch('login', { silent: true })
//       .then(() => (isRefreshing = false)))
//   } else {
//     return refPromise
//   }
// }
import storage from '@/js/storage.js'

export const state = () => ({
  user: storage.get('authUser'),
  accessToken: storage.get('authAccessToken'),
})

export const getters = {
  gUser(state) {
    return state.user ? state.user : {}
  },

  gIsLogged(state) {
    return !!state.user
  },

  gAccessToken(state) {
    if (!state.accessToken) {
      state.accessToken = storage.get('authAccessToken')
    }
    return state.accessToken
  },
}

export const mutations = {
  SET_USER(state, { user, persist }) {
    let cUser
    if (state.user) {
      cUser = JSON.parse(JSON.stringify(state.user))
      // Update user fields
      for (const prop in user) {
        if (user[prop]) cUser[prop] = user[prop]
      }
    } else {
      cUser = user
    }

    state.user = cUser
    if (persist) storage.put('authUser', cUser)
  },

  SET_ACCESS_TOKEN(state, { token, persist }) {
    state.accessToken = token
    if (persist) storage.put('authAccessToken', token)
  },

  CLEAR_STATE(state) {
    // Clear localStorage
    storage.clear()

    // Reset State
    state.accessToken = null
    state.user = null
  },
}

export const actions = {
  clear_app_state({ commit }) {
    commit('CLEAR_STATE')
    // Clear user state
    commit('freebles/SET_FREEBLES', [], { root: true })
    commit('payments/SET_PAYMENTS', [], { root: true })
  },

  //   logout({ getters, commit, dispatch }) {
  //     if (getters.gUser) {
  //       return this.$firebase
  //         .auth()
  //         .signOut()
  //         .then(async () => {
  //           await dispatch('clear_app_state')
  //           return true
  //         })
  //         .catch((err) => {
  //           console.error('auth.js:logout ERROR', err)
  //           return false
  //         })
  //     }
  //   },

  /*
   * @options: define how to perfom the login
   *  - persist: save data into localStorage
   *  - silent: login action is transparent
   */
  async login({ commit }, { email, password }) {
    // console.log('[INIT] auth.js:login')

    return await this.$backend
      .authLogin(email, password)
      .then((r) => {
        // Save accessToken
        commit('SET_ACCESS_TOKEN', {
          token: r.token,
          persist: true,
        })

        commit('SET_USER', { user: r.user, persist: true })

        return true
      })
      .catch((err) => {
        if (err.message === '403') {
          throw new Error('403')
        }
        throw new Error('Login error')
      })
  },

  logout({ dispatch }) {
    // console.log('[INIT] auth.js:login')
    dispatch('clear_app_state')
  },

  async fetchUser({ commit, state }) {
    try {
      commit('SET_USER', {
        user: await this.$backend.getAuth(),
        persist: !!storage.get('authUser'),
      })
      return state.user
    } catch {
      throw new Error('Cannot fetch user information')
    }
  },

  fetchFullUser({ dispatch }) {
    try {
      return Promise.all([
        dispatch('fetchUser'),
        dispatch('profile/fetch', null, { root: true }),
      ])
    } catch {
      throw new Error('Cannot fetch user information')
    }
  },
}
