<template>
	<keep-alive>
	</keep-alive>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
 methods: {
  sendMessage() {
   if(this.validateInput()) {
    const message = {
    name: this.name,
    text: this.text
   }
   this.socket.emit('msgToServer', message)
   this.text = ''
  }
 },
 receivedMessage(message) {
  this.messages.push(message)
 },
 validateInput() {
  return this.name.length > 0 && this.text.length > 0
 }
},
 created() {
  this.socket = io('http://localhost:3000')
  this.socket.on('msgToClient', (message) => {
   this.receivedMessage(message)
  })
 }
})
</script>

<style>
.container {
  margin: auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'vocaloid';
  display: block;
  font-weight: 300;
  font-size: 50px;
  color: #35495e;
  letter-spacing: 2px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
</style>