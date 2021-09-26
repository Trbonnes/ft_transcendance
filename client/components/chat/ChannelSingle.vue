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
        <span v-if="isCurrentUserOwner" @click='deleteChannel' class="btn btn-secondary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="times"> </font-awesome-icon> Delete
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
    currentMember()
    {
      return (this.getMembers as any[]).find((m : any) => m.userId === this.$auth.user.id)
    },
    isCurrentUserAdmin()
    {
        if (this.currentMember)
            return (this.currentMember.isAdmin || this.currentMember.user.role === 'admin' || this.currentMember.user.role === 'superAdmin')
        return false
    },
    isCurrentUserOwner()
    {
        return (this.getChannel && this.$auth.user.id === this.getChannel.owner.id)
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
      }
    },
    deleteChannel()
    {
      this.$axios.$delete(`/channel/${this.channelId}/delete`)
      .then((rep : any) => {
        if (rep.status == 201)
        {
          this.$toast.success("Channel deleted")
          this.$store.dispatch("channel/fetchAll")
          this.$emit("back")
        }
        else
          this.$toast.error(rep.message)
       })
      .catch(() => {
        this.$toast.error("Cannot delete channel")
      })
    },
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