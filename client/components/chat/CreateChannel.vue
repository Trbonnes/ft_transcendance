<template>
  <div>
    <div class="bg-white">
      <div>
        <div class="flex flex-col font-bold">
          <form class="flex items-center justify-center flex-col" @submit="checkForm">
            <label for="channelName" class="label">
              <span>
                  Enter an channel name
              </span>
              <input
                v-model="channelName"
                id="channelName"
                type="text"
                placeholder=""
                class="input input-bordered"
              />
            </label>
            <label for="isPrivate" class="label">
              Private channel
              <input
                v-model="isPrivate"
                id="isPrivate"
                type="checkbox"
                class="checkbox checkbox-primary"
              />
            </label>
            <label for="channelPassword" class="label">
              <span>
                  Enter a password
              </span>
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
          </div>
        </div>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { CreateChannelDto } from '~/utils/types'

export default Vue.extend({
  data() {
    return {
      isPrivate: false as boolean,
      channelName: '' as string,
      channelPassword: '' as string,
      channelPrivatePassword: '' as string,
    }
  },
  methods: {
    checkForm(e: any) {
      e.preventDefault()
      if (this.channelName === '')
        this.$toast.error('Channel name cannot be empty')
      else if (this.isPrivate && this.channelPassword === '')
        this.$toast.error('Channel password cannot be empty')
      else
        this.createChannel()
    },
    createChannel() {
      const data = { // TODO remove DTO, kinda overkill, types that are used only one time don't need to be defined elsewhere
        channelName: this.channelName,
        isPublic: !this.isPrivate,
        channelPassword: this.channelPassword,
      }
      this.$store
        .dispatch('channel/create', data)
        .then((data : any) => {
          if (data.status)
          {
              this.$toast.error("could not create channel")
          }
          else
          {
            this.$toast.success("Channel created")
            this.$emit("back")
          }
        })
        .catch((error: any) => {
        })
    },
  }
})
</script>

<style>
form label{
  @apply w-9/12 cursor-pointer flex flex-col items-start justify-start !important;
}
</style>
