
<template>
    <div class="w-full flex flex-col items-center justify-around">
        <ChannelList />
        <div class="relative sideComponent" :class='[showJoin || showCreate ? "show" : "hidden"]'>
            <CreateChannel v-on:back='showCreate = false' id="joinForm" v-if="showCreate"/>
            <JoinPrivate v-on:back='showJoin = false' v-if="showJoin"/>
        </div>
        <span class="cursor-pointer flex flex-row items-center justify-center h-7 text-xl font-bold" @click='showJoin = true'>
            Create channel
          <font-awesome-icon title="Create channel" icon="plus-square"></font-awesome-icon>
        </span>
    </div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
    data()
    {
        return {
            showJoin : false,
            showCreate : false
        }
    },
    methods : 
    {
    }
})
</script>

<style>
    .sideComponent{
        top: 0;
        height: 100%;
        width: 100%;
        left:0%;
        transition: all .2s;
        @apply absolute;
    }
    .sideComponent.hidden{
        transition: all .2s;
        left: 100%;
    }
    .sideComponent.show{
        transition: all .2s;
        left: 0%;
    }
    #joinForm
    {
        height: 100%;
        width: 100%;
    }
</style>