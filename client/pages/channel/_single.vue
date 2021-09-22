<template>
  <div class="flex flex-col items-center justify-center">
		<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold">{{getChannel.name}}</h1>
    <Conversation id="convo" :messages="getMessages" @sendMessage="sendMessage" />
    <div class="flex flex-row items-start">
      <a href="#members" @click="fetchMembers" class="btn btn-primary text-white">
        <font-awesome-icon class="text-xl mx-1.5" icon="users"> </font-awesome-icon> Members
      </a>
      <div id="members"  class="modal">
        <div class="modal-box ">
          <div class="flex flex-col max-h-96 overflow-y-scroll">
            <member-card @makeAdmin="makeAdmin" @banMember="banMember" @unbanMember="unbanMember" v-for='m in getMembers' v-bind:currentDate="dateNow" v-bind:membership="m" v-bind:channel="getChannel"/>
          </div>
          <div class="modal-action">
            <a href="#" class="btn">Close</a>
          </div>
        </div>
      </div>
      <div v-if="getChannel && getChannel.owner.id === $auth.user.id">
        <a href="#edit" @click="initForm" class="btn btn-primary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="pen"> </font-awesome-icon> Edit
        </a>
        <div id="edit" class="modal">
          <div class="modal-box">
            <form @submit="updateChannel">
              <label for="channelName" class="cursor-pointer label">
                Channel Name
                <input
                  v-model="channelName"
                  id="channelName"
                  type="text"
                  placeholder=""
                  class="input input-bordered"
                />
              </label>
              <label for="isPrivate" class="cursor-pointer label">
                Private channel
                <input
                  v-model="isPrivate"
                  id="isPrivate"
                  type="checkbox"
                  class="checkbox checkbox-primary"
                />
              </label>
              <label for="channelPassword" class="cursor-pointer label">
                New Password
                <input
                  v-model="channelPassword"
                  id="channelPassword"
                  type="password"
                  placeholder=""
                  class="input input-bordered"
                  v-bind:disabled="!isPrivate"
                />
              </label>
              <input type="submit" value="Update channel" class="btn btn-primary" />
            </form>
            <div class="modal-action">
              <a href="#" class="btn">Close</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="getChannel && getChannel.owner.id === $auth.user.id">
      <a href="#delete" @click="deleteChannel" class="btn btn-secondary text-white">
        <font-awesome-icon class="text-xl mx-1.5" icon="times"> </font-awesome-icon>Delete Channel
      </a>
      <div id="delete" class="modal">
        <div class="modal-box">
          Do you really want to delete the channel ?
          <div class="flex flex-row w-full justify-start">
            <a href="#" class="btn">Close</a>
            <div class="modal-action">
              <a href="#" class="btn">Close</a>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    sock.on("channel/banned", exitChannel)
    sock.on("channel/destroyed", exitChannel)
    this.timer = setInterval(() => {this.dateNow = new Date}, 1000)
  },
  destroyed()
  {
    let sock = getSocket()
    sock.off("channel/banned")
    sock.off("channel/destroyed")
    clearInterval(this.timer)
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

<style>
#convo
{
  min-width: 60vw;
  max-width: 90vw;
  overflow-y: hidden;
}

</style>
