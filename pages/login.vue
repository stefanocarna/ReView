<template>
  <section class="login__page is-fullheight">
    <div class="container page__container">
      <div class="columns login__container is-centered">
        <!-- <div
          class="column login__side login__side--description is-hidden-touch"
        >
          <div class="login__description"></div>
        </div> -->
        <div class="column is-narrow login__side login__side--panel">
          <div class="login__panel">
            <div class="panel__item">
              <h1 class="panel__title">ReView</h1>
            </div>

            <div class="panel__item">
              <div class="image__container">
                <img
                  class="login__image"
                  src="@/assets/images/png/review-logo.png"
                />
              </div>
            </div>

            <div class="panel__item panel__item--large"></div>

            <!-- <div class="panel__item">
              <button
                class="button panel__button panel__button--google"
                @click="mLoginWithGoogle"
              >
                <span class="icon">
                  <img src="~assets/images/svg/logos/google_logo.svg" />
                </span>
                <span>Accedi con Google</span>
              </button>
            </div>

            <div class="panel__item panel__item--small">
              <button
                class="button panel__button panel__button--facebook"
                @click="mLoginWithFacebook"
              >
                <span class="icon">
                  <img src="~assets/images/svg/logos/facebook_logo.svg" />
                </span>
                <span>Accedi con Facebook</span>
              </button>
            </div>

            <div class="panel__item">
              <div class="hr hr--m-empty">oppure la tua mail</div>
            </div> -->

            <!-- <v-input
                v-if="dSignupMode"
                v-model="dUser"
                vmodel="dUser"
                :label="$t('login.user.label')"
                :placeholder="$t('login.user.placeholder')"
                icon="user"
                rounded
              /> -->

            <div v-show="dSignupMode" class="panel__item panel__item--small">
              <div
                class="is-full-width has-padding-left-10 has-padding-right-10"
              >
                <v-input
                  v-model="dUser"
                  vmodel="dUser"
                  placeholder="Nome Completo"
                  icon="user"
                  input-class="panel__input"
                />
              </div>
            </div>

            <div class="panel__item panel__item--small">
              <div
                class="is-full-width has-padding-left-10 has-padding-right-10"
              >
                <v-input
                  v-model="dEmail"
                  vmodel="dEmail"
                  placeholder="Email"
                  icon="envelope"
                  type="email"
                  focus
                  input-class="panel__input"
                />
              </div>
            </div>

            <div class="panel__item panel__item--small">
              <div
                class="is-full-width has-padding-left-10 has-padding-right-10"
              >
                <v-input
                  v-model="dPassword"
                  vmodel="dPassword"
                  placeholder="Password"
                  type="password"
                  icon="key"
                  input-class="panel__input"
                />
              </div>
            </div>

            <!-- <div v-show="!dSignupMode" class="panel__item panel__item--small">
              <div class="panel__psw-action">
                <a @click="onResetPassword"> Password dimenticata? </a>
              </div>
            </div> -->

            <div class="panel__item">
              <button
                class="button panel__button panel__button--signin"
                @click="onLogin"
              >
                <span>{{ cSigninSignupButton }}</span>
              </button>
            </div>

            <div class="panel__item panel__item--footer">
              <div v-if="!dSignupMode" class="panel__psw-action">
                <p>Non hai un account?</p>
                <a @click="onToggleSignupMode"> Registrati </a>
              </div>
              <div v-else class="panel__psw-action">
                <p>Hai già un account?</p>
                <a @click="onToggleSignupMode"> Login </a>
              </div>
            </div>
          </div>

          <!-- <div class="login-page__container column is-narrow"> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import LoginMixin from '@/mixins/Login.mixin.vue'
import VInput from '~/components/app/VInput.vue'
// import UserPasswordReset from '@/components/modable/UserPasswordReset.vue'

export default {
  layout: 'plain',

  middleware: ['init-app', 'check-no-user'],

  components: {
    VInput,
  },

  mixins: [LoginMixin],

  validations: {
    dEmail: {
      required,
      email,
    },
    dPassword: {
      required,
      minLength: minLength(6),
    },
    dUser: {
      required,
    },
    vLogin: ['dEmail', 'dPassword'],
    vSignup: ['vLogin', 'dUser'],
  },

  data() {
    return {
      dUser: '',
      dEmail: '',
      dPassword: '',
      dSignupMode: false,
    }
  },

  computed: {
    cSigninSignupButton() {
      return this.dSignupMode ? 'Registrati' : 'Accedi'
    },

    cLoginDisabled() {
      return this.dSignupMode
        ? this.$v.vSignup.$anyError
        : this.$v.vLogin.$anyError
    },
  },

  methods: {
    onToggleSignupMode() {
      if (this.dSignupMode) {
        this.$v.vSignup.$reset()
      } else {
        this.$v.vLogin.$reset()
      }
      this.dUser = ''
      this.dEmail = ''
      this.dPassword = ''
      this.dSignupMode = !this.dSignupMode
    },

    async onLogin() {
      if (
        !(this.dSignupMode ? this.$v.vSignup.$invalid : this.$v.vLogin.$invalid)
      ) {
        this.$store.commit('app/SET_LOADING', true)
        if (this.dSignupMode)
          /* Switch to singin layout */
          await this.mSignupWithCredential(
            this.dUser,
            this.dEmail,
            this.dPassword
          ).then(() => {
            this.dSignupMode = false
          })
        else await this.mLoginWithCredential(this.dEmail, this.dPassword)
        this.$store.commit('app/SET_LOADING', false)
      } else {
        this.dSignupMode ? this.$v.vSignup.$touch() : this.$v.vLogin.$touch()
        this.$snotify.clear()
        this.$snotify.error(
          'Hai dimenticato di inserire qualche informazione',
          null,
          {
            timeout: 3000,
            closeOnClick: true,
            showProgressBar: false,
          }
        )
      }
    },

    // onResetPassword() {
    //   this.$promodal
    //     .create(
    //       {
    //         component: UserPasswordReset,
    //         response: [
    //           {
    //             name: 'email',
    //             validator: {
    //               required,
    //               email,
    //             },
    //           },
    //         ],
    //       },
    //       this,
    //       {
    //         title: 'Reimposta password',
    //         size: 'xs',
    //         yesText: 'Invia',
    //         noText: 'Annulla',
    //       }
    //     )
    //     .then(({ email }) => {
    //       this.$firebase
    //         .auth()
    //         .sendPasswordResetEmail(email)
    //         .then(() => {
    //           this.$snotify.success(
    //             `Abbiamo inviato una mail a ${email} con le istruzioni per reimpostare la password`,
    //             {
    //               timeout: 3000,
    //               showProgressBar: false,
    //               position: 'centerTop',
    //             }
    //           )
    //         })
    //         .catch((error) => {
    //           this.$snotify.error(error.message, {
    //             timeout: 3000,
    //             showProgressBar: false,
    //             position: 'rightCenter',
    //           })
    //         })
    //     })
    // },
  },
}
</script>
<style lang="scss">
.panel__input {
  height: 2.5em;
  border-radius: 1em;
  border: 1px solid #909cad;
}
</style>
<style lang="scss" scoped>
@import '@/assets/scss/base.scss';

$panel-elem-size: 24em;
$panel-size: 28em;

.page {
  &__container {
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    margin: auto;
    @include touch {
      display: flex;
      justify-content: center;
    }
  }
}

.panel {
  &__title {
    text-align: center;
    font-size: $size-3;
    color: $primary;
    @include touch {
      font-size: $size-4;
    }
  }

  &__info {
    color: $app-grey-light;
    text-align: center;
    margin-bottom: 0.5rem;
    font-size: $size-6;
  }

  &__item {
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: $panel-elem-size;
    padding: 0 2em;
    margin: 1em 0;

    &--large {
      padding: 0 0.75rem;
    }

    &--small {
      margin: 0.5em 0;
    }

    &--plain {
      margin: 0;
    }

    &--footer {
      margin-top: auto;
    }
  }

  &__input {
    height: 2.5em;
    border-radius: 1em;
    border: 1px solid #909cad;
  }

  &__psw-action {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 2.5em;
    padding: 0 1em;
    @include touch {
      flex-direction: column wrap;
      align-items: center;
      justify-content: flex-start;
    }
  }

  &__button {
    @include eff-shadow;
    @include eff-transition;

    width: 100%;
    border-radius: 1em;
    height: 2.5em;

    &--signin {
      color: #fff;
      background-color: $primary;
      background: linear-gradient(
        90deg,
        $primary 0%,
        $primary-gradient-light 100%
      );
      border: none;
    }

    &--google {
      color: #4285f4;
      border-color: #4285f4;
    }

    &--facebook {
      color: #3d5993;
      border-color: #3d5993;
    }
  }
}

.login {
  &__page {
    display: flex;
    // background-image: url('~assets/images/png/pattern_science.png');
    background-image: url('~assets/images/svg/pattern-randomized.svg');
    padding: 1.5em;
    @include touch {
      padding: 0.5em;
    }
  }
  &__container {
    margin: 0 !important;
    // TODO Reset when enabling left pane
    // @include eff-shadow;
    // background-color: #fff;
    background-color: transparent;
    border-radius: 1.5em;
    flex-wrap: wrap;
    flex-flow: row;

    @include touch {
      // max-width: $panel-size;
    }
  }

  &__image {
    height: auto;
    width: 8em;
  }

  &__panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1em;
    min-height: 40em;

    @include touch {
      min-height: 0;
      padding: 0.5em;
    }
  }
  &__side {
    display: flex;
    flex-direction: column;

    &--panel {
      width: $panel-size;
      min-width: $panel-size;

      @include touch {
        width: 100%;
        min-width: 0;
      }

      // TODO Remove when enabling left pane
      @include eff-shadow;
      background-color: #fff;
      border-radius: 1.5em;
    }

    &--description {
      border-radius: 1.5em 0 0 1.5em;
      background-color: $primary;
      background: linear-gradient(
        90deg,
        $primary 0%,
        $primary-gradient-light 100%
      );
    }
  }
  &__button {
    // width: 10em;
    min-width: 8em;

    @include mobile {
      width: 100%;
      max-width: 90%;
      // min-width: 10em;
      margin-bottom: 1em;
    }

    .icon {
      margin-right: 0.5em !important;
    }
  }
}
</style>
