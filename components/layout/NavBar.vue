<template>
  <b-navbar>
    <template #start>
      <b-navbar-item v-if="gIsLogged" tag="div" class="has-text-light">
        <span> Logged as {{ gUser.displayName }} </span>
      </b-navbar-item>

      <b-navbar-item v-else tag="div">
        <a class="button is-primary" :href="this.localePath({ name: 'login' })">
          <strong>Login</strong>
        </a>
      </b-navbar-item>
    </template>

    <template #end>
      <div class="navbar-menu">
        <b-navbar-item tag="div">
          <div class="buttons">
            <a class="button" href="https://github.com/stefanocarna/ReView">
              <b-icon icon="github" pack="fab"></b-icon>
              <strong>Github Repo</strong>
            </a>
          </div>
        </b-navbar-item>
        <div class="navbar-end"></div>
      </div>
    </template>
  </b-navbar>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      gUser: 'auth/gUser',
      gIsLogged: 'auth/gIsLogged',
    }),
  },
}
</script>
<style lang="scss" scoped>
$sidebar-base: #262f3d;

.navbar {
  padding: 0 1.5rem;
  background-color: $sidebar-base;

  &-item {
    // color: $app-color2;
  }
}

.logo-text {
  margin-left: 0.5rem;
  font-family: Handlee;
  font-weight: bold;
  color: #fff;
}

.logo-image {
  width: 2.5rem;
  height: 2.5rem;
}

.side-logo {
  display: flex;
  align-items: center;
  height: 3.25rem;
}

// COlors to be used
// grassiest charcoal
// #343837
// indiscernible ocean blue
// #03719C
// unsusceptible blue/green
// #0F9B8E
</style>
