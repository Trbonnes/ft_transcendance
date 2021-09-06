<template>
  <div class="flex flex-row items-start">
    <div>
      <h1>Liste des trucs</h1>
      <div>
        <a href="#search-dm" class="btn btn-primary">Join-channel</a>
        <div id="search-dm" class="modal">
          <div class="modal-box flex flex-col">
            <form @submit="addDirectChannel">
              <div class="flex flex-col">
                  <label class="label">
                    <span class="label-text">Username</span>
                  </label> 
                  <input type="text" @keypress="fetchList" v-model="usernameSearch" placeholder="username" class="input input-bordered">
                  <ul v-if="search && search.length > 0 && usernameSearch !== ''" tabindex="0"
                    class="absolute p-2 shadow menu dropdown-open bg-base-100 rounded-box w-52">
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
        <div v-for="c in getAll">
          {{c.id}}
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
      lock : false,
      usernameSearch : '',
      search : [] as any[]
    }
  },
  fetch() {
    this.$store.dispatch('directChannel/fetchAll')     
  },
  computed : {
    getAll(){
      console.log(this.$store.getters)
      return this.$store.getters["directChannel/all"]
    }
  },
  methods : {
    selectOne(id : string){
      console.log("Selecting", id)
    },
    addDirectChannel(e : any)
    {
        e.preventDefault()
        console.log("Trying to find user") 
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
    }
  }
})
</script>

<style>

</style>
