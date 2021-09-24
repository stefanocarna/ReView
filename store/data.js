export const state = () => ({
  lastProfile: [],
})

export const getters = {
  gLastProfile(state) {
    return state.lastProfile ? state.lastProfile : []
  },
}

export const mutations = {
  SET_LAST_PROFILE(state, { lastProfile }) {
    state.lastProfile = JSON.parse(lastProfile)
  },

  CLEAR_STATE(state) {
    // Clear localStorage
    // storage.clear()

    // Reset State
    state.lastProfile = []
  },
}

export const actions = {}
