<template>
  <section>
    <nuxt />
    <vue-snotify />
    <b-loading :is-full-page="false" :active.sync="$store.state.app.loading" />
  </section>
</template>
