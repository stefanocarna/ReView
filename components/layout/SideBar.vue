<template>
  <div :class="cSideBarClass">
    <nuxt-link class="side-item side-logo" :to="localePath({ name: 'home' })">
      <img class="logo-image" src="~assets/images/png/review-logo.png" />
      <transition name="fade">
        <span v-show="extended" class="logo-text is-size-5">ReView</span>
      </transition>
    </nuxt-link>

    <div class="space" style="margin-bottom: 2rem" />

    <div class="sidebar__pane">
      <p class="pane__label">Local profiles</p>

      <!-- <uploader style="width: 100%" /> -->
    </div>

    <div class="sidebar__pane">
      <p class="pane__label">Remote profiles</p>

      <b-tooltip
        v-show="extended"
        v-for="p in gProfiles.slice(0, 5)"
        :key="p.id"
        :label="p.description ? p.description : 'No Description'"
        position="is-right"
        type="is-dark"
        animated
      >
        <a class="side-item" @click="selectProfile(p)">
          <transition name="fade">
            <span v-show="extended">
              {{ p.machine ? p.machine : 'Unknown' }}
              <p class="side-item-subtext">
                {{ new Date(p.date).toLocaleString('it-IT') }}
              </p>
            </span>
          </transition>
        </a>
      </b-tooltip>
    </div>

    <b-button @click="showProfiles">
      <span v-if="extended">See all</span>
      <b-icon v-else icon="search" />
    </b-button>

    <button class="button toggle" @click="extended = !extended">
      <b-icon size="is-small" icon="arrows-alt-h" icon-pack="fas" />
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import Uploader from '@/components/Uploader.vue'
import ProfilesViewer from '@/components/modable/ProfilesViewer.vue'

export default {
  components: {
    // Uploader,
  },

  computed: {
    ...mapGetters({
      gProfiles: 'profile/gProfiles',
    }),

    cSideBarClass() {
      let cClass = 'sidebar'
      cClass += this.extended ? ' extended' : ' collapsed'

      return cClass
    },
  },

  // mixins: [NavigationMixin, StoreMixin],

  data() {
    return {
      extended: true,
      profile: {},
    }
  },

  methods: {
    formatDate(profile) {
      return new Date(profile.date).toLocaleDateString('en-US')
    },

    selectProfile(profile) {
      this.$store.commit('app/SET_LOADING', true)

      this.$store.dispatch('profile/fetch', profile.id).finally(() => {
        this.$store.commit('app/SET_LOADING', false)
      })
    },

    showProfiles() {
      this.$promodal
        .create(
          {
            component: ProfilesViewer,
            props: {
              profile: this.profile,
            },
            response: [
              {
                name: 'profile',
              },
            ],
          },
          this,
          {
            title: 'Select a profile to plot',
            size: 'xl',
            yesText: 'Select',
          }
        )
        .then(({ profile }) => {
          if (!profile) {
            console.err('Something wrong in the promise.then - no profile')
          }
          this.selectProfile(profile)
        })
        .catch((err) => {
          console.log('Rejected', err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active {
  animation: fadeIn 0.3s;
}
.fade-leave-active {
  animation: fadeOut 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}

@import '~bulma/sass/utilities/_all';

$sidebar-base: #262f3d;

.sidebar {
  // top: 0;
  // left: 0;
  // position: fixed;

  @include touch {
    transform: translateX(-12rem);
  }

  z-index: 12;

  padding: 0 0.5rem;

  height: 100vh;

  display: flex;
  flex-direction: column;
  // justify-content: center;
  // height: 100%;

  // margin-left: -.75rem;
  background-color: $sidebar-base;

  transition: all 0.3s;

  &.extended {
    width: 12rem;
  }

  &.collapsed {
    width: 4rem;
  }

  &__pane {
    display: flex;
    flex-direction: column;
    margin-bottom: 2rem;
  }

  & .pane {
    &__label {
      color: #fff;
      font-size: 0.75rem;

      margin-bottom: 1rem;
    }
  }

  .button.toggle {
    // background: transparent;
    margin-top: auto;

    color: white;
    border: none;
    text-decoration: none;
    background-color: darken($sidebar-base, 7%);

    &:focus {
      box-shadow: none;
    }

    // border: none;
    // border-top: 1px white solid;
    // margin-bottom: -0.75rem;
  }

  & .side-logo {
    border-bottom: 1px solid lightgray;
    // box-shadow: 0 -0.3rem 0.5rem 0.5rem rgba(255, 255, 255, 0.5);
    justify-content: center;

    & .logo-text {
      margin-left: 1rem;
    }
  }

  & .side-item {
    display: flex;
    align-items: center;
    color: #fff;
    // justify-content: center;
    // padding-left: 1rem;
    // padding-right: 1rem;
    height: 3.5rem;
    transition: all 0.2s;

    &.disabled {
      color: gray;
      cursor: default;

      & .side-item-text {
        color: gray;
      }
    }

    & .side-item-subtext {
      font-size: 0.75rem;
      color: gray;
    }

    &:hover {
      color: #3b8beb;

      &.disabled {
        color: gray;
      }

      & .side-item-text {
        display: block;
      }
    }

    & .side-item-text {
      margin-left: 1rem;
      font-size: 1rem;
      color: #fff;
    }

    & .logo-text {
      font-family: Cabin;
      color: white;
    }

    & .logo-image {
      width: 2rem;
      height: 2rem;
    }
  }
}

// .item {
//   display: flex;
//   align-items: center;

//   background-color: $dark;
//   margin: 1rem 0;
//   padding: .75rem 0;
//   border-radius: 0 .75rem .75rem 0;

//   width: 4.25rem;
//   transition: width .4s;

//   // padding: 1rem auto;
//   box-shadow: 5px 5px 0px 0px #289FED, 0px 5px 0px 0px #289FED;

//   & .item-label {
//     color: yellow;
//     opacity: 0;
//     margin-left: -12rem;
//     transition: opacity .3s, margin-left .5s .1s;
//   }

//   &:hover {
//     width: 12rem;

//     .item-label {
//       opacity: 1;
//       margin-left: 1rem;
//       transition: opacity .3s .1s, margin-left .5s;
//     }
//   }

// }

// & .icon {
//   justify-content: center;
// }

// .icon {
//   color: white;
//   margin: auto 1rem;
// }

/*.menu-list a {
    color: white;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }

  .menu-list .icon {
    margin-right: 0.5rem;
  }

  .menu-list a:hover {
    background-color: initial;
  }

  .menu-label {
    color: yellow;
  }
*/
</style>
