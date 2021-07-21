<template>
  <div class="chart__container">
    <p class="is-size-4 has-text-light">{{ name }}</p>
    <div class="chart__wrapper">
      <canvas ref="chart" width="100" height="100" />
    </div>
    <!-- <div class="block">
      <b-checkbox
        v-for="l in cLabels"
        :key="l"
        v-model="showLabels"
        :native-value="l"
        >{{ l }}</b-checkbox
      >
    </div> -->
  </div>
</template>

<script>
import Chart from 'chart.js/auto'

const COLORS = [
  '#F16B6F',
  '#84B1ED',
  '#3ac569',
  '#FFBC42',
  '#1c140d',
  '#bf209f',
  '#6d819c',
  '#f8ca00',
  '#D499B9',
]

const gridColor = '#6E7783'

export default {
  props: {
    data: {
      default: () => ({
        data: [],
        labels: [],
      }),
      type: Object,
    },
    name: {
      type: String,
      default: 'Plot',
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

  data() {
    return {
      showLabels: [],
      chart: null,
    }
  },

  computed: {
    cLabels() {
      const labels = []
      for (const e of this.data.data) {
        labels.push(e.label)
      }

      return labels
    },
  },

  watch: {
    showLabels(n, o) {
      this.updateChart()
    },

    zoom(n, o) {
      console.log('change zoom')
      this.updateWidth()
      this.updateTicks()
      this.chart.update()
    },
  },

  mounted() {
    this.createChart()
    this.updateChart()
  },

  methods: {
    updateWidth() {
      this.chart.canvas.parentNode.style.width = 100 + this.zoom * 10 + '%'
    },

    updateTicks() {
      this.chart.options.scales.x.ticks.stepSize = 30 * this.zoom * 0.5

      if (this.chart.options.scales.x.ticks.stepSize < 30)
        this.chart.options.scales.x.ticks.count = 30
    },

    updateChart() {
      this.updateTicks()

      const newData = []

      for (let i = 0; i < this.data.data.length; ++i) {
        // if (this.showLabels.includes(this.data.data[i].label))
        newData.push(this.data.data[i])
      }

      this.chart.options.scales.x.min = this.range[0]
      this.chart.options.scales.x.max = this.range[1]

      this.chart.data.datasets = newData

      let i = 0
      this.chart.data.datasets.forEach((dataset) => {
        dataset.borderColor = COLORS[i++]
        dataset.backgroundColor = dataset.borderColor
      })

      this.chart.update()
    },

    createChart() {
      this.chart = new Chart(this.$refs.chart.getContext('2d'), {
        type: 'scatter',
        data: {
          datasets: [],
        },
        options: {
          plugins: {
            legend: {
              labels: {
                color: '#fbd14b',
                font: {
                  size: 12,
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: gridColor,
                borderColor: '#fbd14b',
                tickColor: '#fbd14b',
              },
              ticks: {
                color: '#fbd14b',
                count: 10,
              },
              min: 0,
              max: 1,
            },
            x: {
              grid: {
                color: gridColor,
                borderColor: '#fbd14b',
              },
              ticks: {
                color: '#fbd14b',
              },
            },
          },
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          tension: 0.5,
          fill: false,
          showLine: true,
        },
      })

      this.chart.onResize = () => {
        console.log('Hello!')
      }

      this.chart.canvas.parentNode.style.width = '100%'
    },
  },
}
</script>

<style lang="scss">
.chart {
  &__container {
    // overflow-x: scroll;
    // max-height: 50em;
    padding: 0.25em;
  }

  &__wrapper {
    min-width: 100%;
    min-height: 16em;
    max-height: 16em;
  }
}
</style>
