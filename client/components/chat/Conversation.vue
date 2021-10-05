<template>
  <div class="flex flex-col my-4" >
    <div id="inner" class="flex flex-col">
      <div class="flex flex-row iterms-center justify-center">
        <span class="text-gray-400">Say hello to your new friend !</span>
      </div>
      <div v-for="m in cleanMessages" v-bind:key='m.id' class="flex flex-col justify-start">
        <NuxtLink :to="`/users/${m.login}`" class="font-bold text-gray-400" :class="{'self-end' : m.isMine }">
          {{m.login}}
        </NuxtLink> 
        <div class="flex" :class="[ m.isMine ? 'flex-row-reverse' : 'flex-row']">
          <span class="p-3 m-0.5 rounded-xl inline-block max-w-full break-all" :class="[m.blocked ? 'font-bold' : '', m.isMine ? 'text-white bg-blue-500' : 'text-black bg-gray-300 self-start']">
            {{ m.blocked ? 'This content has been blocked' : m.content }}
          </span>
        </div>
      </div>
    </div>
    <div class="flex flex-row">
      <input
        ref="textinput"
        type="text"
        @keyup="listenKey"
        v-model="message"
        class="flex-grow input input-bordered"
      />
      
      <span @click="sendMessage" class="btn btn-primary">Send</span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['messages', 'members'],
  data() {
    return {
      message: '',
      lastUserId : '',
      isMine : false,
    }
  },
  updated() {
    this.scrollBottom()
  },
  mounted() {
    this.scrollBottom()
    if(this.$refs.textinput)
      (this.$refs.textinput as any).focus()
  },
  computed : {
    cleanMessages()
    {
      let blocked = (this.$auth as any).user.blockedUsers as any[]
      console.log(this.$auth.user.blockedUsers)
      for (let i = 0; i < this.messages.length; i++) {
        const m = this.messages[i];
        m.isMine = (m.id === (this.$auth as any).user.id)
        let user = this.members.find((mem : any) => mem.id === m.senderId) 
        if (user)
        {
          m.login = user.displayName
          if (blocked.find((u : any) => u.id === m.senderId))
            m.blocked = true
          else
            m.blocked = false
          if (user.id === (this.$auth as any).user.id)
            m.isMine = true
        }
      }
      return this.messages
    }

  },
  methods: {
    listenKey(e: any) {
      // key code for enter key
      if (e.keyCode === 13) this.sendMessage()
    },
    isMessageMine(m : any)
    {
      return this.$auth && this.$auth.user && this.$auth.user.id === m.senderId 
    },
    sendMessage() {
      if (this.message.trim() !== '') {
        // sending the even to the parent page
        this.$emit('sendMessage', this.message.trim())
        this.message = ''
      }
    },
    scrollBottom()
    {
      var container = this.$el.querySelector("#inner");
      if (container)
        container.scrollTop = container.scrollHeight;
    },
  },
})
</script>

<style>

#inner {
  height: 55vh;
  width: 100%;
  overflow-y: auto;
}
</style>
