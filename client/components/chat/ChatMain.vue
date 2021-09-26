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
    mounted(){
        this.timer = setInterval( this.refresh, 30000)
        console.log(this.channelRoute)
    },
    destroyed()
    {
        clearInterval(this.timer)
    },
    computed : {
        currentRoute()
        {
            console.log(this.channelRoute)
            return this.channelRoute[this.channelRoute.length - 1]
        },
        currentComponent()
        {
            return this.currentRoute.comp
        },
        currentProps()
        {
           if (this.currentRoute.props) 
               return this.currentRoute.props
            return []
        }
    },
    methods : {
        back()
        {
            this.channelRoute.pop()
        },
        next(data : {comp : string, props?: [{[key: string] : any}]})
        {
            this.channelRoute.push({
                comp : data.comp,
                props : data.props
            })
        },
        replace(data : {comp : string, props?: [{[key: string] : any}]})
        {
           this.back()
           this.next(data) 
        },
        toggleChat()
        {
            this.chatHidden = !this.chatHidden
            this.refresh()
        },
        refresh()
        {
            if (this.chatHidden === false)
            {
                this.$store.dispatch('channel/fetchAll')
            }
        }
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
    width: 20vw;
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
    right: -20vw;
}

#chatMain 
{
    position: fixed;
    height: 100vh;
}
</style>