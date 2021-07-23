<template>
    <div>
        <div class="flex flex-row w-10/12 text-2xl p-2 m-5 shadow cursor-pointer" @click="$emit('select', c.id)" v-for="c in channels">
            <font-awesome-icon v-if='c.users.length > 1' icon="users"/>
            <font-awesome-icon v-else icon="user"/>
            <div v-if="c.users.length > 1">
                <span>{{c.users.slice(0,3).join(', ')}}{{c.users.length > 3 ? ` and ${c.users.length - 3} others` : ""}}</span>    
            </div>
            <div v-else>
                <span >{{c.users[0]}}</span>
            </div>
        </div>
        <font-awesome-icon icon="plus" @click="createChannel"/>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {Channel} from '~/utils/types'

export default Vue.extend({
    data() {
        return {
            channels : [] as Channel[]
        }
    },
    created()
    {
        this.channels = this.$store.getters["chat/getAll"]
    },
    methods : {
        createChannel()
        {
            console.log(this.$store)
            console.log("Click to create a channel")
            let c : Channel = {id : "2", users :["Zeubi", "Triste"], name: "", admin: "Bob", messages :[{sender : "Bob", content : "Hello"}]};
            this.$store.dispatch("chat/createChannel",c)
        }
    }
}) 
</script>
