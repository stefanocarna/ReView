<template>
  <b-field :label="label" :type="cErrorClass" :message="cMesagge">
    <b-input
      v-model="dModel"
      v-bind="$attrs"
      :custom-class="inputClass"
      @change.native="touch"
    />
  </b-field>
</template>

<script>
export default {
  props: {
    inputClass: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      // TODO change in required: true
      type: [Number, String],
      default: '',
      // required: true
    },
    vmodel: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      dModel: this.value,
    }
  },

  computed: {
    cV() {
      let v = this.$parent.$v
      const s = this.vmodel.split('.')
      for (let i = 0; i < s.length; ++i) {
        v = v[s[i]]
      }
      return v
    },

    cMesagge() {
      if (this.cHasError) {
        for (const k in this.cV.$params) {
          if (!this.cV[k]) {
            console.log(this)
            return this.$t('validator.' + k)
          }
        }
      }
      return ''
    },

    cHasError() {
      return this.cV.$error
    },

    cErrorClass() {
      return { 'is-danger': this.cHasError }
    },
  },

  watch: {
    value(v) {
      this.dModel = v
    },
    dModel(v) {
      this.$emit('input', v)
    },
  },

  created() {
    // Check for vuelidate instance on parent
    if (!this.$parent && !this.$parent.$v)
      console.err('No validator on parent instance')
  },

  methods: {
    touch() {
      this.cV.$touch()
    },
  },
}
</script>
