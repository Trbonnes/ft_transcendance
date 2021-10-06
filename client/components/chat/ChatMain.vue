<template>
    <div id="chatMain">
        <div id="openChat"  @click="toggleChat">
          <font-awesome-icon title="Chat" class="text-4xl" icon="comments"></font-awesome-icon>
        </div>
        <div id="main" class="flex flex-col items-center" :class='{ "hidden-right" : chatHidden}'>
            <div class="w-full flex flex-row items-center justify-center h-14 ">
                <div @click="toggleChat" class="absolute top-0 left-0 w-14 h-14 cursor-pointer bg-gray-100 hover:bg-gray-300 transition-all duration-500 flex flex-row items-center justify-center justify-self-start">
                  <font-awesome-icon title="Chat" class="text-4xl" icon="times" ></font-awesome-icon>
                </div> 
                <span class="text-2xl font-bold">Chat</span>
            </div>
            <div class="h-26 w-full flex flex-col items-center justify-center">
                <div class="flex flex-col w-3/4 items-start rounded-3xl shadow-md p-4">
                    <div class="flex flex-row justify-start w-full items-center ">
                        <img class="h-24 w-24 shadow-md rounded-full" :src="$auth.user.avatar" alt="Your avatar">
                        <span class="text-xl font-bold m-2">{{$auth.user.displayName}}</span>
                    </div>
                </div>
            </div>
            <div class="mt-14 w-full flex flex-row items-center justify-items-stretch font-bold text-xl">
                <div @click='currentTab = 0' class="tabMenu" :class="{'tabActive' : currentTab == 0}">
                  <span>Channels</span>
                </div>
                <div @click='currentTab = 1' class="tabMenu" :class="{'tabActive' : currentTab == 1}">
                  <span>Direct chat</span>
                </div>
            </div>
            <div class="cursor-pointer" :class="[ currentRoute.length === 1 ? 'opacity-0' : 'opacity-100']" @click="back">
                <font-awesome-icon title="Chat" class="text-4xl" icon="arrow-left"></font-awesome-icon>
            </div>
            <component class="w-11/12" @hide="toggleChat" @back="back" @replace="replace" @next="next" :is='this.currentComponent' v-bind="currentProps"></component>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { component } from 'vue/types/umd'
import { getSocket } from '~/store/plugins/websocket'

interface Route
{
    comp : string
    props? : {[key : string] : any}[]
}

export default Vue.extend({
    data()
    {
        return {
            channelRoute : [ { comp : 'ChatChannels' } ] as Route[],
            directRoute : [ { comp : 'ChatDirectChannels' } ] as Route[],
            currentTab : 0,
            chatHidden : true,
            timer : null as any
        }
    },
    created()
    {
        let sock = getSocket()
        let exitChannel = (channelId : string) => {
            if (this.channelRoute.length > 1
                && this.channelRoute[1].comp === "ChatChannelSingle"
                && this.channelRoute[1].props
                && (this.channelRoute[1].props as any).channelId === channelId)  // we only reset if we are in the channel
            {
                this.resetRoute()
            }
        }
        let interval = setInterval(() => { // setting interval, the socket might not be connected, TODO maybe use the on connected event ?
            if (sock.connected)
            {
                sock.on("channel/banned", exitChannel)
                sock.on("channel/destroyed", exitChannel)
                clearInterval(interval)
            }
        }, 500)
    },
    destroyed()
    {
        let sock = getSocket()
        sock.off("channel/banned")
        sock.off("channel/destroyed")
    },
    computed : {
        currentRoute()
        {
            switch (this.currentTab)
            {
                case 0: {
                    return this.channelRoute
                    break
                }
                case 1: {
                    return this.directRoute
                    break
                }
                default :{
                    break
                }
            }
        },
        topRoute()
        {
           return this.currentRoute[this.currentRoute.length - 1]
        },
        currentComponent()
        {
            return this.topRoute.comp
        },
        currentProps()
        {
           if (this.topRoute.props) 
               return this.topRoute.props
            return []
        }
    },
    methods : {
        back()
        {
            if (this.currentRoute.length > 1)
                this.currentRoute.pop()
        },
        next(data : {comp : string, props?: [{[key: string] : any}]})
        {
            this.currentRoute.push({
                comp : data.comp,
                props : data.props
            })
        },
        replace(data : {comp : string, props?: [{[key: string] : any}]})
        {
           this.back()
           this.next(data) 
        },
        resetRoute() // only reset the channel route
        {
            this.channelRoute.splice(1, this.channelRoute.length)
        },
        toggleChat()
        {
            this.chatHidden = !this.chatHidden
        },
    }
})
</script>
<style>

#openChat
{
    position: fixed;
    height: 5em;
    width: 5em;
    background-color: white;
    bottom: 1em;
    right: 1em;
    z-index: 9998;
    @apply text-black shadow-2xl flex flex-row items-center justify-center rounded-full cursor-pointer;
}

#main
{
    position: fixed;
    width: 25vw;
    height: 100vh;
    overflow-y: auto;
    top: 0;
    right: 0vw;
    background-color: white;
    z-index: 9999;
    transition: all 0.3s;
    @apply shadow-2xl;
}

#main.hidden-right
{
    right: -25vw;
}

#chatMain 
{
    position: fixed;
    height: 100vh;
}

.tabMenu
{
    @apply border-white border-t-2 border-r-2 border-l-2 cursor-pointer flex-1 flex flex-row justify-center;
}

.tabActive {
     @apply border-gray-200 rounded-lg rounded-b-none;
}

@media (max-width: 650px) {
  #main {
    width: 100vw;
  }
  #main.hidden-right {
    right: -100vw;
  }
}
@media (min-width: 650px) and (max-width: 1300px) {
  #main {
    width: 50vw;
  }
  #main.hidden-right {
    right: -50vw;
  }
}
</style>