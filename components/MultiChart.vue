<template>
  <div class="multichart__container">
    <div v-for="d in datasets" :key="d.id">
      <chart :name="d.id" :data="cData[d.id]" :zoom="zoom" :range="range" />
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
    zoom: {
      default: 10,
      type: Number,
    },
    range: {
      type: Array,
      default: () => [0, 1],
    },
  },

  computed: {
    cData() {
      const chartsData = {}

      for (const d of this.datasets) {
        chartsData[d.id] = d.data
      }

      return chartsData
    },
  },
}
</script>
<style lang="scss">
.multichart {
  &__container {
    overflow-x: scroll;
    min-width: 100%;
  }
}
</style>
