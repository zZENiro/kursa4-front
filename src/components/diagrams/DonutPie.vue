<template>
  <div>
    <v-row>
      <v-col cols="6">
        <Donuts
          ref="donuts"
          style="position:relative;"
          :options="options"
          :chartData="chartData"
          :loading="loading"
          class=""
        />
      </v-col>
      <v-col cols="6" class="align-end d-flex">
        <div class="white pa-3 rounded-lg shadow shadow-primary">
          <div v-for="(item, i) in chartData.labels" :key="i" class="d-flex align-center">
            <div class="dot mr-1" :style="{ 'backgroundColor': chartData.datasets[0].backgroundColor[i]}"></div>
            <div class="caption">{{ item }}</div>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import Donuts from '@/components/charts/Donuts.vue'

export default {
  components: {
    Donuts
  },
  props: {
    method: Number
  },
  data () {
    return {
      apiData: [],
      loading: false,
      options: {
        aspectRatio: 1,
        legend: {
          display: false
        }
      }
    }
  },
  computed: {
    chartData () {
      return {
        labels: this.apiData.map((el) => el.date),
        datasets: [
          {
            label: 'Porteblenie',
            backgroundColor: this.apiData.map((el) => el.color),
            data: this.apiData.map((el) => el.value),
            type: 'doughnut'
          }
        ]
      }
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      // load dummy data
      this.apiData = [...Array(3)].map((v, i) => ({
        date: 'Ярославская область',
        value: Math.ceil(Math.random() * 200),
        color: [
          this.$vuetify.theme.themes.light.primary,
          this.$vuetify.theme.themes.light.secondary,
          this.$vuetify.theme.themes.light.error,
          this.$vuetify.theme.themes.light.success
        ][Math.round(Math.random() * 3)]
      }))
    }
  }
}
</script>
<style lang="scss">
  .dot {
    width: 1rem;
    height: 1rem;
    padding: .5rem;
    display: block;
    border-radius: .5rem;
  }
</style>
