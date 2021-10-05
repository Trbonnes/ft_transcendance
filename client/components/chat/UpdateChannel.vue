<template>
    <div>
        <form @submit="validateForm">
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
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: ["channel"],
    data()
    {
        return {
          channelName: this.channel.name as string,
          isPrivate: !this.channel.isPublic as boolean,
          channelPassword: '' as string,
        }
    },
    methods :
    {
        validateForm(event : any)
        {
            event.preventDefault()
            let valid = true
            if (this.channelName === "")
            {
                this.$toast.error("Name cannot be empty")
                valid = false
            }
            if (this.channel.isPublic && this.isPrivate && this.channelPassword === "")
            {
                this.$toast.error("Password cannot be empty")
                valid = false
            }
            if (valid)
                this.updateChannel()
        },
        updateChannel()
        {
            this.$store.dispatch(`channel/update`, { channelId : this.channel.id, channelName : this.channelName, isPrivate : this.isPrivate, password : this.channelPassword }) 
            .then((rep : any) => {
              if (rep.status && rep.status != 201)
              {
                this.$toast.error(rep.message)
              }
              else
              {
                this.$toast.success("Channel updated")
                this.$store.commit("channel/updateChannel", rep)
                this.$emit("back")
              }
             })
            .catch((error : any) => {
              this.$toast.error("Cannot update channel")
            })
        },
    }
})
</script>