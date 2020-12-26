<template>
  <div class="main-bg fill-height">
    <v-container>
      <v-row>
        <v-col cols="12" md="auto">
          <v-menu
            offset-y
            :return-value.sync="filters.oes"
            ref="oesMenu"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                dark
                v-bind="attrs"
                v-on="on"
                class="shadow-primary"
                :x-large="$vuetify.breakpoint.smAndUp"
              >
                {{ filters.oes && filters.oes.title }}
                <v-icon right>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in availableOes"
                :key="index"
                @click="$refs.oesMenu.save(item)"
                :disabled="item.disabled"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer class="d-none d-md-block"></v-spacer>
        <v-col>
          <v-menu
            offset-y
            ref="dateStartMenu"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="$moment(filters.dateStart).format('DD MMM YYYY')"
                label="Начало периода"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                hide-details="auto"
                :dense="$vuetify.breakpoint.smAndDown"
                v-bind="attrs"
                v-on="on"
                class="white shadow-primary"
              ></v-text-field>
            </template>
            <v-date-picker v-model="filters.dateStart"></v-date-picker>
          </v-menu>
        </v-col>
        <v-col>
          <v-menu
            offset-y
            ref="dateEndMenu"
            :close-on-content-click="false"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                :value="$moment(filters.dateEnd).format('DD MMM YYYY')"
                label="Конец периода"
                prepend-inner-icon="mdi-calendar"
                readonly
                outlined
                class="white shadow-primary"
                :dense="$vuetify.breakpoint.smAndDown"
                hide-details="auto"
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="filters.dateEnd"></v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12" md="4">
              <FilterGroupSelect
                name="Отрасли"
                :items="availableIndustries"
                color="primary"
                :value="filters.industries"
                @input="(v) => $store.commit('SET_FILTERS', {...filters, industries: v})"
              />
            </v-col>
            <v-col cols="12" md="4">
              <FilterGroupSelect
                name="Экономические показатели"
                :items="availableEconomics"
                color="secondary"
                :value="filters.economics"
                @input="(v) => $store.commit('SET_FILTERS', {...filters, economics: v})"
              />
            </v-col>
            <v-col cols="12" md="4">
              <FilterGroupSelect
                name="Неэкономические показатели"
                :items="availableFeatures"
                color="warning"
                :value="filters.features"
                @input="(v) => $store.commit('SET_FILTERS', {...filters, features: v})"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <LineDiagram class="pa-3 rounded-lg shadow shadow-primary border-primary bg-white" :edit="true" />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="3">
          <div class="text-h4 font-weight-bold mb-6">
            Сегодня
            <div class="primary--text">{{ $moment().format('DD MMMM YYYY') }}</div>
          </div>
          <div v-for="(item, i) in Array(2)" :key="i" class="pa-3 rounded-lg shadow shadow-primary bg-white mb-6">
            <div class="title text-truncate">Возможно веерное отключение электроэнергии</div>
            <p>Был замечен рост продаж обогревательных элементов. Ожидается повышение нагрузки...</p>
            <div class="d-flex justify-space-between">
              <v-chip label color="white" link class="shadow-primary">
                <v-icon left>
                  mdi-map-marker
                </v-icon>
                Пермь
              </v-chip>
              <v-btn to="#" outlined color="primary">Подробнее</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
      <div class="text-h4 font-weight-bold mt-6 mb-3">Экономические показатели</div>
      <v-row>
        <v-col>
          <MiniGraph
            type="bars"
            title="Температура воздуха"
            subtitle="в регионе"
            :dataSet=temperatureSmall
          />
        </v-col>
        <v-col>
          <MiniGraph type="bars" />
        </v-col>
        <v-col>
          <MiniGraph
            type="horizontal-bars"
            title="Коэффициенты корелляции"
            subtitle="факторы для прогноза"
            :dataSet="Object.entries(corellation).map(([date, value]) => ({ date: mapFeat[date], value })).sort((a, b) => b.value - a.value)"
          />
        </v-col>
      </v-row>
      <div class="text-h4 font-weight-bold mt-6 mb-3">Неэкономические показатели</div>
      <v-row>
        <v-col>
          <MiniGraph type="bars" />
        </v-col>
        <v-col>
          <MiniGraph type="bars" />
        </v-col>
        <v-col>
          <MiniGraph type="horizontal-bars" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import MiniGraph from '@/components/MiniGraph.vue'
import { mapState } from 'vuex'

export default {
  components: {
    MiniGraph
  },
  data () {
    return {
      tempApi: 'http://localhost:5000/api/data/GetWeather',
      //
      availableOes: [
        {
          title: 'ОЭС Урала',
          value: 'ural',
          disabled: false
        },
        {
          title: 'ОЭС Юга',
          value: 'south',
          disabled: true
        },
        {
          title: 'ОЭС Востока',
          value: 'east',
          disabled: true
        },
        {
          title: 'ОЭС Центра',
          value: 'center',
          disabled: true
        },
        {
          title: 'ОЭС Северо-Запада',
          value: 'nord-west',
          disabled: true
        },
        {
          title: 'ОЭС Сибири',
          value: 'sibir',
          disabled: true
        },
        {
          title: 'ОЭС Средней Волги',
          value: 'mid-volga',
          disabled: true
        }
      ],
      availableIndustries: [
        {
          title: 'Нефтедобыча',
          color: 'green',
          name: 'neft'
        },
        {
          title: 'Металлургия',
          color: 'green',
          name: 'metallurgy'
        }
      ],
      availableEconomics: [
        {
          title: 'Инвестиции',
          color: 'investment',
          name: 'investment'
        },
        {
          title: 'ВРП',
          color: 'vrp',
          name: 'vrp'
        }
      ],
      availableFeatures: [
        {
          title: 'Продолж. светов. ночи.',
          color: 'luminous',
          name: 'daylight'
        },
        {
          title: 'Температура',
          color: 'temperature',
          name: 'temperature'
        },
        {
          title: 'COVID',
          color: 'red',
          name: 'covid'
        }
      ],
      corellation: {
        temp: 1.0,
        foodprice: 0.0060233219967535745,
        sale: 0.0013977712738945324,
        night_minutes: 0.8904449120968831,
        covid: 0.09484649644344838,
        holidays: 0.034676430122137655,
        salary_arrears: 0.017900551935658086
      },
      mapFeat: {
        temp: 'Температура',
        foodprice: 'ИПЦ',
        sale: 'Розничные продажи',
        night_minutes: 'Продолж. темн. вр.сут.',
        covid: 'Режим смоизоляции',
        holidays: 'Празд и вых. дни',
        salary_arrears: 'Задолженность по з.п.'
      }
    }
  },
  computed: {
    ...mapState(['temperatureSmall', 'filters']),
    filters: {
      set (val) {
        this.$store.commit('SET_FILTERS', val)
      },
      get () {
        return this.$store.state.filters
      }
    }
  },
  watch: {
    'filters.dateStart': {
      handler (val) {
        this.updData()
      }
    },
    'filters.dateEnd': {
      handler (val) {
        this.updData()
      }
    }
    // step: {
    //   handler () {
    //     this.updData()
    //   }
    // },
    // covidEnabled: {
    //   handler () {
    //     this.updData()
    //   }
    // }
  },
  created () {
    // initial filters
    if (!this.filters.oes?.value) this.$set(this.filters, 'oes', this.availableOes[0])

    // dates
    if (!this.filters.dateEnd) this.$set(this.filters, 'dateEnd', this.$moment().format('YYYY-MM-DD'))
    if (!this.filters.dateStart) this.$set(this.filters, 'dateStart', this.$moment().subtract(1, 'M').format('YYYY-MM-DD'))

    // call apis for small graphics
    this.updData()
  },
  methods: {
    updData () {
      this.callApi('temperature')
    },
    async callApi (type) {
      let path = ''
      let commit = ''
      let data = null
      switch (type) {
        case 'temperature':
          path = this.tempApi
          commit = 'SET_TEMPERATURE_SMALL'
          break
        default:
          break
      }
      const url = 'http://localhost:5000' + path
      const params = {
        startDate: this.filters.dateStart,
        endDate: this.filters.dateEnd,
        step: 'mounth'
      }
      const res = await this.$axios.get(url, { params })
      console.log(res)

      try {
        data = res.data.x.map((x, i) => ({
          date: x,
          value: res.data.y[i]
        }))
      } catch (error) {
        console.log(error)
      }

      this.$store.commit(commit, data)
    }
  }
}
</script>
