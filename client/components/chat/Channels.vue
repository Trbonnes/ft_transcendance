
<template>
    <div class="w-full flex flex-col items-center justify-around">
        
        <ChatChannelList :channels="getChannels" v-on:select="joinChannel" />
        <span class="cursor-pointer flex flex-row items-center justify-center h-7 text-xl font-bold" @click='$emit("next", { comp : "ChatCreateChannel" })'>
            Create channel
          <font-awesome-icon title="Create channel" icon="plus-square"></font-awesome-icon>
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Channel, CreateChannelDto } from '~/utils/types'

export default Vue.extend({
    fetch()
    {
        this.$store.dispatch("channel/fetchAll") //triggers 401 when login wth 42 auth
    },
    computed : {
        getChannels()
        {
            return this.$store.getters["channel/all"]
        },
    },
    methods : 
    {
        joinChannel(channelId : string)
        {
          this.$axios.$post(`/channel/${channelId}/join`)
            .then((rep : any) => {
                console.log(rep)
                if (rep.status === 201)
                    this.$emit("next", { comp : "ChatChannelSingle", props : { channelId : channelId } })
                else
                {
                    if (rep.status === 401)
                        this.$emit("next", { comp : "ChatJoinPrivate", props : { channelId : channelId }})
                    this.$toast.error(rep.message)
                }
            })
            .catch((error) => {
                // TODO error handling
            })
        },
        sendMessage()
        {}
    }
})
</script>

<style>
    .sideComponent{
        top: 0;
        height: 100%;
        width: 100%;
        left:100%;
        transition: all .2s;
        @apply absolute;
    }
    .sideComponent.show{
        left: 0%;
    }
</style>