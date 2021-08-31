<template>
  <div class="flex items-center justify-center">
    <Conversation id="convo" :messages="getMessages" @sendMessage="sendMessage" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  data() {
    return {
      id: this.$route.params.single,
    }
  },
  computed: {
    getMessages()
    {
      let data = this.$store.getters["channel/messages"](this.id)
      console.log("trying to call getter")
      return data
    }
  },
  mounted() {
    console.log("Mounted the single vue")
    try {

      this.$store.dispatch("channel/joinChannel", this.id)
      this.$store.dispatch("channel/getMessages", this.id)
    }
    catch(error)
    {
      // TODO handling error
    } 
  },
  methods: {
    sendMessage(msgContent: string) {
      const dto: CreateMessageDto = {
        channelId: this.id,
        content: msgContent,
      }
      try
      {
        this.$store.dispatch("channel/sendMessage", dto)
      }
      catch
      {
        //TODO error handling
      }

    },
  },
})
</script>

<style>
#convo
{
  min-width: 60vw;
  max-width: 90vw;
  overflow-y: hidden;
}

</style>
