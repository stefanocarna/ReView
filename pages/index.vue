<template>
  <div class="columns is-multiline p-3 m-0">
    <div class="column is-6">
      <b-field label="Display command">
        <b-button
          v-if="!gIsConnected"
          @click="$store.dispatch('socket/connect')"
        >
          ENABLE Realtime</b-button
        >
        <b-button v-else @click="$store.dispatch('socket/disconnect')">
          STOP Realtime</b-button
        >
        <uploader :value.sync="dataJson" />
      </b-field>

      <b-field label="Profile command">
        <b-button v-if="gActiveProfile.id" @click="deleteProfile">
          Delete Profile
        </b-button>
      </b-field>
    </div>
    <div
      class="
        column
        is-6
        has-text-centered
        is-flex is-flex-direction-column is-align-content-center
      "
    >
      <div
        class="
          block
          is-flex is-align-content-center is-justify-content-space-evenly
        "
      >
        <b-field label="Set charts per row">
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
      <p class="is-size-5 has-text-centered">Filters & Presets</p>
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
    <div class="column is-12 has-text-centered">
      <p>
        Profile machine:
        <span class="has-text-weight-bold">
          {{ gActiveProfile.machine }}
        </span>
      </p>
      <p>
        Profile description:
        <span class="has-text-weight-bold">
          {{ gActiveProfile.description }}</span
        >
      </p>
      <p v-if="gActiveProfile.date">
        Profile date:
        <span class="has-text-weight-bold">
          {{ new Date(gActiveProfile.date).toLocaleString('it-IT') }}</span
        >
      </p>
    </div>
    <div class="column is-12">
      <multi-chart
        :datasets="cDataset"
        :extra="cExtra"
        :range="cRange"
        :per-row="perRowCharts"
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
      showLabels: ['BB', 'BS', 'RE', 'FB'],
      dataJson: [],
      // zoom: 1,
      metric: Metric.MTSS,
      skipLabels: ['pipeline_w', 'slots', 'time', 'tracked'],
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
      gActiveProfile: 'profile/gActiveProfile',
      gAccessToken: 'auth/gAccessToken',
      gIsConnected: 'socket/gIsConnected',
    }),

    cRawDataset() {
      const rawDataset = []

      if (this.gActiveProfile.data) {
        const newData = JSON.parse(JSON.stringify(this.gActiveProfile.data))
        for (const e of newData) {
          const rawData = new DataAnalyzer(e.data)
          rawData.preProcess()
          rawDataset.push({ id: e.id, data: rawData })
        }
      }

      return rawDataset
    },

    cDataset() {
      const cDataset = []
      for (const e of this.cRawDataset) {
        cDataset.push({
          id: e.id,
          data: this.processDataset(e.data),
          highlights: this.processHighlights(e.data),
        })
      }

      /* TODO remove */
      // return cDataset.length > 0 ? [cDataset[0]] : []
      return cDataset
    },

    cExtra() {
      const cExtra = []

      for (const e of this.cRawDataset) {
        cExtra.push({
          id: e.data.getDataByRawMetric('PID'),
          name: e.data.getDataByRawMetric('NAME'),
        })
      }

      return cExtra
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
      this.$store.commit('profile/SET_ACTIVE_PROFILE', {
        data: n,
        date: Date.now(),
      })
    },
  },

  methods: {
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

    processHighlights(d) {
      const data = []
      const compData = d.getComputedData()

      /* Try to collapse subsequent rects */
      for (let i = 0; i < compData.length - 1; ++i) {
        if (compData[i].tracked === 0) continue
        let offSet = i + 1

        while (compData[offSet].tracked && offSet < compData.length - 1)
          offSet++

        data.push({ from: compData[i].time, to: compData[offSet].time })
        i = offSet
      }

      return { data }
    },

    deleteProfile() {
      this.$promodal
        .ask('Delete profileId ' + this.gActiveProfile.id, this)
        .then((res) => {
          this.$store
            .dispatch('profile/delete', this.gActiveProfile.id)
            .then(() => {
              this.$snotify.success('Profile deleted', {
                timeout: 3000,
                showProgressBar: false,
                position: 'rightCenter',
              })
            })
        })
        .catch((err) => {
          console.log('Rejected', err)
        })
    },
  },
}
</script>
