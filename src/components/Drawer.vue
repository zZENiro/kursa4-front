<template>
  <v-navigation-drawer
    :value="drawer"
    @input="(val) => $emit('update:drawer', val)"
    :mobile-breakpoint="0"
    :temporary="this.$vuetify.breakpoint.xs"
    clipped
    app
    touchless
    :width="$vuetify.breakpoint.smAndUp ? 300 : 256"
  >
  </v-navigation-drawer>
</template>
<script>
export default {
  props: {
    drawer: Boolean
  },
  mounted () {
    console.log(this.$vuetify.breakpoint.xs)
  }
}
</script>
