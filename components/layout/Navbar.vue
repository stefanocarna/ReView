<template>
  <b-navbar>
    <template #brand>
      <b-navbar-item tag="router-link" :to="{ path: '/' }">
        <img src="@/assets/images/review-logo.png" />
        <p class="logo-text is-size-4">ReView</p>
      </b-navbar-item>
    </template>

    <template #end>
      <div class="navbar-menu">
        <b-navbar-item tag="div">
          <div class="buttons">
            <b-button icon-left="github">
              <a href="https://github.com/stefanocarna/ReView">
                <strong>Github Repo</strong>
              </a>
            </b-button>
          </div>
        </b-navbar-item>
        <div class="navbar-end"></div>
      </div>
    </template>
  </b-navbar>
</template>
<style lang="scss" scoped>
.navbar {
  padding: 0 1.5rem;
  background-color: #343837;

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
