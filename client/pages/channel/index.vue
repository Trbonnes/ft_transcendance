<template>
  <div class="flex flex-col items-center h-full">
    <div id="channelList" >
      <div v-for="c in getChannels" class="card bordered bg-gray-600 text-white">
        <div @click="joinChannel(c)" class="card-body cursor-pointer w-full">
          <h1>{{c.name}}</h1> <!-- TODO not pretty -->
        </div>
      </div>
    </div>

    <div id="join-private"  v-bind:class="[this.joinForm.show ? 'modal-open' : 'modal']">
      <div class="modal-box ">
        <form @submit="joinPrivate">
            <label for="channelPrivatePassword" class="cursor-pointer label">
              Password required
              <input
                v-model="channelPrivatePassword"
                id="channelPrivatePassword"
                type="password"
                placeholder=""
                class="input input-bordered"
              />
            </label>
            <input type="submit" value="Join channel" class="btn btn-primary" />
        </form>
        <a href="#" class="btn btn-primary" @click="toggleJoinForm">Close</a>
      </div>
    </div>
    <a href="#create-channel" class="btn btn-primary">Create a channel</a>
    <div id="create-channel" class="modal">
      <div class="modal-box flex flex-col">
        <form @submit="checkForm">
          <label for="channelName" class="cursor-pointer label">
            Enter an channel name:
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
            Enter an password:
            <input
              v-model="channelPassword"
              id="channelPassword"
              type="password"
              placeholder=""
              class="input input-bordered"
              v-bind:disabled="!isPrivate"
            />
          </label>
          <input type="submit" value="Create channel" class="btn btn-primary" />
        </form>
          <a href="#" class="btn btn-primary">Close</a>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Channel, CreateChannelDto } from '~/utils/types/channel'
export default Vue.extend({
  data() {
    return {
      isPrivate: false as boolean,
      channelName: '' as string,
      channelPassword: '' as string,
      channelPrivatePassword: '' as string,
      joinForm : {
          channelId : '' as string,
          show : false as boolean
        }
    }
  },
  fetch() {
    this.$store.dispatch('channel/fetchAll')
  },
  computed : {
    getChannels()
    {
      return this.$store.getters["channel/all"]
    }
  },
  methods: {
    checkForm(e: any) {
      e.preventDefault()
      if (this.channelName === '')
        this.$toast.error('Channel name cannot be empty')
      else if (this.isPrivate && this.channelPassword === '')
        this.$toast.error('Channel password cannot be empty')
      else this.createChannel()
    },
    createChannel() {
      const data: CreateChannelDto = { // TODO remove DTO, kinda overkill, types that are used only one time don't need to be defined elsewhere
        isPublic: !this.isPrivate,
        channelPassword: this.channelPassword,
        channelName: this.channelName,
      }
      this.$store
        .dispatch('channel/create', data)
        .then((channel: Channel) => {
          this.$store.dispatch('channel/fetchAll')
          this.isPrivate = false
          this.channelName = ''
          this.channelPassword = ''
          this.$router.back()
        })
        .catch((error: any) => {
          console.log('There is an error')
          console.log(error)
        })
    },
    joinChannel(channel : Channel)
    {
      if (channel.isPublic === false)
        this.toggleJoinForm(channel.id)
      else
        this.joinRequest(channel.id)
    },
    toggleJoinForm(channelId = '')
    {
      this.joinForm.channelId = channelId;
      this.joinForm.show = !this.joinForm.show;
      this.channelPrivatePassword = ''
    },
    joinPrivate(e : any)
    {
      e.preventDefault()
      if (this.channelPrivatePassword === "")
        this.$toast.error("Password cannot be empty")
      else
      {
        this.joinRequest(this.joinForm.channelId, this.channelPrivatePassword)
      }
    },
    joinRequest(id : string, passwd = "")
    {
      console.log("id ", id)
        this.$axios.$post("/channel/join", { channelId : id, password: passwd})
      .then((rep : any) => { console.log(rep);
        if (rep.status != 201)
          this.$toast.error(rep.message)
        else
        {
          this.$toast.success(rep.message)
          this.$router.push(`/channel/${id}`)
        }
      })
      .catch((error) => 
      {
        console.log(error)
        this.$toast.error("Http error, check your internet connection")
      })
    }
  },
})
</script>

<style>
#channelList {
  display: block;
  width: 50%;
  min-height: 75%;
}
</style>
