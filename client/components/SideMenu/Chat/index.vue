<template >
    <div>
        <h1>Here comes the chat</h1>
       <component :is="comp" @select="showConversation" @exit="showList"/> 
    </div>
</template>
<script lang='ts'>
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
           comp: 'side-menu-chat-list' 
        }
    },
    methods: {
        showConversation(id : string)
        {
            this.comp = 'side-menu-chat-single'
        },
        showList(id : string)
        {
            this.comp = 'side-menu-chat-list'
        }
    },
})
</script>
