<template>
  <div class="chart__container">
    <p class="is-size-4 has-text-light">{{ name }}</p>
    <div class="chart__wrapper">
      <canvas ref="chart" width="100" height="100" />
    </div>
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
      chart: null,
    }
  },

  computed: {
    cHighlights() {
      return this.data.highlights.data
    },

    cData() {
      return this.data.data
    },

    cAreas() {
      return {
        id: 'areas',
        beforeDraw: (chart, args, options) => {
          const { ctx, chartArea } = chart
          const TOP = chartArea.top
          const AREA = chartArea.bottom - chartArea.top
          const meta = chart.getDatasetMeta(0)
          ctx.save()
          ctx.fillStyle = 'lightGreen'
          for (let i = 0; i < this.cHighlights.length - 1; i += 2) {
            const e1 = this.cHighlights[i]
            const e2 = this.cHighlights[i + 1]
            const start = meta.data[e1].x
            const stop = meta.data[e2].x
            ctx.fillRect(start, TOP, stop - start, AREA)
          }
          ctx.restore()
        },
      }
    },
  },

  watch: {
    data() {
      this.updateChart()
    },

    zoom(n, o) {
      this.updateWidth()
      this.updateTicks()
      this.chart.update()
      // this.updateChart()
    },
  },

  mounted() {
    this.createChart()
  },

  methods: {
    updateWidth() {
      this.chart.canvas.parentNode.style.width =
        100 + (this.zoom - 1) * 10 + '%'
    },

    updateTicks() {
      this.chart.options.scales.x.ticks.stepSize = 30 * this.zoom * 0.5

      if (this.chart.options.scales.x.ticks.stepSize < 30)
        this.chart.options.scales.x.ticks.count = 30
    },

    updateChart() {
      this.updateTicks()

      const newData = []

      for (let i = 0; i < this.cData.data.length; ++i) {
        newData.push(this.cData.data[i])
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
      const newData = []

      for (let i = 0; i < this.cData.data.length; ++i) {
        newData.push(this.cData.data[i])
      }

      let i = 0
      newData.forEach((dataset) => {
        dataset.borderColor = COLORS[i++]
        dataset.backgroundColor = dataset.borderColor
      })

      this.chart = new Chart(this.$refs.chart.getContext('2d'), {
        type: 'scatter',
        data: {
          datasets: newData,
        },
        options: {
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
              // TODO change to 0 when fixing data parsing
              min: -1,
              max: 1001,
            },
            x: {
              suggestedMin: this.range[0],
              suggestedMax: this.range[1],
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

          plugins: {
            legend: {
              labels: {
                color: '#fbd14b',
                font: {
                  size: 12,
                },
              },
            },
            areas: {},
          },
        },
        plugins: [this.cAreas],
      })

      // this.chart.onResize = () => {
      //   console.log('Hello!')
      // }

      this.updateTicks()
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
    width: 100%;
    min-height: 16em;
    max-height: 16em;
  }
}
</style>
