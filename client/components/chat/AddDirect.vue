
<template>
    <div>
        <form @submit="submitForm">
          <div class="flex flex-col items-center">
              <label class="label">
                <span class="label-text">Type in an username</span>
              </label> 
              <div class="relative w-11/12" @blur="() => this.search = []">
                <input type="text" @focus="fetchList" @keyup="fetchList" v-model="usernameSearch" placeholder="username" class="input h-16 input-bordered w-full mb-2">
                <ul v-if="search && search.length > 0" tabindex="0"
                  class="menu w-full">
                  <li v-for="user in search">
                    <a @click="selectOne(user.id)">
                      <img class="w-14" :src="user.avatar" alt="avatar">
                      <span>
                        {{user.name}}
                      </span>
                    </a>
                  </li>
                </ul>
              </div>
          </div>
        </form> 
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      lock : false,
      currentChannel : '',
      usernameSearch : '',
      search : [] as any[]
    }
  },
  mounted()
  {
      console.log("the script is mounted")
  },
  methods : {
    async fetchList(event : any)
    { 
      if (event.code === "Backspace" && this.usernameSearch === '')
      {
        this.search = []
        return 
      }
      if (!this.lock)
      {
        this.lock = true;
        try {
          let data = await this.$store.dispatch("directChannel/searchUser", this.usernameSearch.trim())
          this.search = data
        }
        catch (error: any)
        {
          this.$toast.error("An error has occured")
        }
        this.lock = false
      }
    },
    submitForm(event : any)
    {
        event.preventDefault();
    },
    async selectOne(id : string){
      try
      {
        let data = await this.$store.dispatch('directChannel/joinChannel', id)
        await this.$store.dispatch('directChannel/fetchAll')
        let channel = this.$store.getters['directChannel/one'](data.id)
        this.$emit("replace", { comp : 'ChatDirectSingle',  props : { userId : channel.user.id, channelId : channel.id }})
      }
      catch (error : any)
      {
        this.$toast.error("Cannot join channel")
      }
    },
  }
})
</script>