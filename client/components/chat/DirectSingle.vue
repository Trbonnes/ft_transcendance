<template>
    <div class="w-full">
        <span class="block text-center w-full font-bold" v-if="isBlocked">This user is blocked</span>
        <ChatConversation v-if="!isBlocked" :members="getMembers" :messages="getMessages" @sendMessage="sendMessage" />
        <div v-if="!isBlocked" class="w-full">
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
        },
        isBlocked()
        {
          return (this.$auth as any).user.blockedUsers.find((el: any) => this.channel.user.id === el.id) !== undefined
        }
    },
    methods : {
        defyUser()
        {
          if ((this.$auth as any).user.login != this.channel.user.login) {
            this.$router.push(`/game?friendId=${this.channel.user.id}`)
            this.$emit("hide")
          }
          else {
            this.sendMessage("Cannot defy yourself")
          }
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