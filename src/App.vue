<template>
  <v-app>
    <AppBar :show="!$vuetify.breakpoint.mobile" :drawer.sync="drawer" :menu="menu" />
    <Drawer :drawer.sync="drawer" />
    <BottomBar :show="$vuetify.breakpoint.mobile" :menu="menu" />
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </v-main>
  </v-app>
</template>
<script>
import Drawer from '@/components/Drawer.vue'
import AppBar from '@/components/AppBar.vue'
import BottomBar from '@/components/BottomBar.vue'

export default {
  components: {
    Drawer,
    AppBar,
    BottomBar
  },
  data () {
    return {
      drawer: false, /* this.$vuetify.breakpoint.smAndUp */
      menu: [
        {
          text: 'Статистика',
          link: '/',
          icon: 'mdi-trending-up'
        },
        {
          text: 'Документы',
          link: '#',
          icon: 'mdi-file-document-outline'
        },
        {
          text: 'Аккаунт',
          link: '#',
          icon: 'mdi-account'
        }
      ]
    }
  }
}
</script>
