<template>
    <div id="chatMain">
        <div id="openChat"  @click="toggleChat">
          <font-awesome-icon title="Chat" class="text-4xl" icon="comments"></font-awesome-icon>
        </div>
        <div id="main" :class='{ "hidden-right" : chatHidden}'>
            <div class="w-full flex flex-row justify-center">
              <font-awesome-icon title="Chat" class="cursor-pointer text-4xl m-2" icon="times" @click="toggleChat"></font-awesome-icon>
              <span>Messages</span>
            </div>
            <div class="flex flex-row items-center justify-center font-bold text-xl justify-evenly">
                <div @click='component = "ChatChannels"' class="cursor-pointer">
                  <span>Channels</span>
                </div>
                <div @click='component = "ChatDirectList"' class="cursor-pointer">
                  <span>Direct chat</span>
                </div>
            </div>
            <ChatGoBack @click.native="back"/>
            <component @back="back" @replace="replace" @next="next" :is='this.currentComponent' v-bind="currentProps"></component>
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
            chatHidden : false,
            timer : null as any
        }
    },
    created()
    {
        let sock = getSocket()
        let exitChannel = (channelId : string) => {
            console.log("props : " , this.currentProps)
            console.log(channelId)
            if (this.channelRoute.length > 1
                && this.channelRoute[1].comp === "ChatChannelSingle"
                && this.channelRoute[1].props.channelId === channelId)  // we only reset if we are in the channel
            {
                console.log("reseting the route")
                console.log(this.currentComponent)
                this.resetRoute()
                console.log(this.currentComponent)
            }
        }
        let interval = setInterval(() => { // setting interval, the socket might not be connected, TODO maybe use the on connected event ?
            if (sock.connected)
            {
                console.log('The socket is connected')
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
            return this.channelRoute
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
            console.log(this.channelRoute)
            this.channelRoute.splice(1, this.channelRoute.length)
            console.log(this.channelRoute)
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
    width: 40vw;
    height: 100vh;
    top: 0;
    right: 0vw;
    background-color: white;
    z-index: 9999;
    transition: all 0.3s;
    @apply shadow-2xl;
}

#main.hidden-right
{
    right: -40vw;
}

#chatMain 
{
    position: fixed;
    height: 100vh;
}
</style>