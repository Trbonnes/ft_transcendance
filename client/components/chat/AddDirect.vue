
<template>
    <div>
        <form @submit="submitForm">
          <div class="flex flex-col">
              <label class="label">
                <span class="label-text">Username</span>
              </label> 
              <div class="relative w-full border-8" @blur="() => this.search = []">
                <input type="text" @focus="fetchList" @keyup="fetchList" v-model="usernameSearch" placeholder="username" class="input h-16 input-bordered w-full mb-2">
                <ul v-if="search && search.length > 0" tabindex="0"
                  class="absolute w-full left-0 top-16 p-2 shadow-2xl menu dropdown-open bg-base-100 rounded-box w-52">
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
    }
  }
})
</script>