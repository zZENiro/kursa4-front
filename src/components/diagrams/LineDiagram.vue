<template>
  <div>
    <v-row>
      <v-col cols="12" sm="8" lg="9">
        <Lines
          ref="line"
          style="position:relative;"
          :options="options"
          :chartData="chartData"
          :loading="loading"
          class=""
        />
      </v-col>
      <v-col cols="12" sm="4" lg="3" class="d-flex flex-column justify-start">
        <div class="title">Показать/скрыть</div>
        <v-switch
          v-model="covidEnabled"
          label="COVID"
          hide-details="auto"
        ></v-switch>
        <v-switch
          value="mounth"
          v-model="step"
          hide-details="auto"
          label="Детализация день / месяц"
        ></v-switch>
        <v-checkbox
          v-for="(item, i) in chartData.datasets.filter((el) => el.name !== 'today')" :key="i"
          :label="item.label"
          :value="item.name"
          v-model="showedDatasets"
          hide-details="auto"
        ></v-checkbox>
        <v-btn v-if="edit" color="primary" class="mt-4" outlined @click="customize = !customize">
          <v-icon
            left
            dark
          >
            mdi-tune
          </v-icon>
          Изменить
        </v-btn>
      </v-col>
    </v-row>
    <v-dialog
      v-model="customize"
      :width="'100%'"
      :fullscreen="$vuetify.breakpoint.smAndDown"
      scrollable
    >
      <Customize :open.sync="customize" />
    </v-dialog>
  </div>
</template>
<script>
import Lines from '@/components/charts/Lines.vue'
import Customize from '@/components/Customize.vue'
import { mapState } from 'vuex'

export default {
  components: {
    Lines,
    Customize
  },
  props: {
    method: Number,
    edit: Boolean
  },
  data () {
    return {
      energyPath: '/api/data/getprediction',
      temperaturePath: '/api/data/GetWeather',
      covidPath: '/api/data/GetCovid',
      daylightPath: '/api/data/GetDaylight',
      apiData: [],
      loading: false,
      options: {
        aspectRatio: 16 / 9,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              },
              offset: false,
              id: 0
            }
          ],
          yAxes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => ({
            display: i === 0,
            id: i
          }))
        }
      },
      customize: false,
      availableDatasets: {
        energy: 'Энергопотребление',
        temperature: 'Температура',
        covid: 'COVID',
        daylight: 'Продолж. светов. ночи'
      },
      colorDatasets: {
        energy: this.$vuetify.theme.themes.light.primary,
        temperature: this.$vuetify.theme.themes.light.success,
        covid: this.$vuetify.theme.themes.light.error,
        daylight: this.$vuetify.theme.themes.light.warning
      },
      showedDatasets: [],
      step: null,
      covidEnabled: true
    }
  },
  computed: {
    ...mapState(['filters', 'energy', 'temperature', 'covid', 'daylight']),
    selectedGraphics () {
      let filters = []
      for (const key in this.filters) {
        if (!['dateStart', 'dateEnd', 'oes'].includes(key)) {
          const el = this.filters[key]
          filters.push(...el)
        }
      }
      filters = filters.map((el) => el.name)
      filters = filters.filter((el) => Object.keys(this.availableDatasets).includes(el))
      filters.push('energy')
      return filters
    },
    chartData () {
      const data = this.selectedGraphics.filter((el) => {
        return !!this[el]
      }).map((el, i) => ({
        label: this.availableDatasets[el],
        name: el,
        backgroundColor: 'transparent',
        borderColor: this.colorDatasets[el],
        // pointBorderColor: 'transparent',
        data: (this[el] || []).map((e) => e.value),
        type: 'line',
        showLine: this.showedDatasets.includes(el),
        yAxisID: i
      }))
      return {
        labels: (this.energy || []).map((el) => el.date),
        datasets: [
          ...data,
          {
            label: 'Сегодня',
            name: 'today',
            backgroundColor: this.$vuetify.theme.themes.light.secondary,
            borderColor: this.$vuetify.theme.themes.light.secondary,
            // pointBorderColor: 'transparent',
            data: (this.energy || []).map((el) => {
              const max = Math.max(...this.energy.map((el) => el.value))
              let val = null
              if (this.$moment(el.date).format('DD-MM-YYYY') === this.$moment().format('DD-MM-YYYY')) val = max
              return val
            }),
            barThickness: 3,
            type: 'bar'
          }
        ]
      }
    }
  },
  watch: {
    'filters.dateStart': {
      handler (val) {
        this.calcStep()
        this.updData()
      }
    },
    'filters.dateEnd': {
      handler (val) {
        this.calcStep()
        this.updData()
      }
    },
    step: {
      handler () {
        this.updData()
      }
    },
    covidEnabled: {
      handler () {
        this.updData()
      }
    },
    selectedGraphics: {
      handler (val, old) {
        const type = this.$lodash.difference(val, old)[0]
        if (type) this.getData(type)
      }
    }
  },
  created () {
    this.updData()
  },
  methods: {
    setShowedFilters () {
      this.selectedGraphics.forEach(type => {
        !this.showedDatasets.includes(type) && this.showedDatasets.push(type)
      })
    },
    updData () {
      this.selectedGraphics.forEach(type => {
        this.getData(type)
      })
    },
    updOptions () {
      const max = Math.max(
        ...(this.energy || []).map((el) => el.value),
        ...(this.temperature || []).map((el) => el.value)
      )
      this.options = {
        ...this.options,
        scales: {
          ...this.options.scales,
          yAxes: [
            {
              ticks: {
                // min,
                max
              }
            }
          ]
        }
      }
    },
    async getData (type) {
      let data = []
      let path = ''
      let commit = ''

      switch (type) {
        case 'energy':
          path = this.energyPath
          commit = 'SET_ENERGY'
          break
        case 'temperature':
          path = this.temperaturePath
          commit = 'SET_TEMPERATURE'
          break
        case 'covid':
          path = this.covidPath
          commit = 'SET_COVID'
          break
        case 'daylight':
          path = this.daylightPath
          commit = 'SET_DAYLIGHT'
          break
        default:
          break
      }
      const url = 'http://localhost:5000' + path
      const params = {
        startDate: this.filters.dateStart,
        endDate: this.filters.dateEnd,
        step: this.step,
        covidEnabled: this.covidEnabled
      }
      const res = await this.$axios.get(url, { params })
      console.log(res)

      try {
        data = res.data.x.map((x, i) => ({
          date: x,
          value: res.data.y[i]
        }))
        this.setShowedFilters()
        // setTimeout(() => {
        //   this.updOptions()
        // }, 1000)
      } catch (error) {
        console.log(error)
      }

      // store data
      this.$store.commit(commit, data)
    },
    calcStep () {
      let step = null
      if (this.filters.dateStart && this.filters.dateEnd) {
        if (Math.abs(this.$moment(this.filters.dateStart).diff(this.$moment(this.filters.dateEnd), 'months')) > 11) {
          step = 'mounth'
        }
      }
      this.step = step
      return step
    }
  }
}
</script>
