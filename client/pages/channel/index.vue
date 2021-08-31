<template>
  <div class="flex flex-col items-center h-full">
    <div id="channelList" >
      <div v-for="c in getChannels" class="card bordered bg-gray-600 text-white">
        <div @click="joinChannel(c)" class="card-body cursor-pointer w-full flex flex-row items-center justify-between">
          <font-awesome-icon title="You're the owner of the channel" v-if='c.isPublic' class="text-white" icon="hashtag"></font-awesome-icon>
          <font-awesome-icon title="You're the owner of the channel" v-else class="text-white" icon="lock"></font-awesome-icon>
          <h1>{{c.name}}</h1> <!-- TODO not pretty -->
          <font-awesome-icon title="You're the owner of the channel" v-if='c.owner == $auth.user.id' class="text-white" icon="crown"></font-awesome-icon>
        </div>
      </div>
    </div>

    <div id="join-private"  v-bind:class="[this.joinForm.show ? 'modal-open' : 'modal']">
      <div class="modal-box ">
        <form @submit="joinPrivate">
            <label for="channelPrivatePassword" class="cursor-pointer label">
              Password required
              <input
                v-model="joinForm.password"
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
import { Channel, CreateChannelDto } from '~/utils/types'
export default Vue.extend({
  data() {
    return {
      isPrivate: false as boolean,
      channelName: '' as string,
      channelPassword: '' as string,
      channelPrivatePassword: '' as string,
      joinForm : {
          channelId : '' as string,
          password : '' as string,
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
    joinPrivate(event : any)
    {
      event.preventDefault()
      let data : Channel = { id : this. joinForm.channelId, password : this.joinForm.password}
      this.joinChannel(data)
    },
    joinChannel(channel : Channel)
    {
      console.log("Trying to join")
      this.$axios.$post("/channel/join", { channelId : channel.id, password: channel.password })
      .then((rep : any) => {
        if (rep.status == 201)
        {
          this.$toast.success(rep.message)
          this.$router.push(`/channel/${channel.id}`)
        }
        else
        {
          if (rep.status == 401)
            this.toggleJoinForm(channel.id)
          this.$toast.error(rep.message)
        }
      })
      .catch((error) => {
        console.log(error) //TODO error handling
      })
    },
    toggleJoinForm(channelId = '')
    {
      console.log("password propmt ")
      this.joinForm.channelId = channelId;
      this.joinForm.show = !this.joinForm.show;
      this.channelPrivatePassword = ''
    },
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
