<template>
  <div class="columns is-multiline p-3 m-0">
    <div class="column is-6">
      <b-button v-if="!gIsConnected" @click="$store.dispatch('socket/connect')">
        ENABLE Realtime</b-button
      >
      <b-button v-else @click="$store.dispatch('socket/disconnect')">
        STOP Realtime</b-button
      >
    </div>
    <div
      class="
        column
        is-6
        has-text-centered
        is-flex is-flex-direction-column is-align-content-center
      "
    >
      <p class="is-size-4 has-text-centered m-2">Set charts per row</p>
      <div
        class="
          block
          is-flex is-align-content-center is-justify-content-space-evenly
        "
      >
        <b-field>
          <b-radio-button
            v-for="v in perRowChartValues"
            :key="v"
            v-model="perRowCharts"
            :native-value="v"
          >
            {{ v }}
          </b-radio-button>
        </b-field>
      </div>
    </div>
    <div class="column is-12 has-text-centered">
      <p class="is-size-4 has-text-centered">Filters & Presets</p>
      <div
        class="
          block
          is-flex is-align-content-center is-justify-content-space-evenly
        "
      >
        <div class="is-flex is-align-content-center">
          <b-checkbox
            v-for="l in cLabels"
            :key="l"
            v-model="showLabels"
            :native-value="l"
            >{{ l }}</b-checkbox
          >
        </div>
        <div>
          <b-button
            v-for="p in dPresets"
            :key="p.name"
            @click="setPreset(p.value)"
            >{{ p.name }}</b-button
          >
        </div>
      </div>
    </div>
    <div class="column is-12">
      <multi-chart
        :datasets="cDataset"
        :range="cRange"
        :perRow="perRowCharts"
      />
    </div>
  </div>
</template>

<script>
import MultiChart from '@/components/MultiChart.vue'
import { Metric, DataAnalyzer } from '@/js/tma.js'
import { mapGetters } from 'vuex'

const METADATA = {
  tracked: {
    label: 'tracked',
    color: 'rgba(101, 198, 187, 0.2)',
    fill: true,
    pointRadius: 0,
  },
  BB: {
    label: 'BB',
    color: '#F16B6F',
  },
  FB: {
    label: 'FB',
    color: '#84B1ED',
  },
  RE: {
    label: 'RE',
    color: '#3ac569',
  },
  BS: {
    label: 'BS',
    color: '#FFBC42',
  },
  CB: {
    label: 'CB',
    color: '#414a85',
  },
  MB: {
    label: 'MB',
    color: '#c6419c',
  },
  L1B: {
    label: 'L1B',
    color: '#6d819c',
  },
  L2B: {
    label: 'L2B',
    color: '#aec448',
  },
  L3B: {
    label: 'L3B',
    color: '#D499B9',
  },
  DRAMB: {
    label: 'DRAMB',
    color: '#ffa600',
  },
}

export default {
  components: {
    MultiChart,
  },

  data() {
    return {
      showLabels: ['tracked', 'BB', 'BS', 'RE', 'FB'],
      dataJson: [],
      // zoom: 1,
      metric: Metric.MTSS,
      skipLabels: ['pipeline_w', 'slots', 'time'],
      dDataset: [],

      dPresets: [
        {
          name: 'TMAM_L0',
          value: ['BB', 'BS', 'RE', 'FB'],
        },
        {
          name: 'TMAM_L1',
          value: ['CB', 'MB'],
        },
        {
          name: 'TMAM_L2',
          value: ['L1B', 'L2B', 'L3B', 'DRAMB'],
        },
      ],
      perRowChartValues: [1, 2, 3, 4, 6],
      perRowCharts: 1,
    }
  },

  computed: {
    ...mapGetters({
      gIsLogged: 'auth/gIsLogged',
      gLastProfile: 'data/gLastProfile',
      gAccessToken: 'auth/gAccessToken',
      gIsConnected: 'socket/gIsConnected',
    }),

    cRawDataset() {
      const newData = JSON.parse(JSON.stringify(this.gLastProfile))
      const rawDataset = []

      console.log('this.gLastProfile', this.gLastProfile)

      for (const e of newData) {
        const rawData = new DataAnalyzer(e.data)
        console.log(rawData)
        rawData.preProcess()
        rawDataset.push({ id: e.id, data: rawData })
      }

      return rawDataset
    },

    cDataset() {
      const cDataset = []
      for (const e of this.cRawDataset) {
        cDataset.push({
          id: e.id,
          data: this.processDataset(e.data),
        })
      }

      /* TODO remove */
      // return cDataset.length > 0 ? [cDataset[0]] : []
      return cDataset
    },

    cRange() {
      let min = Number.MAX_SAFE_INTEGER
      let max = Number.MIN_SAFE_INTEGER

      for (const e of this.cRawDataset) {
        const data = e.data.getComputedData()
        if (min > data[0].time) min = data[0].time
        if (max < data[data.length - 1].time) max = data[data.length - 1].time
      }

      return [min, max]
    },
    cLabels() {
      return Object.keys(METADATA)
      // return METADATA.map((m) => m.label)
    },
  },

  watch: {
    dataJson(n, o) {
      this.$backend.postProfile(n)
    },
  },

  methods: {
    // openWebSocket() {
    //   if (!this.gIsLogged) return

    //   const socket = this.$backend.openSocket()
    //   if (!socket) return

    //   socket.on('connect', () => {
    //     console.log('connected')
    //   })

    //   socket.on('connect_error', () => {
    //     // socket.connect()
    //     console.log('connect error')
    //   })

    //   socket.on('disconnect', () => {
    //     console.log('diconnect')
    //   })

    //   socket.on('new_data', (data) => {
    //     this.$store.commit('data/SET_LAST_PROFILE', {
    //       lastProfile: data,
    //     })
    //   })
    // },

    setPreset(preset) {
      if (this.showLabels.includes('tracked'))
        this.showLabels.splice(1, this.showLabels.length)
      else this.showLabels.splice(0, this.showLabels.length)

      for (const p of preset) this.showLabels.push(p)
    },

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
        /* This should be performed by the the textual parser */
        for (const [k, v] of Object.entries(e)) {
          if (k === 'tracked' && v > 0)
            datasets[k].data.push({ y: 1000, x: e.time })
          else if (v === -1) datasets[k].data.push({ y: null, x: e.time })
          else datasets[k].data.push({ y: v > 0 ? v : 0, x: e.time })
        }
      }

      for (const k of Object.keys(datasets)) {
        if (this.skipLabels.includes(k)) continue
        if (!this.showLabels.includes(k)) continue

        datasets[k].borderColor = METADATA[k].color
        datasets[k].backgroundColor = METADATA[k].color
        data.push(datasets[k])
      }

      /* Try to implement highlight as dataset */
      datasets.tracked.fill = true
      datasets.tracked.pointRadius = 0

      return { data }
    },
  },
}
</script>
