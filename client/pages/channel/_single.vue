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
            <div :class="{'bg-green-400' : m.user.id === $auth.user.id}" class="p-3 my-1 flex flex-row items-center justify-between rounded-xl bg-gray-300" v-for='m in getMembers'> 
              <img class="w-16 h-16 rounded-full" :src="m.user.avatar" :alt="m.user.displayName">
              <span>{{m.user.displayName}}</span>
              <font-awesome-icon v-if="getChannel.owner.id === m.user.id"  class="text-xl mx-1.5" icon="crown"> </font-awesome-icon>
              <div v-if="getChannel && getChannel.owner.id === $auth.user.id && m.user.id !== $auth.user.id && !isActiveTimeout(m.timeout)" class="flex flex-row">
                <span @click="" class="btn btn-accent mx-1">Admin</span>
                <span  class="btn mx-1" @click="banMember(m.user.id)">Ban</span>
              </div>
              <div v-else-if="isActiveTimeout(m.timeout)">
                <div v-if="m.timeout.start === m.timeout.end"></div>
              </div>
            </div>
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
      dateNow : Date.now()
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
    setInterval(() => this.dateNow = Date.now(), 1000 * 60)
  },
  destroyed()
  {
    let sock = getSocket()
    sock.off("channel/banned")
    sock.off("channel/destroyed")
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
    },
    isActiveTimeout(timeout : { start : string, end : string})
    {
      if (timeout.start === timeout.end)
        return true
      if (Date.parse(timeout.end) < this.dateNow)
        return true
      return false
    },
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
          if (rep.datastatus && rep.status != 201)
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
    banMember(memberId: string, time = 0) // time in minute, the default value is the max value for forever ban
    {
      let start = new Date().getTime()
      let end = 0
      this.$axios.post(`/channel/${this.id}/ban`, { userId : memberId, duration : time})
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
