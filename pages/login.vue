<template>
  <div>
    Login Page

    <p>User is: {{ gUser }}</p>

    <b-button @click="login"> login in </b-button>
    <b-button @click="logout"> logout</b-button>
    <b-button @click="cprotected"> protected </b-button>
    <b-button @click="cprofile"> create profile </b-button>
    <b-button @click="socket"> socket </b-button>

    <nuxt-link to="/realtime">Go to realtime </nuxt-link>

    <div class="column is-6">
      <p class="is-size-4 has-text-centered m-2">Select a data file</p>
      <uploader :value.sync="dataJson" />
    </div>
  </div>
</template>
<script>
import { io } from 'socket.io-client'
import { mapGetters } from 'vuex'
import Uploader from '@/components/Uploader.vue'

export default {
  layout: 'full',

  data() {
    return {
      dataJson: [],
    }
  },

  components: {
    Uploader,
  },

  watch: {
    dataJson(n, o) {
      this.$backend.postProfile(n)
    },
  },

  computed: {
    ...mapGetters({
      gIsLogged: 'auth/gIsLogged',
      gUser: 'auth/gUser',
      gAccessToken: 'auth/gAccessToken',
    }),
  },

  methods: {
    socket() {
      if (!this.gIsLogged) return

      const socket = this.$backend.openSocket()

      if (!socket) return

      socket.on('connect', () => {
        console.log('connected')
      })

      socket.on('connect_error', () => {
        // socket.connect()
        console.log('connect error')
      })

      socket.on('disconnect', () => {
        console.log('diconnect')
      })

      socket.on('new_data', (data) => {
        console.log('Received: ', data)
      })
    },
    login() {
      this.$store.dispatch('auth/login', { username: 'userx', password: '123' })
      // this.$backend.getProfile()
    },
    logout() {
      this.$store.dispatch('auth/logout')
      // this.$backend.getProfile()
    },

    cprofile() {
      this.$backend.postProfile('first profile')
    },
    cprotected() {
      this.$backend.getProfile()
    },
  },
}
</script>
