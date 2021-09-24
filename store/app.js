export const state = function () {
  return {
    loading: false,
    appInit: false,
  }
}

export const mutations = {
  SET_APP_INIT(state, value = true) {
    state.appInit = value
  },

  SET_LOADING(state, waiting) {
    state.loading = waiting
  },
}

export const actions = {
  async initialize({ rootState, state, commit, dispatch }) {
    // eslint-disable-next-line no-caller
    console.log('initialize')

    if (state.appInit) throw new Error('initialize called twice')

    /* Load User Information */
    if (rootState.auth.accessToken)
      await dispatch('auth/fetchFullUser', null, { root: true })

    commit('SET_APP_INIT')
  },
}
