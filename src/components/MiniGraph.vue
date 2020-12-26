<template>
  <div class="pa-3 rounded-lg shadow shadow-primary border-primary bg-white mb-6">
    <div class="d-flex">
      <div class="flex-grow-1">
        <div class="title">{{title}}</div>
        <div class="caption secondary--text">{{subtitle}}</div>
      </div>
      <v-select
        :items="items"
        class="flex-grow-0 secondary--text"
        color="secondary"
        outlined
        dense
        label="Территории"
      ></v-select>
    </div>
    <component :is="graphType" :horizontal="horizontal" :dataSet="dataSet" />
  </div>
</template>
<script>
import BarsChart from '@/components/diagrams/BarsChart.vue'
import DonutPie from '@/components/diagrams/DonutPie.vue'

export default {
  props: {
    type: String,
    dataSet: Array,
    title: String,
    subtitle: String,
    value: Array,
    items: Array
  },
  components: {
    DonutPie,
    BarsChart
  },
  computed: {
    graphType () {
      let type = 'BarsChart'
      switch (this.type) {
        case 'bars':
        case 'horizontal-bars':
          type = 'BarsChart'
          break
        case 'donut':
          type = 'DonutPie'
          break
        default:
          break
      }
      return type
    },
    horizontal () {
      return this.type === 'horizontal-bars'
    }
  }
}
</script>
