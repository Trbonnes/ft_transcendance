<template>
    <div class="relative h-full flex flex-col items-center justify-start">
        <div id="banPanel" :class="{'hidden' : !showBanPanel}" class="absolute h-full w-full flex flex-col items-center justify-center">
          <div class="overlay"></div>
          <div class="bg-white w-3/4 z-50 flex flex-col items-center justify-center">
            <span class="block cursor-pointer flex items-center justify-start h-7 w-full" @click="toggleBanPanel">
                <font-awesome-icon class="text-xl mx-1.5" icon="times"></font-awesome-icon>
            </span> 
            <div id="timeoutList" class="w-9/12 flex flex-wrap justify-items-stretch">
              <span @click="banMember(1)">1min</span>
              <span @click="banMember(15)">15min</span>
              <span @click="banMember(30)">30min</span>
              <span @click="banMember(60)">1h</span>
              <span @click="banMember(240)">4h</span>
              <span @click="banMember(720)">12h</span>
              <span @click="banMember(1440)">24h</span>
              <span @click="banMember(0)">Forever</span>
            </div>
          </div>
        </div>
        <ChatMemberCard
            class="w-full"
            v-for="m in getMemberships"
            v-bind:key="m.id"
            :channel="channel"
            :membership="m"
            :isCurrentAdmin="isCurrentAdmin"
            :currentDate="currentDate"
            @banMember="toggleBanPanel"
            @makeAdmin="makeAdmin"
            @unmakeAdmin="unmakeAdmin"
            @unbanMember="unbanMember"
            @makeOwner="makeOwner"
          />
    </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    props: ["channel", "isCurrentAdmin"],
    data()
    {
        return {
            currentDate : new Date(),
            timer : null as any,
            showBanPanel : false,
            userBanId: ''
        }
    },
    fetch()
    {
        this.$store.dispatch("channel/getMembers", this.channel.id) // TODO loading animation ?
    },
    created()
    {
        this.timer = setInterval(() => { this.currentDate = new Date(); console.log("Interval")} , 1000)
    },
    destroyed()
    {
       clearInterval(this.timer) 
    },
    computed : {
        getMemberships()
        {
            return this.$store.getters["channel/members"](this.channel.id)
        },
    },
    methods: {
        toggleBanPanel(userId? : string)
        {
          if (userId)
            this.userBanId = userId
          else
            this.userBanId = ''
          this.showBanPanel = !this.showBanPanel
        },
        fetchMembers()
        {
          this.$store.dispatch("channel/getMembers", this.channel.id) // TODO loading animation ?
        },
        makeOwner(userId : string) // TODO maybe synthetize this in only one function
        {
          this.$axios.post(`/channel/${this.channel.id}/members/${userId}/makeOwner`)
          .then((rep : any) => {
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
              this.$toast.success("Ownership transfered")
            this.fetchMembers()
          })
          .catch((error : any) => {
              console.log(error)
              this.$toast.error("Cannot update member")
          })
        },
        unmakeAdmin(userId : string) // TODO maybe synthetize this in only one function
        {
          this.$axios.post(`/channel/${this.channel.id}/members/${userId}/unmakeAdmin`)
          .then((rep : any) => {
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
              this.$toast.success("Member is not an admin anymore")
            this.fetchMembers()
          })
          .catch((error : any) => {
              console.log(error)
              this.$toast.error("Cannot update member")
          })
        },
        makeAdmin(userId : string)
        {
          this.$axios.post(`/channel/${this.channel.id}/members/${userId}/makeAdmin`)
          .then((rep : any) => {
            console.log(rep)
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
              this.$toast.success("Member is now admin")
            this.fetchMembers()
          })
          .catch((error : any) => {
              console.log(error)
              this.$toast.error("Cannot update member")
          })
        },
        banMember(time : number) // time in minute, the default value is the max value for forever ban
        {
          this.$axios.post(`/channel/${this.channel.id}/ban`, { userId : this.userBanId, duration : time})
          .then((rep : any) => {
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
            {
              this.toggleBanPanel()
              this.$toast.success("User banned")
            }
            this.fetchMembers()
          })
          .catch((error : any) => {
              console.log(error)
              this.$toast.error("Cannot ban member")
          })
        },
        unbanMember(memberId: string) // time in minute, the default value is the max value for forever ban
        {
          this.$axios.post(`/channel/${this.channel.id}/unban`, { userId : memberId })
          .then((rep : any) => {
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
              this.$toast.success("User unbanned")
            this.fetchMembers()
          })
          .catch((error : any) => {
              console.log(error)
              this.$toast.error("Cannot unban member")
          })
        },
    },
})
</script>
<style>
    
    #banPanel>div.overlay
    {
      background-color: rgba(0, 0, 0, 0.7);
      @apply w-full h-full absolute z-30 
    }
    
    #timeoutList > span {

      @apply btn m-1;
    }
</style>