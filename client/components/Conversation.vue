<template>
  <div class="flex flex-col h-full" >
    <div id="convo" class="flex flex-col">
      <div v-for="c in messages" 
            class="p-3 m-0.5 rounded-xl inline-block"
            v-bind:class="[$auth.user.id === c.senderId ? 'text-white bg-blue-500 self-end' : ' text-black bg-gray-300 self-start']"
      >
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
  updated() {
    var container = this.$el.querySelector("#convo");
    container.scrollTop = container.scrollHeight;
  },
  mounted() {
  },
  computed: {},
  methods: {
    listenKey(e: any) {
      // key code for enter key
      if (e.keyCode === 13) this.sendMessage()
    },
    sendMessage() {
      if (this.message.trim() !== '') {
        // sending the even to the parent page
        this.$emit('sendMessage', this.message.trim())
        this.message = ''
      }
    },
  },
})
</script>

<style>

#convo {
  height: 70vh;
  width: 100%;
  overflow-y: scroll;
}
</style>
