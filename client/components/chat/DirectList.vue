
<template>
  <div class=" w-full flex flex-row items-start">
      <div class=" w-full card text-black font-bold">
        <div
        class="card-body bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer w-full flex flex-row items-center justify-between"
        v-for="channel in channels" @click="$emit('joinChannel', channel)"
        v-bind:key="channel.id"
          >
          <img class="w-16 h-16 rounded-full border-8 border-white shadow-lg" :src="channel.user.avatar" :alt="channel.user.displayName">
          <span>{{channel.user.displayName}}</span>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ["channels"],
  mounted()
  {
    // console.log(this.channels)
  }
})
</script>

<style>

</style>
