<template>
  <div class="pa-3 rounded-lg shadow shadow-primary border-primary bg-white fill-height">
    <v-row>
      <v-col cols="12" sm="auto">
        <v-btn link text color="primary" @click="$emit('update:open', false)">
          <v-icon left>mdi-arrow-left</v-icon>
          Назад
        </v-btn>
      </v-col>
      <v-col>
        <div class="pa-3 rounded-lg shadow shadow-primary border-primary">
          <v-row>
            <v-col cols="12" lg="auto">
              <v-menu
                offset-y
                :return-value.sync="stat"
                ref="statMenu"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                    class="shadow-primary"
                    outlined
                  >
                    {{ stat.title }}
                    <v-icon right>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, index) in availableStats"
                    :key="index"
                    @click="$refs.statMenu.save(item)"
                    :disabled="item.disabled"
                  >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
            <v-col cols="12" md="auto">
              <div class="subtitle">Всего за период:</div>
              <div>
                <span class="text-h3">{{ total }}</span> <span>млн.Квт*час</span>
              </div>
            </v-col>
            <v-col cols="12" md="auto" class="">
              <div class="subtitle">Изменение за период:</div>
              <div class="">
                <span
                  class="text-h3"
                  :class="{
                    'success--text': indx > 0,
                    'error--text': indx <= 0
                  }"
                >{{indx > 0 ? '+' : '-'}}{{Math.abs(indx)}}</span> <span>%</span>
              </div>
            </v-col>
          </v-row>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="8">
        <LineDiagram class="pa-3 rounded-lg shadow shadow-primary border-primary bg-white" />
      </v-col>
      <v-col cols="12" md="4">
        <FilterGroupSelect name="Выбранные показатели" :items="availableFilters" color="primary" v-model="allFilters" />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="title">Регулируемые параметры</div>
        <div class="d-flex">
          <div v-for="(item, i) in customFilters" :key="i" style="min-width:16rem;">
            <v-subheader class="pl-0">
              {{ item.title }}
            </v-subheader>
            <v-slider
              v-model="item.value"
              thumb-label
            ></v-slider>
          </div>
        </div>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    open: Boolean,
    availableFilters: Array
  },
  data () {
    return {
      stat: null,
      availableStats: [
        {
          title: 'Электроэнергия',
          value: 'electroenergy'
        }
      ],
      customFilters: []
    }
  },
  computed: {
    ...mapState(['filters', 'energy']),
    total () {
      return Math.round(this.energy.map((el) => el.value).reduce((a, b) => a + b, 0))
    },
    indx () {
      const index = this.energy && this.energy.length > 0 ? this.energy.slice(-1)[0].value / this.energy[0].value : 0
      return (Math.round(index * 1000 - 1000) / 10)
    },
    allFilters: {
      set (val) {
        //
      },
      get () {
        const filters = []
        for (const key in this.filters) {
          if (!['dateStart', 'dateEnd', 'oes'].includes(key)) {
            const el = this.filters[key]
            filters.push(...el)
          }
        }
        return filters
      }
    }
  },
  watch: {
    allFilters: {
      immediate: true,
      handler () {
        this.customFilters = [...this.allFilters]
      }
    }
  },
  created () {
    this.stat = this.availableStats[0]
  }
}
</script>
