<template>
  <div class="container">
    <div>
      <h1 class="title">transcendence game</h1>
      <div class="links">
        <NuxtLink to="/game" class="button--green"> Game</NuxtLink>
        <div class="flex flex-col p-5">
          <input v-model="message" type="text" class="w-40 shadow-xl" />
          <span>Going to connect as {{ message }}</span>
          <button class="block w-40" @click="submitName">Connect</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      message: 'john@doe',
    }
  },
  methods: {
    submitName() {
      console.log('Submitting name : ' + this.message)
      this.$store.dispatch('loadChat')
      this.$store.dispatch('chat/init')
      console.log('ok boomer')
      console.log(this.$nuxtSocket)
    },
  },
})
</script>

<style></style>
