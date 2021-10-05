<template>
    <div class="w-full">
        <span class="btn btn-primary m-1" @click="$emit('next', { comp : 'ChatAddDirect'})">
            <font-awesome-icon title="Search" class="cursor-pointer text-2xl m-2" icon="search" ></font-awesome-icon>
            Find user
        </span>
        <ChatDirectList
            class="w-full"
            :channels="getChannels"
            @joinChannel="joinChannel"
            />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    fetch() {
        this.$store.dispatch('directChannel/fetchAll')     
    },
    computed : {
        getChannels()
        {
            let data = this.$store.getters["directChannel/all"]
            return data
        },
    },
    methods : {
        joinChannel(channel : any)
        {
            this.$emit("next", { comp : "ChatDirectSingle", props : { channel : channel }})
        },
        deleteChannel(channelId : string)
        {

        }
    }
})
</script>