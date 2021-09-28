<template>
  <div class="flex flex-col my-4" >
    <div id="inner" class="flex flex-col">
      <div v-if="renderedMessages.length === 0" class="flex flex-row iterms-center justify-center">
        <span class="text-gray-400">Say hello to your new friend !</span>
      </div>
      <div v-for="m in renderedMessages" v-bind:key='m.id' class="flex flex-col justify-start">
        <span class="font-bold text-gray-400" :class="{'self-end' : m.isMine }" v-if="m.first"> {{m.name}}</span>
        <div class="flex" :class="[ m.isMine ? 'flex-row-reverse' : 'flex-row']">
          <span class="p-3 m-0.5 rounded-xl inline-block max-w-full break-all" :class="[m.isMine ? 'text-white bg-blue-500' : 'text-black bg-gray-300 self-start']">
            {{ m.content }}
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
      renderedMessages : [] as any[]
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
  watch :
  {
    members()
    {
      if (this.members.length === 0)
        return
      this.renderedMessages = []
      this.updateMessageList()
    },
    messages()
    {
      if (this.members.length === 0)
        return
      this.updateMessageList()
    } 
  },
  methods: {
    updateMessageList()
    {
      let diff = this.messages.length - this.renderedMessages.length
      for (let i = this.messages.length - diff; i < this.messages.length; i++) {
        const m = this.messages[i];
        m.isMine = this.isMessageMine(m)
        if (this.lastUserId !== m.senderId)
        {
          if (this.members)
          {
            const member = this.members.find((mem : any) => {
                return mem.id === m.senderId
            })
            if (!member)
            {
              this.$emit("unknownMember")
              return
            }
            m.name = member.displayName
          }
          this.lastUserId = m.senderId
          m.first = true
        }
        this.renderedMessages.push(m)
      }
    },
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
    }
  },
})
</script>

<style>

#inner {
  height: 70vh;
  width: 100%;
  overflow-y: auto;
}
</style>
