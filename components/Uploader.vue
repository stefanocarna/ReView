<template>
  <!-- <div class="is-flex is-justify-content-center"> -->
  <!-- <b-field class="file is-primary" :class="{ 'has-name': !!file }"> -->
  <b-upload v-model="file">
    <span class="button uploader">
      <!-- <b-icon class="file-icon" icon="upload"></b-icon> -->
      <span class="file-label">Upload</span>
    </span>
  </b-upload>
  <!-- </b-field>
  </div> -->
</template>

<script>
export default {
  props: {
    value: {
      default: () => [],
      type: [Array, String],
      required: true,
    },
    stringify: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      file: null,
      text: '',
    }
  },

  watch: {
    async file(n, o) {
      if (n != null) {
        this.$store.commit('app/SET_LOADING', true)
        this.text = await this.readFile(this.file)
        if (this.stringify) this.$emit('update:value', JSON.parse(this.text))
        else this.$emit('update:value', this.text)
        this.$store.commit('app/SET_LOADING', false)
      }
    },
  },

  methods: {
    readFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (res) => {
          resolve(res.target.result)
        }
        reader.onerror = (err) => reject(err)

        reader.readAsText(file)
      })
    },
  },
}
</script>

<style lang="scss">
.uploader {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
