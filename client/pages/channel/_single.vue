<template>
  <div>
    <Conversation :messages="messages" @sendMessage="sendMessage" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types/message'
import { getSocket } from '~/store/plugins/websocket'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  data() {
    return {
      id: this.$route.params.single,
      messages: [] as Message[],
    }
  },
  mounted() {
    const sock = getSocket()
    sock.emit('joinChannel', this.id)
  },
  methods: {
    sendMessage(msgContent: string) {
      const sock = getSocket()
      const dto: CreateMessageDto = {
        channelId: this.id,
        content: msgContent,
      }

      sock.emit('channelMessage', dto)
    },
  },
})
</script>

<style></style>
