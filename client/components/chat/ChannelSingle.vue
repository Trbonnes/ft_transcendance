<template>
    <div>
        <GoBackChat @click="this.$emit('back')" />
        
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types'
import { getSocket } from '~/store/plugins/websocket'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  data() {
    return {
      id: this.$route.params.single, channelName: '' as string, isPrivate: false as boolean,
      channelPassword: '' as string,
      dateNow : new Date()
    }
  },
  created()
  {
    let sock = getSocket()
    let exitChannel = (channelId : string) => {
      console.log(this.id, channelId)
      if (this.id == channelId)
      {
        this.$toast.info("You've lost access to the channel")
        this.$router.push("/channel")
      }
    }
    if (sock.connected)
    {
      sock.on("channel/banned", exitChannel)
      sock.on("channel/destroyed", exitChannel)
    }
    (this as any).timer = setInterval(() => {this.dateNow = new Date}, 1000)
  },
  destroyed()
  {
    let sock = getSocket()
    sock.off("channel/banned")
    sock.off("channel/destroyed")
    clearInterval((this as any).timer)
  },
  computed: {
    getChannel()
    {
      const data = this.$store.getters["channel/getOne"]((this as any).id)
      console.log("Get Channel`", data)
      if (data)
        return data
      return ""
    },
    getMessages()
    {
      let data = this.$store.getters["channel/messages"]((this as any).id)
      console.log("Get Messages`", data)
      return data
    },
    getMembers()
    {
      let data = this.$store.getters["channel/members"]((this as any).id)
      console.log("Get Members`", data)
      return data
    }
  },
  async fetch()
  {
    try {
      await this.$store.dispatch("channel/joinChannel", (this as any).id)
      await this.$store.dispatch("channel/fetchOne", (this as any).id)
      await this.$store.dispatch("channel/getMessages", (this as any).id)
    }
    catch(error)
    {
      this.$toast.error("Cannot fetch channel")
    } 
  },
  methods: {
    initForm()
    {
      this.channelName = this.getChannel.name
      this.isPrivate = !this.getChannel.isPublic
    },
    deleteChannel(event : any)
    {
      event.preventDefault()
      this.$axios.$delete(`/channel/${this.getChannel.id}/delete`)
      .then((rep : any) => {
        if (rep.status == 201)
        {
          this.$toast.success("Channel deleted")
          this.$store.dispatch("channel/fetchAll")
          this.$router.push("/channel")
        }
        else
          this.$toast.error(rep.message)
       })
      .catch(() => {
        this.$toast.error("Cannot delete channel")
       })
    },
    updateChannel(event : any)
    {
      event.preventDefault()
      if (this.channelName == "")
        this.$toast.error("Name cannot be empty")
      else
      {
        this.$store.dispatch("channel/update", { channelId : this.getChannel.id, channelName : this.channelName, isPrivate : this.isPrivate, password : this.channelPassword })  
        .then((rep : any) => {
          if (rep.data.status && rep.status != 201)
          {
            this.$toast.error(rep.message)
          }
          else
          {
            this.$toast.success("Channel updated")
            this.$router.back()
            this.$store.commit("channel/updateChannel", rep.data)
          }
         })
        .catch(() => {
          this.$toast.error("Cannot update channel")
        })
      }
    },
    fetchMembers()
    {
      this.$store.dispatch("channel/getMembers", this.id) // TODO loading animation ?
    },
    makeAdmin(userId : string)
    {
      this.$axios.post(`/channel/${this.id}/members/${userId}/makeAdmin`)
      .then((rep : any) => {
        if (rep.data.status && rep.data.status != 201)
          this.$toast.error(rep.data.message)
        else
          this.$toast.success("Member is now admin")
        this.fetchMembers()
      })
      .catch((error : any) => {
          console.log(error)
          this.$toast.error("Cannot update member")
      })
    },
    banMember(data : { memberId: string, time : number}) // time in minute, the default value is the max value for forever ban
    {
      this.$axios.post(`/channel/${this.id}/ban`, { userId : data.memberId, duration : data.time})
      .then((rep : any) => {
        if (rep.data.status && rep.data.status != 201)
          this.$toast.error(rep.data.message)
        else
          this.$toast.success("User banned")
        this.fetchMembers()
      })
      .catch((error : any) => {
          console.log(error)
          this.$toast.error("Cannot ban member")
      })
    },
    unbanMember(memberId: string) // time in minute, the default value is the max value for forever ban
    {
      this.$axios.post(`/channel/${this.id}/unban`, { userId : memberId })
      .then((rep : any) => {
        if (rep.data.status && rep.data.status != 201)
          this.$toast.error(rep.data.message)
        else
          this.$toast.success("User unbanned")
        this.fetchMembers()
      })
      .catch((error : any) => {
          console.log(error)
          this.$toast.error("Cannot unban member")
      })
    },
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