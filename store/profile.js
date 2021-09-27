export const state = () => ({
  profiles: [],
  activeProfile: { data: null },
  localProfiles: [],
})

export const getters = {
  gProfiles(state) {
    return state.profiles ? state.profiles : []
  },
  gActiveProfile(state) {
    return state.activeProfile ? state.activeProfile : { data: null }
  },
  gLocalProfile(state) {
    return state.localProfiles ? state.localProfiles : []
  },
}

export const mutations = {
  SET_PROFILES(state, profiles) {
    state.profiles = profiles
  },

  REMOVE_FROM_PROFILES(state, profileId) {
    for (let i = 0; i < state.profiles.length; ++i)
      if (state.profiles[i].id === profileId) state.profiles.splice(i, 1)
  },

  SET_ACTIVE_PROFILE(state, activeProfile) {
    if (!activeProfile || !activeProfile.data) {
      state.activeProfile = { data: null }
    } else {
      state.activeProfile = activeProfile
      state.activeProfile.data = JSON.parse(state.activeProfile.data)
    }
  },

  ADD_TO_PROFILES_AND_ACTIVE(state, activeProfile) {
    if (!activeProfile || !activeProfile.data) {
      state.activeProfile = { data: null }
    } else {
      state.activeProfile = activeProfile
      state.activeProfile.data = JSON.parse(state.activeProfile.data)
      state.profiles.unshift(state.activeProfile)
    }
  },

  CLEAR_ACTIVE_PROFILE(state) {
    state.activeProfile = { data: null }
  },

  SET_LOCAL_PROFILES(state, localProfiles) {
    state.localProfiles = localProfiles
  },

  CLEAR_STATE(state) {
    // Clear localStorage
    // storage.clear()

    // Reset State
    state.profiles = []
  },
}

export const actions = {
  async fetch({ commit }, profileId = null) {
    try {
      /** Fetching all profiles */
      if (!profileId) {
        commit('SET_PROFILES', await this.$backend.getProfile(null, true))
      } else {
        // TODO It may change later to perform different logic
        commit('SET_ACTIVE_PROFILE', await this.$backend.getProfile(profileId))
      }
    } catch (err) {
      console.log('[ERR] ', err)
      throw new Error('Cannot fetch profiles')
    }
  },

  delete({ state, commit }, profileId) {
    if (!profileId) return

    commit('REMOVE_FROM_PROFILES', profileId)

    if (state.activeProfile.id === profileId) {
      commit('CLEAR_ACTIVE_PROFILE')
    }

    return this.$backend.deleteProfile(profileId)
  },

  pushLocal({ state, commit }) {
    try {
      /** Fetching all profiles */
    } catch (err) {
      console.log('[ERR] ', err)
      throw new Error('Cannot fetch profiles')
    }
  },
}
