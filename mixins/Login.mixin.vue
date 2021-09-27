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
            this.$snotify.success(
              'Registration completed. Wait for the user to be activated before login.',
              {
                timeout: 5000,
                showProgressBar: false,
                position: 'rightCenter',
              }
            )
          })
          .catch((err) => {
            throw new Error(err.message)
          })
      } catch (err) {
        if (err && err.message) {
          this.$snotify.error(err.message, {
            timeout: 3000,
            showProgressBar: false,
            position: 'rightCenter',
          })
        } else {
          // TODO fix for production
          console.error('mLoginWithCredential:', err)
        }
      } finally {
        this.$store.commit('app/SET_LOADING', false)
      }
    },

    async mLoginWithCredential(e, p) {
      try {
        this.$store.commit('app/SET_LOADING', true)
        return await this.$store
          .dispatch('auth/login', { email: e, password: p })
          .then(() => {
            /* Login with success */
            // TODO change into index
            this.$router.push(this.localePath({ name: '/realtime' }))
          })
          .catch((err) => {
            if (err.message === '401') {
              throw new Error('Invalid credentials')
            }
            if (err.message === '403') {
              throw new Error('User is not active')
            }
            throw new Error(err.message)
          })
      } catch (err) {
        if (err && err.message) {
          this.$snotify.error(err.message, {
            timeout: 3000,
            showProgressBar: false,
            position: 'rightCenter',
          })
        } else {
          // TODO fix for production
          console.error('mLoginWithCredential:', err)
        }
      } finally {
        this.$store.commit('app/SET_LOADING', false)
      }
    },
  },
}
</script>
