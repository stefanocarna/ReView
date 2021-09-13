<template>
  <div class="is-flex is-justify-content-center">
    <b-field class="file is-primary" :class="{ 'has-name': !!file }">
      <b-upload v-model="file" class="file-label">
        <span class="file-cta">
          <b-icon class="file-icon" icon="upload"></b-icon>
          <span class="file-label">Click to upload</span>
        </span>
        <span v-if="file" class="file-name">
          {{ file.name }}
        </span>
      </b-upload>
    </b-field>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      default: () => [],
      type: Array,
      required: true,
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
        this.$emit('update:value', JSON.parse(this.text))
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
