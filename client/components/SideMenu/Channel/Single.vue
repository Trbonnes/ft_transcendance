<template>
  <div>
    <h1>This is a single vue</h1>
    <a href="#" @click="$emit('exit')" class="btn btn-primary">Go back</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['id'],
  mounted() {
    console.log('Selected ', this.$props.id)
  },
})
</script>

<style></style>
