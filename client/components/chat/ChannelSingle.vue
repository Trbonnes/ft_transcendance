<template>
    <div class="bg-white relative">
        <ChatConversation :messages="getMessages" @sendMessage="sendMessage" />
        <span @click='$emit("next", {comp : "ChatMemberList", props : { channel : getChannel}})' class="btn btn-primary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="users"> </font-awesome-icon> Members
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types'
import { getSocket } from '~/store/plugins/websocket'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  props : ['channelId'],
  created()
  {
    let sock = getSocket()
    let exitChannel = (channelId : string) => {
      if (this.channelId == channelId)
          this.$emit('back')
    }
    if (sock.connected)
    {
      sock.on("channel/banned", exitChannel)
      sock.on("channel/destroyed", exitChannel)
    }
    // (this as any).timer = setInterval(() => {this.dateNow = new Date}, 1000)
  },
  destroyed()
  {
    let sock = getSocket()
    sock.off("channel/banned")
    sock.off("channel/destroyed")
    // clearInterval((this as any).timer)
  },
  computed: {
    getChannel()
    {
      const data = this.$store.getters["channel/getOne"](this.channelId)
      console.log("Get Channel`", data)
      if (data)
        return data
      return ""
    },
    getMessages()
    {
      let data = this.$store.getters["channel/messages"](this.channelId)
      console.log("Get Messages`", data)
      return data
    },
    getMembers()
    {
      let data = this.$store.getters["channel/members"](this.channelId)
      console.log("Get Members`", data)
      return data
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
//     },
//   methods: {
//     initForm()
//     {
//       this.channelName = this.getChannel.name
//       this.isPrivate = !this.getChannel.isPublic
//     },
//     deleteChannel(event : any)
//     {
//       event.preventDefault()
//       this.$axios.$delete(`/channel/${this.getChannel.id}/delete`)
//       .then((rep : any) => {
//         if (rep.status == 201)
//         {
//           this.$toast.success("Channel deleted")
//           this.$store.dispatch("channel/fetchAll")
//           this.$router.push("/channel")
//         }
//         else
//           this.$toast.error(rep.message)
//        })
//       .catch(() => {
//         this.$toast.error("Cannot delete channel")
//        })
//     },
//     updateChannel(event : any)
//     {
//       event.preventDefault()
//       if (this.channelName == "")
//         this.$toast.error("Name cannot be empty")
//       else
//       {
//         this.$store.dispatch("channel/update", { channelId : this.getChannel.id, channelName : this.channelName, isPrivate : this.isPrivate, password : this.channelPassword })  
//         .then((rep : any) => {
//           if (rep.data.status && rep.status != 201)
//           {
//             this.$toast.error(rep.message)
//           }
//           else
//           {
//             this.$toast.success("Channel updated")
//             this.$router.back()
//             this.$store.commit("channel/updateChannel", rep.data)
//           }
//          })
//         .catch(() => {
//           this.$toast.error("Cannot update channel")
//         })
//       }
//     },
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