<template>
  <div class="columns is-multiline">
    <div v-for="p in gProfiles" :key="p.id" class="column is-4">
      <b-button
        :class="dProfile.id == p.id ? 'is-primary' : ''"
        @click="selectProfile(p)"
      >
        <span>{{ p.id.substr(p.id.length - 7, p.id.length) }}</span>
        <p>{{ new Date(p.date).toLocaleString('it-IT') }}</p>
      </b-button>
    </div>
    <div v-if="!gProfiles.length" class="has-text-centered">
      <p>There are no profiles.</p>
      <p>Try to upload some</p>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    profile: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      dProfile: {},
    }
  },

  computed: {
    ...mapGetters({
      gProfiles: 'profile/gProfiles',
    }),
  },

  methods: {
    selectProfile(p) {
      this.dProfile = p
      this.$emit('update:profile', p)
      // const nextState = !this.cIsEmployeeManager
      // // this.$backend.patchStoreEmployees(this.$route.params.id,
      // this.$backend
      //   .patchStoreEmployees(this.cStoreId, this.employee.userId, nextState)
      //   .then(() => {
      //     this.$emit('update:state', nextState)
      //   })
    },
  },
}
</script>
<style lang="scss">
.button-profile {
  padding: 0.25rem;
}
</style>
