<template>
  <div class="flex flex-col items-center justify-center">
    <Conversation id="convo" :messages="getMessages" @sendMessage="sendMessage" />
    <div class="flex flex-row items-start">
      <a href="#members" @click="fetchMembers" class="btn btn-primary text-white">
        <font-awesome-icon class="text-xl mx-1.5" icon="users"> </font-awesome-icon> Members
      </a>
      <div id="members" class="modal">
        <div class="modal-box">
          <div class="flex flex-col">
            <div :class="{'bg-green-400' : m.user.id === $auth.user.id}" class="p-3 my-1 flex flex-row items-center justify-between rounded-xl bg-gray-300" v-for='m in getMembers'> 
              <img class="w-16 h-16 rounded-full" :src="m.user.avatar" :alt="m.user.displayName">
              <span>{{m.user.displayName}}</span>
              <font-awesome-icon v-if="getChannel.owner === m.user.id"  class="text-xl mx-1.5" icon="crown"> </font-awesome-icon>
              <div v-if="getChannel.owner === $auth.user.id && m.user.id !== $auth.user.id" class="flex flex-row">
                <span @click="updateMember(m.user.id, true, false)" class="btn btn-accent mx-1">Admin</span>
                <span  class="btn mx-1" @click="updateMember(m.user.id, false, false)">Ban</span>
              </div>
            </div>
          </div>
          <div class="modal-action">
            <a href="#" class="btn">Close</a>
          </div>
        </div>
      </div>
      <div v-if="getChannel.owner === $auth.user.id">
        <a href="#edit" @click="initForm" class="btn btn-primary text-white">
          <font-awesome-icon class="text-xl mx-1.5" icon="pen"> </font-awesome-icon> Edit
        </a>
        <div id="edit" class="modal">
          <div class="modal-box">
            <form @submit="checkForm">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateMessageDto, Message } from '~/utils/types'

export default Vue.extend({
  // fetch channel given the id and pass the data to the Conversation component
  data() {
    return {
      id: this.$route.params.single,
      channelName: '' as string,
      isPrivate: false as boolean,
      channelPassword: '' as string,
    }
  },
  computed: {
    getChannel()
    {
      const data = this.$store.getters["channel/getOne"](this.id)
      if (data)
        return data
      return ""
    },
    getMessages()
    {
      let data = this.$store.getters["channel/messages"](this.id)
      console.log("trying to call getter")
      return data
    },
    getMembers()
    {
      let data = this.$store.getters["channel/members"](this.id)
      return data
    }
  },
  mounted() {
    console.log("Mounted the single vue")
    try {
      this.$store.dispatch("channel/joinChannel", this.id)
      this.$store.dispatch("channel/getMessages", this.id)
    }
    catch(error)
    {
      // TODO handling error
    } 
  },
  methods: {
    initForm()
    {
      this.channelName = this.getChannel.name
      this.isPrivate = !this.getChannel.isPublic
    },
    checkForm(event : any)
    {
      event.preventDefault()
      console.log(this.channelName)
      console.log(this.isPrivate)
      if (this.channelName == "")
        this.$toast.error("Name cannot be empty")
      else
      {
        this.$store.dispatch("channel/update", { channelId : this.getChannel.id, channelName : this.channelName, isPrivate : this.isPrivate, password : this.channelPassword })  
        .then((rep : any) => {
          if (rep.status && rep.status != 201)
          {
            this.$toast.error(rep.message)
          }
          else
          {
            this.$toast.success("Channel updated")
            this.$router.back()
            this.$store.commit("channel/update", rep.data)
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
    updateMember(userToUpdate : string, makeAdmin = false, ban = false)
    {
        this.$axios.$post(`/channel/${this.id}/members/${userToUpdate}/update`,
          { channelId : this.id, userId : userToUpdate, isAdmin : makeAdmin, isBanned : ban})
        .then((rep : any) => {
          if (rep.status == 201) 
          {
            this.$toast.success("Member updated")
            this.$router.back()
          }
          else
          {
            this.$toast.error(rep.message)
          }
        })
        .catch((error : any) =>
        {
            console.log(error)// TODO error handling
        })
    },
    makeAdmin(userId : string)
    {
        
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
