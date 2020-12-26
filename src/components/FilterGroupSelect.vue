<template>
  <div
    class="pa-3 rounded-lg shadow-primary bg-white"
    :class="{[`border-${color}`]: true}"
  >
    <v-select
      :items="items"
      :label="name"
      multiple
      v-model="selected"
      return-object
      item-text="title"
      outlined
      dense
      :item-color="color"
      hide-details="auto"
    >
      <template v-slot:selection="{ index }">
        <span v-if="index === 0" >Выбрано: {{ selected.length }}</span>
      </template>
    </v-select>
    <v-chip-group
      column
    >
      <v-chip
        v-for="(v, ii) in selected"
        :key="ii"
        label
        close
        @click:close="() => selected = selected.filter((el) => el !== v)"
        :color="color"
      >
        {{ v.title }}
      </v-chip>
    </v-chip-group>
  </div>
</template>
<script>
export default {
  props: {
    name: String,
    value: Array,
    items: Array,
    color: String
  },
  computed: {
    selected: {
      set (val) {
        this.$emit('input', val)
      },
      get () {
        return this.value
      }
    }
  },
  methods: {
    del (el) {
      console.log(el)
    }
  }
}
</script>
