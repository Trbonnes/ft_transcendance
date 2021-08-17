<template>
	<div>
		<div>
			<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold"> Mighty Challengers Ranked by Wins </h1>
		</div>
		<div class="" v-for="(user, rank) in sortedUsers" :key="`${user}.id`">
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
		users: any[] = []
		
		async fetch() {
			this.users = await this.$axios.$get('/users')
		}

		get sortedUsers() : any[] {
			return this.users.sort((a, b) => {
				return (a.victory < b.victory ? 1 : -1)
			})
		}
	}
</script>

<style scoped>

</style>