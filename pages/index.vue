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
      <p class="is-size-4 has-text-light has-text-centered m-2">
        Zoom level:
        <span class="has-text-primary">{{ zoom }} % </span>
      </p>
      <b-field>
        <b-button class="mr-3" @click="zoom = zoom - 10 < 0 ? 1 : zoom - 10"
          >-</b-button
        >
        <b-slider
          :min="1"
          :max="50"
          ticks
          v-model.lazy="zoom"
          size="is-medium"
        ></b-slider>
        <b-button class="ml-3" @click="zoom = zoom + 10 > 50 ? 50 : zoom + 10"
          >+</b-button
        >
      </b-field>
    </div>
    <div class="column is-12">
      <div class="block">
        <b-checkbox
          v-for="l in cLabels"
          :key="l"
          v-model="showLabels"
          :native-value="l"
          >{{ l }}</b-checkbox
        >
      </div>
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
      showLabels: ['BB', 'BS', 'RE', 'FB'],
      dataJson: [],
      rawDatasets: [],
      zoom: 1,
      metric: Metric.MTSS,
      skipLabels: ['pipeline_w', 'slots', 'time'],
      dDataset: [],
    }
  },

  computed: {
    cDataset() {
      const cDataset = []
      for (const e of this.rawDatasets) {
        cDataset.push({
          id: e.id,
          data: this.processDataset(e.data),
          highlights: this.processHighlights(e.data),
        })
      }

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

    cLabels() {
      return ['BB', 'BS', 'RE', 'FB', 'MB', 'CB', 'L1B', 'L2B', 'L3B', 'DRAMB']
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
        if (!this.showLabels.includes(k)) continue
        data.push(datasets[k])
      }

      return { data }
    },

    processHighlights(d) {
      const data = []

      const rawData = d.getDataByRawMetric('TRACKED')

      /* Try to collapse subsequent rects */
      for (let i = 0; i < rawData.length - 1; ++i) {
        if (rawData[i] === 0) continue

        let offSet = i + 1
        while (rawData[offSet] && offSet < rawData.length - 1) offSet++

        data.push(i)
        data.push(offSet)
        i = offSet
      }

      return { data }
    },
  },
}
</script>
