export const state = function () {
  return {
    socketId: null,
    connected: false,
  }
}

export const getters = {
  gSocketId(state) {
    return state.socketId ? state.socketId : {}
  },

  gIsConnected(state) {
    return state.connected
  },
}

export const mutations = {
  SET_SOCKET(state, socketId) {
    state.socketId = socketId
  },

  SET_CONNECTED(state, connected) {
    state.connected = connected
  },

  CLEAR_STATE(state) {
    // Reset State
    state.socket = null
    state.connected = false
  },
}

export const actions = {
  clear_socket_state({ commit }) {
    commit('CLEAR_STATE')
  },

  connect({ state, commit, dispatch }) {
    if (state.connected) {
      console.log('Cannot open concurrent WebSocket')
      return
    }

    dispatch('profile/fetch', null, { root: true })

    const socket = this.$backend.openSocket()
    commit('SET_SOCKET', socket.id)

    socket.on('connect', () => {
      console.log('WebSocket Connected')
      commit('SET_CONNECTED', true)
    })

    socket.on('connect_error', () => {
      console.log('WebSocket Connection Error')
      commit('SET_CONNECTED', false)
    })

    socket.on('disconnect', () => {
      console.log('WebSocket Disconnected')
      commit('SET_CONNECTED', false)
    })

    socket.on('new_data', (data) => {
      commit('profile/ADD_TO_PROFILES_AND_ACTIVE', data, { root: true })
    })
  },

  disconnect({ state, commit }) {
    if (!state.connected) return

    this.$backend.closeSocket()
    commit('SET_CONNECTED', false)
  },
}
