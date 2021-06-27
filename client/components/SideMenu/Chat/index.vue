<template >
    <div>
        <h1>Here comes the chat</h1>
       <component :is="comp.component" v-bind="comp.props" @select="showConversation" @exit="showList"/> 
    </div>
</template>
<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
           comp: {
               component : 'side-menu-chat-list',
               props : null
            } 
        }
    },
    methods: {
        showConversation(id : string)
        {
            this.comp.component = 'side-menu-chat-single'
            this.comp.props = { id : id }
        },
        showList(id : string)
        {
            this.comp.component = 'side-menu-chat-list'
            this.comp.props = null 
        }
    },
})
</script>
