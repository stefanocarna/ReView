class Metric {
  static MTSS = {}

  constructor(name, evts, mtss, evalFunc) {
    this.name = name
    this.eval = evalFunc
    this.evts = evts
    this.mtss = []

    for (const m of mtss) this.mtss.push(Metric.MTSS[m])
  }

  check(evts) {
    for (const e of this.evts) {
      if (!evts.includes(e)) return false
    }

    for (const m of this.mtss) {
      if (!m.check(evts)) return false
    }

    return true
  }

  static build(name, evts, mtss, evalFunc) {
    Metric.MTSS[name] = new Metric(name, evts, mtss, evalFunc)
  }
}

class DataAnalyzer {
  constructor(rawData) {
    this.rawData = rawData
    this.processed = false
    this.availableMetrics = []
    this.eventsIndex = {}
    this.computedData = null
  }

  preProcess() {
    for (const k of Object.keys(Metric.MTSS)) {
      const m = Metric.MTSS[k]
      if (m.check(this.rawData.columns)) this.availableMetrics.push(m)
    }

    for (let i = 0; i < this.rawData.columns.length; ++i) {
      this.eventsIndex[this.rawData.columns[i]] = i
    }

    this.processed = true
  }

  compute(i) {
    const result = {}
    for (const m of this.availableMetrics) {
      result[m.name] = m.eval(this.rawData.data[i], this.eventsIndex)
    }

    return result
  }

  computeAll() {
    if (!this.processed) this.preProcess()

    this.computedData = []
    for (const i of this.rawData.index) {
      this.computedData.push(this.compute(i))
    }

    const minTime = this.computedData[0].time
    /* Normalize time */
    for (const i in this.computedData) {
      // this.computedData[i].time -= minTime
      this.computedData[i].time = Math.round(
        this.computedData[i].time - minTime
      )
    }
  }

  getDataByRawMetric(m) {
    const data = []

    const metricIndex = this.rawData.columns.indexOf(m)

    if (metricIndex >= 0) {
      for (const e of this.rawData.data) {
        data.push(e[metricIndex])
      }
    }

    return data
  }

  getAvailableMetrics() {
    if (!this.processed) this.preProcess()
    return this.availableMetrics
  }

  getComputedData() {
    if (this.computedData === null) this.computeAll()
    return this.computedData
  }
}

// const PIPELINE_WIDTH = 4

Metric.build('time', ['TSC'], [], function (data, eP) {
  return data[eP[this.evts[0]]]
})

const MASK_HEADER_FULL = [
  'BB',
  'BS',
  'RE',
  'FB',
  'MB',
  'CB',
  'L1B',
  'L2B',
  'L3B',
  'DRAMB',
]

for (const i of MASK_HEADER_FULL) {
  Metric.build(i, [i], [], function (data, eP) {
    return data[eP[this.evts[0]]]
  })
}

/* TODO - Restore for raw events and TMA in-place computation */
// Metric.build('pipeline_w', [], [], (data, eP) => PIPELINE_WIDTH)

// Metric.build('time', ['TIME'], [], function (data, eP) {
//   return data[eP[this.evts[0]]]
// })

// Metric.build('slots', ['CYCLES'], ['pipeline_w'], function (data, eP) {
//   return this.mtss[0].eval(data, eP) * data[eP[this.evts[0]]]
// })

// Metric.build('retire', ['2c2'], ['slots'], function (data, eP) {
//   return data[eP[this.evts[0]]] / (this.mtss[0].eval(data, eP) + 1)
// })

// Metric.build('frontend', ['19c'], ['slots'], function (data, eP) {
//   return data[eP[this.evts[0]]] / (this.mtss[0].eval(data, eP) + 1)
// })

// Metric.build(
//   'bad_spec',
//   ['10e', '2c2', '10d'],
//   ['pipeline_w', 'slots'],
//   function (data, eP) {
//     return (
//       (data[eP[this.evts[0]]] -
//         data[eP[this.evts[1]]] +
//         this.mtss[0].eval(data, eP) * data[eP[this.evts[2]]]) /
//       (this.mtss[1].eval(data, eP) + 1)
//     )
//   }
// )

// Metric.build(
//   'backend',
//   [],
//   ['bad_spec', 'frontend', 'retire'],
//   function (data, eP) {
//     return (
//       1 -
//       this.mtss[0].eval(data, eP) -
//       this.mtss[1].eval(data, eP) -
//       this.mtss[2].eval(data, eP)
//     )
//   }
// )

export default DataAnalyzer
export { Metric, DataAnalyzer }
