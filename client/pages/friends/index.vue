<template>
	<div>
		<div v-if="receivedRequests.length > 0">
			<div>
				<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold"> Friend Requests </h1>
			</div>
			<div class="" v-for="(request, number) in receivedRequests" :key="`${request}.sender.id`">
				<Usercard :user="request.sender" :index="number + 1"/>
			</div>
		</div>
		<div>
			<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold"> Your Friends </h1>
		</div>
		<div class="" v-for="(friendId, number) in this.$auth.user.friends" :key="`${friendId}`">
			<IdUsercard :userId="friendId" :index="number + 1"/>
		</div>
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {Component} from 'nuxt-property-decorator'

	@Component(
		{
			middleware: ['auth']
		}
	)
	export default class Leaderboard extends Vue {

		mounted() {
			if (this.$auth.loggedIn)
				this.$auth.fetchUser()
		}

		friendsRequests: any[] = []
		userFriends: any[] = []
		
		async fetch() {
			this.friendsRequests = await this.$axios.$get('/friends/requests')
		}

		get receivedRequests() : any[] {
			return this.friendsRequests.filter(request => request.receipient.id === (this.$auth.user as any).id)
		}
	}
</script>

<style scoped>

</style>