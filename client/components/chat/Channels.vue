
<template>
    <div class="w-full flex flex-col items-center justify-around">
        <ChannelList :channels="getChannels" v-on:select="selectChannel" />
        <CreateChannel v-on:back='showCreate = false' class="sideComponent w-full h-full" :class='{"show" : showCreate}'/>
        <JoinPrivate @back='showJoin = false' @joinPrivate="joinChannel" class="sideComponent w-full h-full" :class='{"show" : showJoin}'/>
        <Conversation :messages="getMessages" @sendMessage="sendMessage" />
        <!-- TODO make it not render the component on the side maybe ? -->
        <span class="cursor-pointer flex flex-row items-center justify-center h-7 text-xl font-bold" @click='showCreate = true'>
            Create channel
          <font-awesome-icon title="Create channel" icon="plus-square"></font-awesome-icon>
        </span>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Channel, CreateChannelDto } from '~/utils/types'

export default Vue.extend({
    data()
    {
        return {
            showJoin : false,
            showCreate : false,
            showConvo : false,
            channelId : '' as string
        }
    },
    computed : {
        getChannels()
        {
            return this.$store.getters["channel/all"]
        },
        getMessages()
        {

        }
    },
    methods : 
    {
        selectChannel(c : Channel)
        {
            this.channelId = c.id
            this.joinChannel()
        },
        createChannel() {
          const data: CreateChannelDto = { // TODO remove DTO, kinda overkill, types that are used only one time don't need to be defined elsewhere
            isPublic: !this.isPrivate,
            channelPassword: this.channelPassword,
            channelName: this.channelName,
          }
          this.$store
            .dispatch('channel/create', data)
            .then((data : any) => {
              if (data.status)
              {
                this.$toast.error(data.message)
              }
              else
              {
                this.$toast.success("Channel created")
                this.showCreate = false
              }
            })
            .catch((error: any) => {
            })
        },
        joinChannel(password? : string)
        {
            console.log(password)
          this.$axios.$post(`/channel/${this.channelId}/join`, { password: password })
            .then((rep : any) => {
                console.log(rep)
                if (rep.status === 201)
                {
                    this.showJoin = false // will be hidden no matter what

                }
                else
                {
                    if (rep.status === 401)
                        this.showJoin = true
                    this.$toast.error(rep.message)
                }
            })
            .catch((error) => {
                // TODO error handling
            })
        },
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