<template>
  <div class="modal-card">
    <header :class="cHeaderClass">
      <slot name="header">
        <span class="card-title">{{ title }}</span>
      </slot>
    </header>

    <div class="modal-card-body">
      <div v-if="icon" class="icon-container">
        <img class="icon" :src="compIcon" />
      </div>

      <div class="content-container">
        <span v-if="cComponentIsHTML" class="content-text" v-html="component" />
        <span v-else-if="cComponentIsString" class="content-text">
          {{ component }}
        </span>
        <component :is="dComponent" v-else v-bind="dProps" v-on="dListeners" />
      </div>
    </div>

    <footer :class="cFooterClass">
      <div class="actions-container">
        <button
          v-if="!yesOnly"
          class="
            button
            is-borderless
            action-button action-button--no
            is-rounded
            fx-shadow-less
          "
          @click="reject"
        >
          {{ cNoText }}
        </button>
        <button
          v-if="!noOnly"
          class="
            button
            is-borderless
            action-button action-button--yes
            is-rounded
            fx-shadow-less
          "
          :disabled="!cCanYes"
          @click="resolve"
        >
          {{ cYesText }}
        </button>
      </div>
    </footer>
  </div>
</template>

<script>
const generateListener = function (props, attr) {
  return (evt) => {
    // console.log('got update', evt)
    props[attr] = evt
  }
}

export default {
  props: {
    title: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: null,
    },

    yesText: {
      type: String,
      default: null,
    },

    noText: {
      type: String,
      default: null,
    },

    noOnly: {
      type: Boolean,
      default: false,
    },

    yesOnly: {
      type: Boolean,
      default: false,
    },

    simple: {
      type: Boolean,
      default: true,
    },

    html: {
      type: Boolean,
      default: false,
    },

    /* there are related to injected component */
    component: [Object, String],

    props: Object,

    response: {
      type: Array,
      default: () => [],
    },

    listeners: Object,

    resolver: Function,

    rejecter: Function,
  },

  data() {
    return {
      dComponent: this.component,
      dProps: this.props ? Object.assign(this.props) : {},
      dListeners: this.listeners ? Object.assign({}, this.listeners) : {},
    }
  },

  computed: {
    cYesText() {
      return this.yesText
        ? this.yesText
        : this.$t('comp.actionmodal.default.yes')
    },

    cNoText() {
      return this.noText ? this.noText : this.$t('comp.actionmodal.default.no')
    },

    /* Enable yes button if conditions are satisfied */
    cCanYes() {
      for (let i = 0; i < this.response.length; ++i) {
        if (!this.response[i].validator || !this.response[i].name) continue
        if (!this.response[i].validator(this.dProps[this.response[i].name]))
          return false
      }
      return true
    },

    compIcon() {
      if (this.icon) {
        if (this.iconType) return '~assets/images/try/paper-recycle.svg'
        return this.icon
      }
      return null
    },

    cHeaderClass() {
      return this.simple
        ? 'modal-card-head'
        : 'modal-card-head modal-card-head--decorated'
    },

    cFooterClass() {
      return this.simple
        ? 'modal-card-foot'
        : 'modal-card-foot modal-card-foot--decorated'
    },

    cComponentIsString() {
      return this.component.constructor === String
    },

    cComponentIsHTML() {
      return this.component.constructor === String && this.html
    },
  },

  created() {
    for (let i = 0; i < this.response.length; ++i) {
      const attr =
        this.response[i].constructor === String
          ? this.response[i]
          : this.response[i].name

      if (!this.dProps[attr])
        this.$set(this.dProps, attr, this.response[i].default)
      this.dListeners['update:' + attr] = generateListener(this.dProps, attr)
    }
  },

  methods: {
    resolve() {
      const response = {}
      for (const attr in this.dProps) {
        response[attr] = this.dProps[attr]
      }

      if (this.resolver) this.resolver(response)
      this.$emit('close')
    },

    reject() {
      if (this.rejecter) this.rejecter()
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

$family-secondary: 'Cabin';

.modal-card {
  @include mobile {
    max-height: calc(100vh - 3em);
  }
}

.card-title {
  font-size: 2em;
}

.modal-content {
  overflow: hidden;
}

.modal-card-head {
  border-radius: 1em 1em 0 0;
  &--decorated {
    box-shadow: 0px 0.2em 0.5em rgba(235, 235, 235, 1);
  }
}

.modal-card-body {
  @include mobile {
    padding: 0.5em;
  }
}

.modal-card-foot {
  border-radius: 0 0 1em 1em;
  &--decorated {
    box-shadow: 0px -0.2em 0.5em rgba(235, 235, 235, 1);
  }
}

.modal-card-head,
.modal-card-foot {
  display: flex;
  justify-content: center;
  background-color: #fff;
  border: none;
  padding: 0.75em;
  z-index: 1;
  font-family: $family-secondary;
}
</style>

<style lang="scss" scoped>
@import '~bulma/sass/utilities/_all';

$primary: #0f77ea;
$danger: #ff3860;

$default-size: 8em;

.icon-container {
  display: flex;
  justify-content: center;
}

.icon {
  width: 4em;
  height: auto;
}

.content-container {
  display: flex;
  justify-content: center;
  margin: 0;
}

.content-text {
  text-align: center;
}

.actions-container {
  display: flex;
  justify-content: center;
}

.action-button {
  width: $default-size;
  text-transform: uppercase;
  font-family: Raleway;
  font-weight: bold;

  margin: 0 0.5em;

  &--no {
    background-color: $primary;
    color: #fff;
  }

  &--yes {
    color: $primary;
  }
}
</style>
