<template>
  <div class="flex flex-row items-start">
    <div>
      <h1>Liste des trucs</h1>
      <div>
        <a href="#search-dm" class="btn btn-primary">Add</a>
        <div id="search-dm" class="modal">
          <div class="modal-box flex flex-col">
            <form @submit="addDirectChannel">
              <div class="flex flex-col">
                  <label class="label">
                    <span class="label-text">Username</span>
                  </label> 
                  <input type="text" @keypress="fetchList" v-model="usernameSearch" placeholder="username" class="input input-bordered">
                  <ul v-if="search && search.length > 0 && usernameSearch !== ''" tabindex="0"
                    class="p-2 shadow-3xl menu dropdown-open bg-base-100 rounded-box w-52">
                    <li v-for="user in search">
                      <a @click="selectOne(user.id)">{{user.name}}</a>
                    </li>
                  </ul>
              </div>
            </form> 
            <a href="#" class="btn btn">Close</a>
          </div>
        </div>
      </div>
      <div>
        <div :class="{ 'bg-gray-400' : channel.id === currentChannel }" v-for="channel in getAll" @click="joinChannel(channel.id)" class="cursor-pointer p-3 my-1 flex flex-row items-center justify-between rounded-xl bg-gray-300 hover:bg-gray-500">
          <img class="w-16 h-16 rounded-full" :src="channel.user.avatar" :alt="channel.user.displayName">
          <span>{{channel.user.displayName}}</span>
        </div>
      </div>
    </div>
    <Conversation v-if="currentChannel" id="convo" :messages="getMessages" @sendMessage="sendMessage" />
    <span class="btn btn-primary" v-if="!isBlocked" @click="blockUser">Block User</span>
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
  fetch() {
    this.$store.dispatch('directChannel/fetchAll')     
  },
  computed : {
    getAll(){
      let data = this.$store.getters["directChannel/all"]
      console.log("Geting the data")
      console.log(data)
      return data
    },
    getMessages()
    {
      if (this.currentChannel === '')
        return []
      let tmp : any = this.currentChannel
      let data = this.$store.getters["directChannel/messages"](tmp)
      console.log("Returned data from getter")
      console.log(data)
      return data
    },
    currentUser()
    {
      let tmp : any = this.currentChannel
      return this.$store.getters["directChannel/user"](tmp)
    },
    isBlocked()
    {
      return false
    }
  },
  methods : {
    async selectOne(id : string){
      try
      {
        let data = await this.$store.dispatch('directChannel/joinChannel', id)
        console.log(data)
        if (data.status == 201)
          this.$toast.success(data.message)
        else 
          throw new Error()
        this.$store.dispatch('directChannel/fetchAll')
        this.$router.back()
      }
      catch (error : any)
      {
        this.$toast.error("Cannot join channel")
      }
    },
    async joinChannel(userId : string)
    {
      if (this.currentChannel === userId)
        return
      try
      {
        await this.$store.dispatch('directChannel/history', userId)
        this.currentChannel = userId
      }
      catch(error : any)
      {
        this.$toast.error("Cannot message history")
      }
    },
    async sendMessage(content : string)
    {
      try
      {
        let data = await this.$store.dispatch('directChannel/sendMessage',  { userId : this.currentUser.id, content : content })
      }
      catch(error : any)
      {
        this.$toast.error("Cannot message history")
      }
    }, 
    addDirectChannel(e : any)
    {
        e.preventDefault()
    },
    async fetchList()
    { 
      if (!this.lock && this.usernameSearch.trim() != '')
      {
        this.lock = true;
        try {
          let data = await this.$store.dispatch("directChannel/searchUser", this.usernameSearch.trim())
          this.search = data
          console.log(data)
        }
        catch (error: any)
        {
          this.$toast.error("An error has occured")
        }
        this.lock = false
      }
    },
    blockUser()
    {
      console.log(this.currentUser)
      // this.$store.dispatch("user/blockUser", )
    }
  }
})
</script>

<style>

</style>
