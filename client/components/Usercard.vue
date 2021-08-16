<template>
	<div>
		<NuxtLink :to="`/users/${user.login}`" class="card shadow m-5">
		  <div class="card-body">
			  <div class="flex">
				<p class="flex mx-left self-center m-3">{{rank}}</p>
				<div class="avatar">
  					<div class="m-3 rounded-full w-24 h-24">
    					<img :src="user.avatar">
  					</div>
				</div> 
				<div class="flex mx-left ml-5 self-center">
					<p class="m-3">{{ user.displayName }}</p>
					<p class="m-3">Wins: {{ user.victory }}</p>
					<p class="m-3">Defeats: {{ user.defeat }}</p>
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
	export default class UserCard extends Vue {
		@Prop({required: true}) user: any
		@Prop({required: true}) rank: any
		
	}
</script>

<style scoped>

</style>