<template>
  <div class="chart__container">
    <p class="is-size-5">{{ name }}</p>
    <div class="chart__wrapper">
      <canvas ref="chart" width="100" height="100" />
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
import { Interaction } from 'chart.js'
import { CrosshairPlugin, Interpolate } from 'chartjs-plugin-crosshair'
Chart.register(CrosshairPlugin)
Interaction.modes.interpolate = Interpolate

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
    cData() {
      return this.data.data
    },
  },

  watch: {
    data() {
      /* Workaround: Need to reset the zoom  */
      const zoomButtons = document.getElementsByClassName('chart-reset-zoom')
      if (zoomButtons.length) zoomButtons[0].click()

      this.updateChart()
    },
  },

  mounted() {
    this.createChart()
  },

  methods: {
    generateChartData() {
      const newData = []
      for (let i = 0; i < this.cData.data.length; ++i) {
        newData.push(this.cData.data[i])
      }
      return newData
    },

    updateChart() {
      const newData = this.generateChartData()

      this.chart.options.scales.x.min = this.range[0]
      this.chart.options.scales.x.max = this.range[1]
      this.chart.data.datasets = newData
      this.chart.update()
    },

    createChart() {
      const newData = this.generateChartData()

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
                // color: gridColor,
                // borderColor: '#fbd14b',
                // tickColor: '#fbd14b',
              },
              ticks: {
                // color: '#fbd14b',
                count: 10,
                stepSize: 100,
              },
              min: 0,
              max: 1000,
            },
            x: {
              suggestedMin: this.range[0],
              suggestedMax: this.range[1],
              grid: {
                // color: gridColor,
                // borderColor: '#fbd14b',
              },
              ticks: {
                // color: '#fbd14b',
              },
            },
          },
          animation: false,
          responsive: true,
          maintainAspectRatio: false,
          tension: 0.5,
          fill: false,
          showLine: true,
          spanGaps: true,
          esponsiveAnimationDuration: 0,

          plugins: {
            legend: {
              labels: {
                // color: '#fbd14b',
                font: {
                  size: 12,
                },
              },
            },
            areas: {},
            // tooltip: {
            //   mode: 'interpolate',
            //   intersect: false,
            // },
            crosshair: {
              sync: {
                enabled: true,
                suppressTooltips: false,
                group: 1,
              },
              zoom: {
                zoomButtonClass: 'chart-reset-zoom',
              },
              pan: {
                incrementer: 3, // Defaults to 5 if not included.
              },
            },
          },
        },
      })

      const panZoom = (e) => {
        const min = this.chart.options.scales.x.min
        const max = this.chart.options.scales.x.max

        const val = (max - min) / 10

        if (e.keyCode === 37) {
          this.chart.panZoom(-val)
        } else if (e.keyCode === 39) {
          this.chart.panZoom(val)
        }
      }

      window.addEventListener('keydown', panZoom)
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
    // min-width: 100%;
    // width: 100%;
    min-height: 16em;
    max-height: 16em;

    width: 50%;
    float: left;
    position: relative;
  }
}
</style>
