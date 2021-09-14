<template>
  <div class="page">
    <nav-bar />
    <section>
      <div class="container is-fluid">
        <Nuxt />
      </div>
    </section>
    <b-loading :is-full-page="true" :active.sync="$store.state.app.loading" />
  </div>
</template>

<script>
import NavBar from '@/components/layout/Navbar.vue'

export default {
  components: {
    NavBar,
  },
}
</script>

<style lang="scss">
.page {
  // background: #000;
  min-height: 100vh;
}
</style>
