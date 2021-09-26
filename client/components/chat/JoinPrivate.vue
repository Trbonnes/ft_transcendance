<template>
    <div class="bg-white">
      <ChatGoBack @click.native='$emit("back")'/>
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
        this.$emit('joinPrivate', this.password) 
      }
    }
})
</script>