export const state = () => ({
  lastProfile: [],
})

export const getters = {
  gLastProfile(state) {
    return state.lastProfile ? state.lastProfile : []
  },
}

export const mutations = {
  SET_LAST_PROFILE(state, { lastProfile, persist }) {
    let cLastProfile
    if (state.lastProfile) {
      cLastProfile = JSON.parse(JSON.stringify(state.lastProfile))
      // Update user fields
      for (const prop in lastProfile) {
        if (lastProfile[prop]) cLastProfile[prop] = lastProfile[prop]
      }
    } else {
      cLastProfile = lastProfile
    }

    state.lastProfile = cLastProfile
    // if (persist) storage.put('authUser', cUser)
  },

  CLEAR_STATE(state) {
    // Clear localStorage
    // storage.clear()

    // Reset State
    state.lastProfile = []
  },
}

export const actions = {}
