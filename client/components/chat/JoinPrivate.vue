<template>
    <div class="bg-white">
      <form @submit="sendForm">
          <label for="channelPrivatePassword" class="cursor-pointer label">
            Password required
            <input
              v-model="password"
              id="channelPrivatePassword"
              type="password"
              placeholder=""
              class="input input-bordered"
            />
          </label>
          <input type="submit" value="Join channel" class="btn btn-primary" />
      </form>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props : ["channelId"],
    data()
    {
      return {
          password : '' as string,
      }
    },
    methods : 
    {
      sendForm(event : any)
      {
        event.preventDefault()
        if (this.password !== '')
          this.joinChannel()
      },
      joinChannel()
      {
        this.$axios.$post(`/channel/${this.channelId}/join`, { password: this.password })
          .then((rep : any) => {
              if (rep.status === 201)
                  this.$emit("replace", { comp : "ChatChannelSingle", props : { channelId : this.channelId } })
              else
                  this.$toast.error(rep.message)
          })
          .catch((error) => {
              // TODO error handling
          })
        },
    }
})
</script>