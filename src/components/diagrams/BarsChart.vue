<template>
  <div>
    <v-row>
      <v-col cols="12" :sm="horizontal ? 12 : 8">
        <component :is="horizontal ? 'HorBars' : 'Bars'"
          ref="bar"
          style="position:relative;"
          :options="options"
          :chartData="chartData"
          :loading="loading"
          class=""
        />
      </v-col>
      <v-col v-if="!horizontal" cols="12" :sm="horizontal ? 12 : 4">
        <div class="pa-3 rounded-lg shadow shadow-primary">
          <div class="title">Индекс</div>
          <span
            class="text-h5"
            :class="{
              'success--text': indx > 0,
              'error--text': indx <= 0
            }"
          >{{indx > 0 ? '+' : '-'}}{{Math.abs(indx)}}</span> <span>%</span>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Bars from '@/components/charts/Bars.vue'
import HorBars from '@/components/charts/HorBars.vue'

export default {
  components: {
    Bars,
    HorBars
  },
  props: {
    method: Number,
    horizontal: Boolean,
    dataSet: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      loading: false,
      options: {
        aspectRatio: 4 / 3,
        legend: {
          display: false
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    chartData () {
      return {
        labels: (this.dataSet || []).map((el) => el.date),
        datasets: [
          {
            label: 'Porteblenie',
            backgroundColor: this.$vuetify.theme.themes.light.secondary,
            borderColor: this.$vuetify.theme.themes.light.secondary,
            data: (this.dataSet || []).map((el) => el.value),
            type: this.horizontal ? 'horizontalBar' : 'bar'
          }
        ]
      }
    },
    indx () {
      const index = this.dataSet && this.dataSet.length > 0 ? this.dataSet.slice(-1)[0].value / this.dataSet[0].value : 0
      return (Math.round(index * 1000 - 1000) / 10)
    }
  }
}
</script>
