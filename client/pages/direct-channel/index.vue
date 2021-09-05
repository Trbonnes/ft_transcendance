<template>
  <div>
    <h1>List of private conversations</h1>
    <div v-for="c in getAll">
      {{c.id}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  fetch() {
    this.$store.dispatch('directChannel/fetchAll')     
  },
  computed : {
    getAll(){
      console.log(this.$store.getters)
      return this.$store.getters["directChannel/all"]
    }
  },
  methods : {
    selectOne(id : string){

    }
  }
})
</script>

<style>

</style>
