<template>
  <div>
    <div class="card bordered">
      <div class="card-body">
        <h1>here is an element</h1>
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
        <div v-for="error in errors" class="alert alert-error"><label>{{error}}</label></div>
          <a href="#" class="btn btn-primary">Close</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      channels: this.$store.getters['channel/all'],
      isPrivate: false as boolean,
      channelName: '' as string,
      channelPassword: '' as string,
      errors: [] as string[],
    }
  },
  mounted() {
    this.$store.dispatch('channel/fetchAll')
  },
  methods: {
    checkForm(e) {
      e.preventDefault()
      this.errors = []
      if (this.channelName == '')
        this.errors.push('Channel name cannot be empty')
      if (this.isPrivate && this.channelPassword == "")
        this.errors.push('Channel password cannot be empty')
    },
    createChannel() {
      /* const data: CreateChannelDto = { */
      /*   owner: 'bob@yopmail.com', */
      /*   users: ['bob', 'miranda'], */
      /* } */
      /* this.$store.dispatch('channel/create', data) */
      /* this.$store.dispatch('channel/fetchAll') */
      /* console.log(this.$store.state.channel.channelList) */
      /* console.log('Just before this ') */
      this.isPrivate = false
      this.channelName = ''
      this.channelPassword = ''
    },
  },
})
</script>

<style></style>
