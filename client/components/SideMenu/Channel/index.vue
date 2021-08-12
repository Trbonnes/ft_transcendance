<template>
  <div class="h-full w-full">
    <component
      :is="comp.component"
      v-bind="comp.props"
      @select="showConversation"
      @exit="showList"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getSocket } from '../../../store/plugins/websocket'

let sock = getSocket()

export default Vue.extend({
  data() {
    return {
      comp: {
        component: 'side-menu-channel-list',
        props: { id: '' },
      },
    }
  },
  methods: {
    showConversation(channelId: string) {
      this.comp.component = 'side-menu-channel-single'
      this.comp.props = { id: channelId }
      sock.emit('joinChannel', this.comp.props.id)
    },
    showList(id: string) {
      this.comp.component = 'side-menu-channel-list'
      sock.emit('leaveChannel', this.comp.props.id)
      this.comp.props.id = ''
    },
  },
})
</script>
