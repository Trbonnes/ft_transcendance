<template>
  <div class="flex flex-col items-center h-full w-full bg-gray-100">
    <div class="w-full">
      <div v-for="c in getChannels" class="card text-black font-bold my-1">
        <div @click="joinChannel(c)" class="card-body bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer w-full flex flex-row items-center justify-between">
          <font-awesome-icon title="You're the owner of the channel" v-if='c.owner == $auth.user.id' class="text-black" icon="crown"></font-awesome-icon>
          <h1>{{c.name}}</h1> <!-- TODO not pretty -->
          <font-awesome-icon title="You're the owner of the channel" v-if='c.isPublic' icon="hashtag"></font-awesome-icon>
          <font-awesome-icon title="You're the owner of the channel" v-else icon="lock"></font-awesome-icon>
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
        .then((data : any) => {
          if (data.status)
          {
              this.$toast.error(data.message)
          }
          else
          {
            this.$toast.success("Channel created")
            this.$router.push(`/channel/${data.id}`)
          }
        })
        .catch((error: any) => {
        })
    },
    joinPrivate(event : any)
    {
      event.preventDefault()
      let data = { id : this. joinForm.channelId, password : this.joinForm.password}
      this.joinChannel(data)
    },
    joinChannel(channel : { id : string; password : string})
    {
    //   this.$axios.$post(`/channel/${channel.id}/join`, {  password: channel.password })
    //   .then((rep : any) => {
    //     console.log(rep)
    //     if (rep.status == 201)
    //     {
    //       this.$toast.success(rep.message)
    //       this.$router.push(`/channel/${channel.id}`)
    //     }
    //     else
    //     {
    //       if (rep.status == 401)
    //         this.toggleJoinForm(channel.id)
    //       this.$toast.error(rep.message)
    //     }
    //   })
    //   .catch((error) => {
    //   })
    },
    toggleJoinForm(channelId = '')
    {
      this.joinForm.channelId = channelId;
      this.joinForm.show = !this.joinForm.show;
      this.channelPrivatePassword = ''
    },
  },
})
</script>

<style>
</style>
