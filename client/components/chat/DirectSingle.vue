<template>
    <div class="w-full">
        <ChatConversation :members="getMembers" :messages="getMessages" @sendMessage="sendMessage" />
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
    props : ["channel"],
    async fetch() {
        if(this.channel)
          await this.$store.dispatch('directChannel/history', this.channel.id)
    },
    computed : {
        getMessages()
        {
          let data : any[] = []
          if (this.channel)
            data = this.$store.getters["directChannel/messages"](this.channel.id)
          return data
        },
        getMembers()
        {
          if (this.$auth.user)
          {
            if (this.channel)
              return [ this.channel.user , this.$auth.user ]
            return [ this.$auth.user ]
          }
          return []
        }
    },
    methods : {
        defyUser()
        {
          this.$router.push(`/game?friendId=${this.channel.user.id}`)
          this.$emit("hide")
        },
        async sendMessage(content : string)
        {
          try
          {
            let data = await this.$store.dispatch('directChannel/sendMessage',  { userId : this.channel.user.id, content : content })
          }
          catch(error : any)
          {
            this.$toast.error("Cannot message history")
          }
        }, 
    }
})
</script>