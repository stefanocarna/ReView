<template>
  <section class="hero is-info is-fullheight">
    <div class="hero-head">
      <nav-bar />
    </div>
    <div class="hero-body">
      <div class="container has-text-centered">
        <Nuxt />
        <b-loading
          :is-full-page="true"
          :active.sync="$store.state.app.loading"
        />
      </div>
    </div>
  </section>
</template>

<script>
import NavBar from '@/components/layout/Navbar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>

<style lang="scss"></style>
