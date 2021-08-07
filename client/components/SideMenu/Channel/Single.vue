<template>
  <div>
    <div></div>
    <a href="#" @click="$emit('exit')" class="btn btn-primary">Go back</a>
    <div>
      <input
        type="text"
        @keyup="checkMessage"
        v-model="message"
        class="input input-bordered"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getSocket } from '~/store/plugins/websocket'
import { ChannelMessageDto } from '~/utils/types/message'

export default Vue.extend({
  props: ['id'],
  data() {
    return {
      message: '',
      socket: null,
    }
  },
  mounted() {
    console.log('Selected ', this.$props.id)
    this.socket = getSocket()
  },
  methods: {
    checkMessage(e: any) {
      if (e.keyCode == 13 && this.message.trim() != '') {
        const dto: ChannelMessageDto = {
          channelId: this.$props.id,
          content: this.message.trim(),
        }
        this.socket.emit('channelMessage', dto)
        this.message = ''
      }
    },
  },
})
</script>

<style></style>
