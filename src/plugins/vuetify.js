import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import ru from 'vuetify/es5/locale/ru'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: '#8094F1',
        secondary: '#43ACD2',
        accent: '#82B1FF',
        error: '#F87C92',
        info: '#2196F3',
        success: '#1DABAD',
        warning: '#E8BE87'
      }
    }
  },
  lang: {
    locales: { ru },
    current: 'ru'
  }
})
