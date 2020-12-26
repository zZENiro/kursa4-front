<template>
  <v-app-bar
    app
    color="white"
    clipped-left
    class="shadow-primary"
  >
    <v-app-bar-nav-icon @click="$emit('update:drawer', !drawer)"></v-app-bar-nav-icon>
    <v-progress-linear :active="loading" :indeterminate="loading" absolute bottom></v-progress-linear>
    <div class="fill-height d-flex align-center mr-4">
    </div>
    <!-- <v-spacer></v-spacer> -->
    <div v-if="show" class="d-flex">
      <v-btn
        :to="item.link"
        v-for="(item, i) in menu"
        :key="i"
        class="mr-3"
        :text="$route.path !== item.link"
        :outlined="$route.path === item.link"
        :color="$route.path === item.link ? 'secondary' : 'dark'"
      >{{ item.text }}</v-btn>
    </div>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    drawer: Boolean,
    menu: Array,
    show: Boolean
  },
  computed: {
    ...mapState(['loading'])
  }
}
</script>
