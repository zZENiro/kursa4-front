import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    filters: {},
    energy: null,
    loading: false,
    temperatureSmall: null,
    temperature: null,
    covid: null,
    daylight: null
  },
  mutations: {
    SET_FILTERS (state, data) {
      state.filters = data
    },
    SET_ENERGY (state, data) {
      state.energy = data
    },
    SET_LOADING (state, data) {
      state.loading = data
    },
    SET_TEMPERATURE_SMALL (state, data) {
      state.temperatureSmall = data
    },
    SET_TEMPERATURE (state, data) {
      state.temperature = data
    },
    SET_COVID (state, data) {
      state.covid = data
    },
    SET_DAYLIGHT (state, data) {
      state.daylight = data
    }
  },
  actions: {
  },
  modules: {
  }
})
