<template>
  <div>
    This is the channel with id : {{ channelId }}
    <Conversation
      messages="['this is a message', 'this is another', 'let's go]"
    />
  </div>
</template>

<script lang="ts">
import { CreateMessageDto } from '~/utils/types/message'
import { getSocket } from '~/store/plugins/websocket'
import Vue from 'vue'

sock = getSocket()

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  props: ['channelId'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    sendMessage() {
      const dto: ChannelMessageDto = {
        channelId: this.$props.id,
        content: this.message.trim(),
      }
      sock.emit('channelMessage', dto)
    },
  },
})
</script>

<style></style>
