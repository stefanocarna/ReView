export const state = function () {
  return {
    loading: false,
  }
}

export const mutations = {
  SET_LOADING(state, waiting) {
    state.loading = waiting
  },
}
