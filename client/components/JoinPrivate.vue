<template>
    <div id="join-private"  v-bind:class="[this.joinForm.show ? 'modal-open' : 'modal']">
      <ChatGoBack @click.native='$emit("back")'/>
      <div class="modal-box ">
        <form @submit="sendForm">
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
        <a href="#" class="btn btn-primary" @click='$emit("back")'>Close</a>
      </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data()
    {
      return {
        joinForm : {
            channelId : '' as string,
            password : '' as string,
            show : false as boolean
          }
      }
    },
    methods : 
    {
      sendForm(event : any)
      {
        event.prevenDefault()
        this.$emit('joinPrivate', joinForm) 
      }
    }
})
</script>