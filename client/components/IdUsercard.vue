<template>
	<div v-if="user">
		<NuxtLink :to="`/users/${user.login}`" class="card bg-accent-focus shadow m-5">
		  <div class="card-body">
			  <div class="flex">
				<p class="flex mx-left self-center m-3">{{index}}</p>
				<div class="avatar">
  					<div class="m-3 rounded-full w-24 h-24">
    					<img :src="user.avatar">
  					</div>
				</div> 
				<div class="flex mx-left ml-5 self-center">
					<p class="m-3">{{ user.displayName }}</p>
					<p class="m-3">Wins: {{ user.victory }}</p>
					<p class="m-3">Defeats: {{ user.defeat }}</p>
					<p v-if="user.game_id" class="m-3">Status: in-game</p>
					<p v-else-if="user.isActive" class="m-3">Status: online</p>
					<p v-else class="m-3">Status: offline</p> 
				</div>
			  </div>
		  </div>
		</NuxtLink> 
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {Component, Prop} from "nuxt-property-decorator"

	@Component
	export default class IdUserCard extends Vue {
		@Prop({required: true}) userId: any
		@Prop({required: true}) index: any

		user:any = null;

		mounted() {
			this.fetchUser();
		}
		
		async fetch() {
			this.user = await this.$axios.$get('/users/' + this.userId)
		}

		async fetchUser() {
			this.user = await this.$axios.$get('/users/' + this.userId)
		}

	}
</script>

<style scoped>

</style>