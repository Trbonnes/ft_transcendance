<template>
  <div class="flex flex-col items-center h-full w-full bg-gray-100">
    <div class="w-full">
      <div v-for="c in channels" class="card text-black font-bold my-1">
        <div @click="$emit('select', c.id)" class="card-body bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer w-full flex flex-row items-center justify-between">
          <font-awesome-icon title="You're the owner of the channel" v-if='c.owner == $auth.user.id' class="text-black" icon="crown"></font-awesome-icon>
          <h1>{{c.name}}</h1> <!-- TODO not pretty -->
          <font-awesome-icon title="You're the owner of the channel" v-if='c.isPublic' icon="hashtag"></font-awesome-icon>
          <font-awesome-icon title="You're the owner of the channel" v-else icon="lock"></font-awesome-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props : ['channels'],
})
</script>

<style>
</style>
