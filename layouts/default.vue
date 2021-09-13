<template>
  <div class="page">
    <section>
      <div class="container is-fluid">
        <Nuxt />
      </div>
    </section>
    <b-loading :is-full-page="true" :active.sync="$store.state.app.loading" />
  </div>
</template>

<style lang="scss">
.page {
  // background: #000;
  min-height: 100vh;
}
</style>
