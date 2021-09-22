<template>
    <div>
        <div class="p-3 my-1 flex flex-row items-center justify-between rounded-xl bg-gray-300"
            :class="{'bg-green-400' : membership.user.id === $auth.user.id}">
            <img class="w-16 h-16 rounded-full" :src="membership.user.avatar" :alt="membership.user.displayName">
            <span>{{membership.user.displayName}}</span>
            <div v-if="channel.owner.id === $auth.user.id && membership.user.id !== $auth.user.id && !isActiveTimeout" class="flex flex-row">
                <span @click="$emit('makeAdmin', membership.user.id )" class="btn btn-accent mx-1">Admin</span>
                <span @click="$emit('banMember', {memberId : membership.user.id, time : time})" class="btn mx-1">Ban</span>
            </div>
            <div class="font-bold text-red-700" v-else-if="isActiveTimeout">
              Banned for {{timeoutValue}}
              <span  @click="$emit('unbanMember', membership.user.id)" class="btn mx-1">Unban</span>
            </div>
            <font-awesome-icon v-if="channel.owner.id === membership.user.id"  class="text-xl mx-1.5" icon="crown"> </font-awesome-icon>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props : ['membership', 'channel', 'currentDate'],
    data(){
        return {
            time : 1,
        }
    },
    computed: {
        isActiveTimeout()
        {
            return this.membership.timeout && new Date(this.membership.timeout.end) >= this.currentDate
        },
        timeoutValue()
        {
            if (this.membership.timeout.start === this.membership.timeout.end)
                return "forever"
            let diffSeconds = Math.round((new Date(this.membership.timeout.end) - this.currentDate) / 1000)
            if (diffSeconds > 60)
                return Math.ceil(diffSeconds/60) + "min"
            return diffSeconds + "s"
        }
    },
    methods: {
        
    },
})
</script>
