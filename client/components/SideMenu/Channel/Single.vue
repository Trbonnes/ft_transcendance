<template>
  <div class="flex flex-col h-full">
    <div id="chatHeader">
      <a href="#" @click="$emit('exit')" class="btn btn-primary">Go back</a>
    </div>
    <div id="chatMessages" class="flex flex-col"> 
      <div v-for="c in getMessages">
          {{c.content}}
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
import { getSocket } from '~/store/plugins/websocket'
import { ChannelMessageDto } from '~/utils/types/message'
import { Channel } from '~/utils/types/channel'

let sock = getSocket()

export default Vue.extend({
  props: ['id'],
  data() {
    return {
      message: '',
    }
  },
  mounted() {
    console.log('Selected ', this.$props.id)
    sock = getSocket()
  },
  computed:
  {
    getMessages : function()
    {
      console.log("Let's go updating the results")
      let c = this.$store.getters["channel/getOne"](this.$props.id) as Channel
      console.log(c)
      return c.messages
    }
  },
  methods: {
    listenKey(e: any) {
      if (e.keyCode == 13) // key code for enter key
        this.sendMessage()
    },
    sendMessage()
    {
      if (this.message.trim() != '')
      {
        const dto: ChannelMessageDto = {
          channelId: this.$props.id,
          content: this.message.trim(),
        }
        sock.emit('channelMessage', dto)
        this.message = ''
      }
    }
  },
})
</script>

<style>

#chatHeader
{
  border: 5px solid red;
  height: 10%;    
  width: 100%;
}

#chatMessages
{
  border: 5px solid blue;
  height: 70%;
  width: 100%;
}


</style>
