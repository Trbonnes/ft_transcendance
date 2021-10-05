<template>
    <div id="gnotif" class="fixed " :class="{ 'show' : show, 'out' : out}">
        <div class="relative w-full h-full flex flex-col items-center justify-center">
            <div v-if="user !== null" class="font-bold text-lg mb-2">
                {{user.displayName}} wants to play with you
            </div>
            <div class="flex flex-row">
                <span class="btn btn-accent m-1" @click="acceptGame">Accept</span>
                <span class="btn m-1" @click="ignoreGame">Ignore</span>
            </div>
            <span id="progress"></span>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data()
    {
        return {
            user : null as any,
            show : false,
            notifs : [] as { userId : string, link : string}[],
            timeout : null as any,
            out : true
        }
    },
    computed : {
        getFirstNotification()
        {
            return (this.$store.getters["directChannel/getGameNotifications"] as any[])[0]
        },
    },
    watch : {
        getFirstNotification(notif : any)
        {
            if (!notif)
                return
            this.$store.commit('directChannel/shiftGameNotification')
            if(this.$auth.user && notif.userId !== this.$auth.user.id && (this.$auth as any).user.blockedUsers.find((u : any) => u.id === notif.userId) === undefined) // TODO not very clean to do here
            {
                this.notifs.push(notif)
                this.executeTimeouts()
            }
        }
    },
    methods: {
        async executeTimeouts()
        {
            if (this.timeout !== null || this.notifs.length === 0)
                return
            console.log( "before " , this.notifs)
            await this.fetchUser(this.notifs[0].userId)
            console.log(this.user)
            this.show = true
            this.out = false
            this.timeout = setTimeout(() => {
                this.show = false
                setTimeout(() => {this.out = true}, 400)
                setTimeout(() => {
                    this.user = null
                    this.notifs.shift()
                    this.timeout = null
                    this.executeTimeouts()
                }, 700)
            }, 5000)
        },
        async fetchUser(userId : string)
        {
			this.user = await this.$axios.$get(`/users/${userId}`)
        },
        acceptGame() {
            if (this.notifs[0].link) {
                this.$router.push(`${this.notifs[0].link}`)
                this.notifs.shift()
            }
            this.show = false
        },
        ignoreGame() {
            this.show = false
            this.notifs.shift()
        }
    },
})
</script>
<style>
    #gnotif
    {
        transition: all .4s;
        bottom: -50em;
        height: 9em;
        width: 30vw;
        left: 35vw;
        @apply fixed bg-white rounded-xl;
    }
    #gnotif.show {
        bottom: 2em;
    }
    
    #gnotif #progress {
        height: 0.7em;
        width: 100%;
        transition: all 4.8s;
        transition-delay: .4s;
        @apply absolute block bottom-0 bg-purple-600 rounded-xl;
    }

    #gnotif.show #progress
    {
        width: 0%;
    }
    
    #gnotif.out #progress
    {
        transition : none !important;
        width: 100%;
    }
</style>