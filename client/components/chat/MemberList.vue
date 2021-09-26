<template>
    <div>
        <MemberCard
            v-for="m in getMemberships"
            v-bind:key="m.id"
            :channel="channel"
            :membership="m"
            :isCurrentAdmin="isCurrentAdmin"
            :currentDate="currentDate"
            @banMember="banMember"
            @makeAdmin="makeAdmin"
            @unbanMember="unbanMember"
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
            timer : null as any
        }
    },
    fetch()
    {
        this.$store.dispatch("channel/getMembers", this.channel.id) // TODO loading animation ?
    },
    created()
    {
        console.log("We are live")
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
        fetchMembers()
        {
          this.$store.dispatch("channel/getMembers", this.channel.id) // TODO loading animation ?
        },
        makeAdmin(userId : string)
        {
          this.$axios.post(`/channel/${this.channel.id}/members/${userId}/makeAdmin`)
          .then((rep : any) => {
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
        banMember(data : { memberId: string, time : number}) // time in minute, the default value is the max value for forever ban
        {
          this.$axios.post(`/channel/${this.channel.id}/ban`, { userId : data.memberId, duration : data.time})
          .then((rep : any) => {
            if (rep.data.status && rep.data.status != 201)
              this.$toast.error(rep.data.message)
            else
              this.$toast.success("User banned")
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
    
</style>