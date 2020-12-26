<template>
  <v-bottom-navigation v-if="show" grow app>
    <v-btn v-for="(item, i) in menu" :key="i" :to="item.link">
      <span>{{ item.text }}</span>
      <v-icon>{{ item.icon }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>
<script>
export default {
  props: {
    menu: Array,
    show: Boolean
  }
}
</script>
