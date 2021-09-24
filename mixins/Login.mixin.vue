<script>
export default {
  methods: {
    mLogout() {
      this.$store.dispatch('auth/logout').then(() => {
        this.$router.push(
          this.localePath({
            name: '/',
          })
        )
      })
    },

    // TODO refactor
    async mSignupWithCredential(u, e, p) {
      try {
        this.$store.commit('app/SET_LOADING', true)
        return await this.$backend
          .authRegister(u, e, p)
          .then(() => {
            /* Login with success */
            // TODO change into index
            // this.$router.push(this.localePath({ name: '/' }))
          })
          .catch((err) => {
            /* Terms required */
            if (err.message === '403') {
              return this.__askForTerms().then((terms) => this.__login(terms))
            }
            throw new Error(err.message)
          })
      } catch (err) {
        // if (err && err.message) {
        //   this.$snotify.error(err.message, {
        //     timeout: 3000,
        //     showProgressBar: false,
        //     position: 'rightCenter',
        //   })
        // } else {
        //   // TODO fix for production
        //   console.error('mLoginWithCredential:', err)
        // }
      } finally {
        this.$store.commit('app/SET_LOADING', false)
      }
    },

    async mLoginWithCredential(e, p) {
      try {
        this.$store.commit('app/SET_LOADING', true)
        return await this.$store
          .dispatch('auth/login', { username: e, password: p })
          .then(() => {
            /* Login with success */
            // TODO change into index
            this.$router.push(this.localePath({ name: '/' }))
          })
          .catch((err) => {
            /* Terms required */
            if (err.message === '403') {
              return this.__askForTerms().then((terms) => this.__login(terms))
            }
            throw new Error(err.message)
          })
      } catch (err) {
        // if (err && err.message) {
        //   this.$snotify.error(err.message, {
        //     timeout: 3000,
        //     showProgressBar: false,
        //     position: 'rightCenter',
        //   })
        // } else {
        //   // TODO fix for production
        //   console.error('mLoginWithCredential:', err)
        // }
      } finally {
        this.$store.commit('app/SET_LOADING', false)
      }
    },
  },
}
</script>
