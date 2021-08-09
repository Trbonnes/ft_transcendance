<template>
	<div>

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