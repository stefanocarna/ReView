<template>
  <div class="chart__container">
    <div ref="chart_parent" class="chart__wrapper">
      <div ref="chart" />
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts'

/**
 * Override the reset function, we don't need to hide the tooltips and
 * crosshairs.
 */
Highcharts.Pointer.prototype.reset = function () {
  return undefined
}

/**
 * Highlight a point by showing tooltip, setting hover state and draw crosshair
 */
Highcharts.Point.prototype.highlight = function (event) {
  event = this.series.chart.pointer.normalize(event)
  this.onMouseOver() // Show the hover marker
  // this.series.chart.tooltip.refresh(this) // Show the tooltip
  this.series.chart.xAxis[0].drawCrosshair(event, this) // Show the crosshair
}

function syncExtremes(e) {
  const thisChart = this.chart

  if (e.trigger !== 'syncExtremes') {
    // Prevent feedback loop
    Highcharts.each(Highcharts.charts, function (chart) {
      if (chart !== thisChart) {
        if (chart.xAxis[0].setExtremes) {
          // It is null while updating
          chart.xAxis[0].setExtremes(e.min, e.max, undefined, false, {
            trigger: 'syncExtremes',
          })
        }
      }
    })
  }
}

export default {
  props: {
    data: {
      default: () => ({
        data: [],
        labels: [],
      }),
      type: Object,
    },
    extraData: {
      default: () => {},
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
    this.patchParent()
    this.createChart()
  },

  methods: {
    patchParent() {
      const a = ['mousemove', 'touchmove', 'touchstart']

      a.forEach((eventType) => {
        this.$refs.chart_parent.addEventListener(eventType, function (e) {
          for (let i = 0; i < Highcharts.charts.length; i = i + 1) {
            const chart = Highcharts.charts[i]
            // Find coordinates within the chart
            const event = chart.pointer.normalize(e)
            // Get the hovered point
            const point = chart.series[0].searchPoint(event, true)

            if (point) {
              point.highlight(e)
            }
          }
        })
      })
    },

    generateSeriesData() {
      const series = []

      for (const e of this.cData.data) {
        const data = []

        for (const d of e.data) data.push([d.x, d.y])

        series.push({
          name: e.label,
          data,
          pointStart: data.pointStart,
          pointInterval: data.pointInterval,
        })
      }
      return series
    },

    updateChart() {
      console.log('Update')
      const series = this.generateSeriesData()

      this.chart.xAxis[0].setExtremes(this.range[0], this.range[1])

      for (let i = 0; i < series.length; ++i) {
        this.chart.series[i].update(series[i])
      }
    },

    createChart() {
      const series = this.generateSeriesData()

      for (const e of this.cData.data) {
        const data = []

        for (const d of e.data) data.push([d.x, d.y])

        series.push({
          name: e.label,
          data,
          pointStart: data.pointStart,
          pointInterval: data.pointInterval,
        })
      }

      const hchart = this

      const plotBands = []

      for (const range of this.data.highlights.data) {
        plotBands.push({
          from: range.from,
          to: range.to,
          color: 'rgba(168, 100, 113, .1)',
        })
      }

      this.chart = Highcharts.chart(this.$refs.chart, {
        chart: {
          zoomType: 'x',
          height: '160px',
          borderColor: 'gray',
          borderWidth: 1,
        },
        title: {
          text: this.name,
          align: 'left',
          margin: 8,
          style: { color: '#333333', fontSize: '14px' },
        },
        legend: {
          // verticalAlign: 'top',
          enabled: false,
        },
        tooltip: {
          shared: true,
          split: false,
          enabled: true,
          formatter() {
            let tip = ''
            const points = this.points

            for (const p of points) {
              tip +=
                "<span style='color:" +
                p.color +
                "'>\u25CF</span> " +
                p.series.name +
                ' : <b>' +
                p.y +
                '</b><br/>'
            }

            if (points.length > 0) {
              tip += '<hr />'
              tip +=
                '<b>PID : </b>' +
                hchart.extraData.id[points[0].point.index] +
                '<br/>'
              tip +=
                '<b>NAME : </b>' +
                hchart.extraData.name[points[0].point.index] +
                '<br/>'
            }

            return tip
          },
        },
        xAxis: {
          min: this.range[0],
          max: this.range[1],
          crosshair: true,
          events: {
            setExtremes: syncExtremes,
          },
          text: 'TSC',
          plotBands,
        },
        yAxis: {
          min: 0,
          max: 1000,
          tickInterval: 200,
          title: {
            text: '%',
          },
        },
        series,
      })
    },
  },
}
</script>

<style lang="scss">
.chart {
  &__container {
    // overflow-x: scroll;
    // max-height: 50em;
  }

  &__wrapper {
    // min-width: 100%;
    // width: 100%;

    width: 100%;
    float: left;
    position: relative;
  }
}
</style>
