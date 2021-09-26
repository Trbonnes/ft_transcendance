<template>
    <div class="bg-white relative">
        <div class="flex flex-row items-center justify-center w-full h-8">
          <span class="font-bold text-2xl">{{getChannel.name}}</span>
        </div>
        <ChatConversation :messages="getMessages" @sendMessage="sendMessage" />
        <span @click='$emit("next", {comp : "ChatMemberList", props : { channel : getChannel, isCurrentAdmin: isCurrentUserAdmin}})' class="btn btn-primary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="users"> </font-awesome-icon> Members
        </span>
        <span v-if="isCurrentUserAdmin" @click='$emit("next", {comp : "ChatUpdateChannel", props : { channel : getChannel}})' class="btn btn-primary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="pen"> </font-awesome-icon> Edit
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  props : ['channelId'],
  computed: {
    getChannel()
    {
      const data = this.$store.getters["channel/getOne"](this.channelId)
      if (data)
        return data
      return ""
    },
    getMessages()
    {
      return this.$store.getters["channel/messages"](this.channelId)
    },
    getMembers()
    {
      return this.$store.getters["channel/members"](this.channelId)
    },
    isCurrentUserAdmin()
    {
        let members = this.getMembers
        if (members)
        {
          console.log(members)
          let mem = (this.getMembers as any[]).find((mem : any) => mem.userId === this.$auth.user.id)
          return mem && mem.isAdmin || mem.user.role === 'admin' || mem.user.role === 'superAdmin'
        }
        return false
    }
  },
  async fetch()
  {
    try {
      await this.$store.dispatch("channel/joinChannel", this.channelId)
      await this.$store.dispatch("channel/fetchOne", this.channelId)
      await this.$store.dispatch("channel/getMessages", this.channelId)
      this.$store.dispatch("channel/getMembers", this.channelId) // TODO loading animation ?
    }
    catch(error)
    {
      this.$toast.error("Cannot fetch channel")
    } 
  },
  methods : {
    sendMessage(msgContent: string) {
      const dto: CreateMessageDto = {
        channelId: this.channelId,
        content: msgContent,
      }
      try
      {
        this.$store.dispatch("channel/sendMessage", dto)
      }
      catch
      {
        //TODO error handling
      } },
    fetchMembers()
    {
      this.$store.dispatch("channel/getMembers", this.channelId) // TODO loading animation ?
    },
  }
})
</script>
<style>

#memberList {
  top: 0;
  left: 100%;
  transition: all .2s;
  @apply w-full h-full absolute bg-white;
}

#memberList.show
{
  left: 0%;
}
  
</style>