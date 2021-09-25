
<template>
    <div class="w-full flex flex-col items-center justify-around">
        <ChannelList />
        <div class="relative sideComponent" :class='{"show" : showCreate || showJoin}'>
            <CreateChannel v-on:back='showCreate = false' class="w-full h-full"/>
            <JoinPrivate v-on:back='showJoin = false' class="w-full h-full"/>
            <!-- TODO make it not render the component on the side maybe ? -->
        </div>
        <span class="cursor-pointer flex flex-row items-center justify-center h-7 text-xl font-bold" @click='showCreate = true'>
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
        toggelShowCreate()
        {
            this.showCreate = !this.showCreate
        }
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