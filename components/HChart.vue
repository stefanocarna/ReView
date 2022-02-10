<template>
  <div class="chart__container">
    <div class="is-flex is-justify-content-flex-end">
      <div class="aggregator" v-for="agg in dAggregate" :key="agg.name">
        <div
          class="aggregator__indicator"
          :style="{ backgroundColor: agg.color }"
        />
        <span class="is-size-6">
          {{ Math.round((agg.value + Number.EPSILON) * 100) / 100 }} %
        </span>
      </div>
    </div>
    <div ref="chart_parent" class="chart__wrapper">
      <div ref="chart" />
    </div>
  </div>
</template>

<script>
import Highcharts from 'highcharts/highstock'

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
      if (chart && chart !== thisChart) {
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
    navigator: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      chart: null,
      dAggregate: [],
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

            if (chart) {
              // Find coordinates within the chart
              const event = chart.pointer.normalize(e)
              // Get the hovered point
              const point = chart.series[0].searchPoint(event, true)

              if (point) {
                point.highlight(e)
              }
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

    syncAggregated() {
      this.dAggregate.splice(0)

      for (const s of this.chart.series) {
        if (this.navigator && s.name.includes('Navigator')) continue
        if (!s.points.length) {
          this.dAggregate.push({ name: s.name, color: 'grey', value: 0 })
          continue
        }

        const color = s.points[0].color

        let cAgg = 0
        let cElem = 0
        let init = false

        for (const p of s.points) {
          if (p.isInside) {
            init = true
            cAgg += p.y
            cElem++
          } else if (init) {
            break
          }
        }

        this.dAggregate.push({
          name: s.name,
          color,
          value: cElem > 0 ? cAgg / cElem : 0,
        })
      }
    },

    updateChart() {
      this.chart.destroy()
      this.createChart()
    },

    createChart() {
      const series = this.generateSeriesData()

      const hchart = this

      const plotBands = []

      for (const range of this.data.highlights.data) {
        plotBands.push({
          from: range.from,
          to: range.to,
          color: 'rgba(168, 100, 113, .1)',
        })
      }

      this.chart = Highcharts.stockChart(this.$refs.chart, {
        chart: {
          zoomType: 'x',
          height: '300px',
          borderColor: 'gray',
          borderWidth: 1,
          panning: {
            enabled: true,
            type: 'x',
          },
          panKey: 'shift',

          events: {
            redraw: this.syncAggregated,
          },
        },

        navigator: {
          enabled: this.navigator,
        },

        scrollbar: {
          enabled: this.navigator,
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

          type: 'datetime',
          labels: {
            format: '{value}',
            align: 'right',
            rotation: -30,
          },
        },
        yAxis: {
          min: 0,
          max: 100,
          tickInterval: 20,
          title: {
            text: '%',
          },
        },
        series,

        plotOptions: {
          series: {
            // pointStart: Date.UTC(2021, 0, 1),
          },
        },

        rangeSelector: {
          inputEnabled: false,
          buttons: [
            {
              type: 'day',
              count: 3,
              text: '3d',
            },
            {
              type: 'week',
              count: 1,
              text: '1w',
            },
            {
              type: 'month',
              count: 1,
              text: '1m',
            },
            {
              type: 'month',
              count: 6,
              text: '6m',
            },
            {
              type: 'year',
              count: 1,
              text: '1y',
            },
            {
              type: 'all',
              text: 'All',
            },
          ],
          selected: 3,
        },
      })
      this.syncAggregated()
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

.aggregator {
  border-radius: 0.25em;
  display: flex;
  align-items: center;
  width: 5.75em;
  margin: 0.25em;

  &__indicator {
    width: 1em;
    height: 1em;
    margin-right: 0.25em;
  }
}
</style>
