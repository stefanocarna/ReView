<template>
  <div class="columns is-multiline p-3 m-0">
    <div class="column is-5">
      <p class="is-size-4 has-text-light has-text-centered m-2">
        Select a data file
      </p>
      <uploader :value.sync="dataJson" />
    </div>
    <div class="column is-2"></div>
    <div class="column is-5">
      <p class="is-size-4 has-text-light has-text-centered m-2">Zoom level</p>
      <b-field>
        <b-slider
          :min="1"
          :max="50"
          ticks
          v-model.lazy="zoom"
          :custom-formatter="(val) => val + '%'"
          :tooltip="false"
          indicator
        ></b-slider>
      </b-field>
    </div>
    <div class="column is-12">
      <multi-chart :datasets="cDataset" :zoom="zoom" :range="cRange" />
    </div>
  </div>
</template>

<script>
import MultiChart from '@/components/MultiChart.vue'
import Uploader from '@/components/Uploader.vue'
import { Metric, DataAnalyzer } from '@/js/tma.js'

export default {
  components: {
    MultiChart,
    Uploader,
  },

  data() {
    return {
      dataJson: [],
      rawDatasets: [],
      zoom: 1,
      metric: Metric.MTSS,
      skipLabels: ['pipeline_w', 'slots', 'time'],
    }
  },

  computed: {
    cDataset() {
      const cDataset = []

      for (const e of this.rawDatasets)
        cDataset.push({ id: e.id, data: this.processDataset(e.data) })

      return cDataset
    },

    cRange() {
      let min = Number.MAX_SAFE_INTEGER
      let max = Number.MIN_SAFE_INTEGER

      for (const e of this.rawDatasets) {
        const data = e.data.getComputedData()
        if (min > data[0].time) min = data[0].time
        if (max < data[data.length - 1].time) max = data[data.length - 1].time
      }

      return [min, max]
    },
  },

  watch: {
    dataJson(n, o) {
      this.rawDatasets.splice(0, this.rawDatasets.length)

      for (const e of this.dataJson) {
        const rawData = new DataAnalyzer(e.data)
        rawData.preProcess()
        this.rawDatasets.push({ id: e.id, data: rawData })
      }
    },
  },

  methods: {
    processDataset(d) {
      const data = []
      const datasets = {}

      for (const m of d.getAvailableMetrics()) {
        datasets[m.name] = {
          label: m.name,
          data: [],
        }
      }

      for (const e of d.getComputedData()) {
        for (const [k, v] of Object.entries(e)) {
          datasets[k].data.push({ y: v > 0 ? v : 0, x: e.time })
        }
      }

      for (const k of Object.keys(datasets)) {
        if (this.skipLabels.includes(k)) continue
        data.push(datasets[k])
      }

      return { data }
    },
  },
}
</script>
