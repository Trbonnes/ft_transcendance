<template>
  <div>
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
      const socket = getSocket()
      socket.emit('joinChannel', channelId)
    },
    showList(id: string) {
      this.comp.component = 'side-menu-channel-list'
      this.comp.props.id = ''
    },
  },
})
</script>
