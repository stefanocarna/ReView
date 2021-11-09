<template>
  <div class="multichart__container columns is-multiline">
    <div v-for="(d, i) in datasets" :key="d.id" class="column" :class="cClass">
      <h-chart
        :name="d.id"
        :data="d"
        :extra-data="extra[i]"
        :range="range"
        :navigator="i === datasets.length - 1"
      />
    </div>
  </div>
</template>
<script>
import HChart from '~/components/HChart.vue'

export default {
  components: {
    HChart,
  },

  props: {
    datasets: {
      type: Array,
      default: () => [],
    },
    extra: {
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
