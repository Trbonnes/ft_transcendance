<template>
  <div class="flex flex-col h-full">
    <div id="chatHeader">
      <a href="#" @click="$emit('exit')" class="btn btn-primary">Go back</a>
    </div>
    <div id="chatMessages" class="flex flex-col">
      <div v-for="c in getMessages">
        {{ c.content }}
      </div>
    </div>
    <div class="flex flex-row">
      <input
        type="text"
        @keyup="listenKey"
        v-model="message"
        class="flex-grow input input-bordered"
      />
      <span @click="sendMessage" class="btn btn-primary">Send</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Channel } from '~/utils/types/channel'

export default Vue.extend({
  props: ['messages'],
  data() {
    return {
      message: '',
    }
  },
  mounted() {},
  computed: {},
  methods: {
    listenKey(e: any) {
      // key code for enter key
      if (e.keyCode == 13) this.sendMessage()
    },
    sendMessage() {
      if (this.message.trim() != '') {
        // sending the even to the parent page
        this.$emit('sendMessage', this.message.trim())
      }
    },
  },
})
</script>

<style>
#chatHeader {
  border: 5px solid red;
  height: 10%;
  width: 100%;
}

#chatMessages {
  border: 5px solid blue;
  height: 70%;
  width: 100%;
}
</style>
