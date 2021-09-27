<template>
  <div id="main">
    <div class="left">
      <side-bar />
    </div>

    <div class="right">
      <div class="right-content">
        <div class="app-header">
          <!-- <cookie-gdpr /> -->
          <nav-bar />
        </div>

        <div class="app-body">
          <div class="container eff-transition">
            <nuxt />
          </div>
          <b-loading
            :is-full-page="false"
            :active.sync="$store.state.app.loading"
          />
        </div>

        <div class="app-footer" />
      </div>
    </div>

    <vue-snotify />

    <div :class="compContentBlock" @click="showBlock = false" />

    <!-- <bottom-nav
      :expanded="showBlock"
      @expanded="showBlock = true"
      @collapsed="showBlock = false"
    /> -->
  </div>
  <!-- <div id="main">

    <div id="sidebar">
      <side-bar />
    </div>

    <div id="main-over">
        <nav-bar />
        <div style="display: flex; flex-wrap: wrap; overflow-y: auto;">
        </div>
    </div>
     
    <vue-snotify />
    
  </div>-->
</template>

<script>
// import CookieGdpr from '@/components/legal/cookie-gdpr.vue'
import NavBar from '@/components/layout/NavBar.vue'
import SideBar from '@/components/layout/SideBar.vue'

export default {
  middleware: ['init-app', 'check-auth'],

  components: {
    // CookieGdpr,
    NavBar,
    SideBar,
    // BottomNav,
  },
  data() {
    return {
      showNav: false,
      showBlock: false,
    }
  },

  computed: {
    compContentBlock() {
      let cclass = 'content-blocker '
      cclass += this.showBlock ? 'content-blocker--active' : ''
      return cclass
    },
  },

  methods: {
    toggleNav() {
      this.showNav = !this.showNav
    },
  },
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

.content-blocker {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(#000, 0.5);
  width: 100%;
  height: 100%;
  display: none;

  z-index: 1;

  @include touch {
    &--active {
      display: block;
    }
  }
}

#main {
  display: flex;
  height: 100vh;
  background-color: #f4f3ef;
}

.left {
  flex: 0;
  @include touch {
    flex: initial;
    width: 0;
  }
}

.right {
  flex: 1;
  position: relative;
  @include touch {
    margin-bottom: 3rem;
  }
}

.right-content {
  display: flex;
  flex-flow: row wrap;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  min-width: 20rem;
}

.app-header {
  flex: 0;
}

.app-body {
  position: relative;
  flex: 6;
  background-color: #f4f5f9; //#F8FAFF; // #f4f3ef;
  overflow-y: auto;
  overflow-x: hidden;

  & > .container {
    min-height: 100%;
    padding-top: 3em;
    padding-bottom: 3em;
  }

  @include touch {
    padding: 0.5rem;
  }

  @include mobile {
    padding: 0.25rem;
  }
}

.app-footer {
  flex: 0;
  background-color: gray;
}

#paddingDiv {
  width: 4rem;

  @include touch {
    display: none;
  }
}

#main-over {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  // flex-wrap: wrap;
}

.main-content {
  padding-left: 2rem;
  padding-right: 2rem;
  margin-top: 3.25rem;
}
</style>
