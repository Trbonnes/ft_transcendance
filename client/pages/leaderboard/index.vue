<template>
	<div>
		<div>
			<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold"> Mighty Challengers Ranked by Wins </h1>
		</div>
		<div class="" v-for="(user, rank) in sortedUsers" :key="`${user.id}`">
			<Usercard :user="user" :index="rank + 1"/>
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
			this.updateStats();
		}

		users: any[] = []
		
		async fetch() {
			this.users = await this.$axios.$get('/users')
		}

		async updateStats() {
			let allUsers = await this.$axios.$get('/users');
			for (var user of allUsers) {
				if ((user as any).id !== undefined) {
					await this.$axios.$get(`/game/user/${(user as any).id}`);
				}
			}
			this.users = await this.$axios.$get('/users');
		}

		//show() {
		//	console.log(this.sortedUsers);
		//}

		get sortedUsers() : any[] {
			return this.users.sort((a, b) => {
				return (a.victory < b.victory ? 1 : -1)
			})
		}
	}
</script>

<style scoped>

</style>