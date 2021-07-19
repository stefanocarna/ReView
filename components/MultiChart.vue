<template>
  <div class="multichart__container">
    <div v-for="d in datasets" :key="d.id">
      <s-chart :name="d.id" :data="cData[d.id]" :zoom="zoom" :range="range" />
    </div>
  </div>
</template>
<script>
import SChart from '@/components/SChart.vue'

export default {
  components: {
    SChart,
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
