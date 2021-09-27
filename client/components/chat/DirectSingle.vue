<template>
    <div class="w-full">
        <ChatConversation :messages="getMessages" @sendMessage="sendMessage" />
        <div class="w-full">
          <span @click="defyUser" class="btn m-1">
              Defy
          </span>

        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props : ["userId", "channelId"],
    async fetch() {
        await this.$store.dispatch('directChannel/history', this.channelId)
    },
    computed : {
        getMessages()
        {
          let data = this.$store.getters["directChannel/messages"](this.channelId)
          console.log('Here are the message ', data)
          return data
        },
    },
    methods : {
        defyUser()
        {
          this.$router.push(`/game?friendId=${this.userId}`)
          this.$emit("hide")
        },
        async sendMessage(content : string)
        {
          try
          {
            let data = await this.$store.dispatch('directChannel/sendMessage',  { userId : this.userId, content : content })
          }
          catch(error : any)
          {
            this.$toast.error("Cannot message history")
          }
        }, 
    }
})
</script>