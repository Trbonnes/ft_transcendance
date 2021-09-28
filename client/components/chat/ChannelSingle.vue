<template>
    <div class="bg-white relative">
        <div class="flex flex-row items-center justify-center w-full h-8">
          <span class="font-bold text-2xl">{{getChannel.name}}</span>
        </div>
        <ChatConversation @unknownMember="fetchConvoMembers" :messages="getMessages" :members="getConvoMembers" @sendMessage="sendMessage" />
        <div class="actions">
          <span @click='$emit("next", {comp : "ChatMemberList", props : { channel : getChannel, isCurrentAdmin: isCurrentUserAdmin}})' class="btn btn-primary text-white">
            <font-awesome-icon  icon="users"> </font-awesome-icon> Members
          </span>
          <span v-if="isCurrentUserAdmin" @click='$emit("next", {comp : "ChatUpdateChannel", props : { channel : getChannel}})' class="btn btn-primary text-white">
            <font-awesome-icon  icon="pen"> </font-awesome-icon> Edit
          </span>
          <span v-if="isCurrentUserOwner" @click='deleteChannel' class="btn btn-secondary text-white">
            <font-awesome-icon  icon="times"> </font-awesome-icon> Delete
          </span>
          <span @click='leaveChannel' class="btn text-white">
            <font-awesome-icon  icon="sign-out-alt"> </font-awesome-icon> Leave
          </span>
        </div>
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
    getConvoMembers()
    {
      return this.$store.getters["channel/convoMembers"](this.channelId)
    },
    currentMember()
    {
      return ((this as any).getMembers as any[]).find((m : any) => this.$auth.user && m.userId === this.$auth.user.id)
    },
    isCurrentUserAdmin()
    {
        if ((this as any).currentMember)
            return ((this as any).currentMember.isAdmin || (this as any).currentMember.user.role === 'admin' || (this as any).currentMember.user.role === 'superAdmin')
        return false
    },
    isCurrentUserOwner()
    {
        return ((this as any).getChannel && this.$auth.user && this.$auth.user.id === (this as any).getChannel.owner.id)
    }
  },
  async fetch()
  {
    try {
      await this.$store.dispatch("channel/joinChannel", this.channelId)
      await this.$store.dispatch("channel/fetchOne", this.channelId)
      await this.$store.dispatch("channel/getMessages", this.channelId)
      await this.$store.dispatch("channel/getMembers", this.channelId)
      await this.$store.dispatch("channel/getConvoMembers", this.channelId)
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
    leaveChannel()
    {
      this.$axios.$delete(`/channel/${this.channelId}/leave`)
      .then((rep : any) => {
        if (rep.status == 201)
        {
          this.$toast.success("Channel leaved")
          this.$store.dispatch("channel/fetchAll")
          this.$emit("back")
        }
        else
          this.$toast.error(rep.message)
       })
      .catch(() => {
        this.$toast.error("Cannot leave channel")
      })
    },
    fetchMembers()
    {
      this.$store.dispatch("channel/getMembers", this.channelId)
    },
    fetchConvoMembers()
    {
      this.$store.dispatch("channel/getConvoMembers", this.channelId)
    },
  }
})
</script>
<style>

.actions
{
  @apply flex flex-row justify-center flex-wrap items-center text-2xl;
}
.actions > span
{
  @apply mx-1;
}

.actions > span > *
{
  @apply mx-1.5;
}

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