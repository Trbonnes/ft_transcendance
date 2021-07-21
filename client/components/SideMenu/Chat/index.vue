<template >
    <div>
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
               props : { id : "" }
            }
        }
    },
    methods: {
        showConversation(convoid : string)
        {
            this.comp.component = 'side-menu-chat-single'
            this.comp.props = { id : convoid }
        },
        showList(id : string)
        {
            this.comp.component = 'side-menu-chat-list'
            this.comp.props.id = "" 
        }
    },
})
</script>
