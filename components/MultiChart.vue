<template>
  <div class="multichart__container columns is-multiline">
    <div v-for="d in datasets" :key="d.id" class="column" :class="cClass">
      <chart :name="d.id" :data="d" :range="range" />
    </div>
  </div>
</template>
<script>
import Chart from '~/components/Chart.vue'

export default {
  components: {
    Chart,
  },

  props: {
    datasets: {
      type: Array,
      default: () => [],
    },
    range: {
      type: Array,
      default: () => [0, 1],
    },
    perRow: {
      type: Number,
      default: 1,
    },
  },

  computed: {
    cClass() {
      return 'is-' + 12 / this.perRow
    },
  },
}
</script>
<style lang="scss">
.multichart {
  &__container {
  }
}
</style>
