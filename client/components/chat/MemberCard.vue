<template>
    <div>
        <div class="p-3 my-1 flex flex-row items-center justify-between rounded-xl bg-gray-300"
            :class="{'bg-green-400' : membership.user.id === $auth.user.id}">
            <img class="w-16 h-16 rounded-full" :src="membership.user.avatar" :alt="membership.user.displayName">
            <span>
                <font-awesome-icon v-if="membership.userId === channel.owner.id"  class="text-xl mx-1.5" icon="crown"> </font-awesome-icon>
                <font-awesome-icon v-else-if="membership.isAdmin"  class="text-xl mx-1.5" icon="user-shield"> </font-awesome-icon>
                {{membership.user.displayName}}
            </span>
            <div v-if="isCurrentAdmin && membership.user.id !== $auth.user.id && !isActiveTimeout" class="flex flex-row">
                <span v-if="membership.isAdmin && channel.owner.id !== membership.userId" @click="$emit('makeOwner', membership.user.id)" class="btn btn-accent mx-1">Transfer</span>
                <span v-if="!membership.isAdmin" @click="$emit('makeAdmin', membership.user.id )" class="btn btn-accent mx-1">Admin</span>
                <span v-else-if="membership.isAdmin && membership.userId !== channel.owner.id" @click="$emit('unmakeAdmin', membership.user.id )" class="btn btn-secondary mx-1">Remove Admin</span>
                <span v-if="membership.user.id !== channel.owner.id" @click="$emit('banMember', membership.user.id)" class="btn mx-1">Ban</span>
            </div>
            <div class="font-bold text-red-700" v-else-if="isActiveTimeout">
              Banned for {{timeoutValue}}
              <span v-if="isCurrentAdmin"  @click="$emit('unbanMember', membership.user.id)" class="btn mx-1">Unban</span>
            </div>
            <div v-else></div>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props : ['membership', 'channel', 'currentDate', 'isCurrentAdmin'],
    data(){
        return {
            time : 1,
        }
    },
    computed: {
        isActiveTimeout()
        {
            return (this.membership as any).timeout && (new Date((this.membership as any).timeout.end) >= this.currentDate || ((this.membership as any).timeout.start === (this.membership as any).timeout.end))
        },
        timeoutValue()
        {
            if ((this.membership as any).timeout.start === (this.membership as any).timeout.end)
                return "forever"
            let diffDate = (new Date((this.membership as any).timeout.end) as any) - (this.currentDate as any)
            let diffSeconds = Math.round(diffDate / 1000)
            if (diffSeconds > 3600)
                return Math.ceil(diffSeconds/3600) + "h"
            else if (diffSeconds > 60)
                return Math.ceil(diffSeconds/60) + "min"
            else
                return diffSeconds + "s"
        }
    },
    methods: {
        
    },
})
</script>
