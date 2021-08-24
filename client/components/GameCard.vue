<template>
<div class="flex flex-grow w-full m-3">
	<div v-if="winner != null && loser != null" class="flex flex-grow w-full">
		<div class="card shadow flex flex-grow w-full">
		  <div class="card-body flex flex-grow w-full items-center" :class="{'bg-green-500 bg-opacity-75':isWinner, 'bg-red-500 bg-opacity-75':!isWinner}">
				<div v-if="isWinner">
					<p class="italic text-xs"> You Won ! </p>
				</div>
				<div v-else class="italic text-xs">
					<p> You Lost :( </p>
				</div>
			  <div class="flex">
				<div class="avatar">
  					<div class="m-3 rounded-full w-24 h-24">
    					<img :src="winner.data.avatar">
  					</div>
				</div> 
				<div class="flex mx-left ml-5 self-center">
					<p class="m-3">Winner : {{ winner.data.displayName }}</p>
				</div>
				<div class="avatar">
  					<div class="m-3 rounded-full w-24 h-24">
    					<img :src="loser.data.avatar">
  					</div>
				</div> 
				<div class="flex mx-left ml-5 self-center">
					<p class="m-3">Opponent : {{ loser.data.displayName }}</p>
				</div>
			  </div>
		  </div>
		</div> 
	</div>
</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {Component, Prop} from "nuxt-property-decorator"

	@Component
	export default class Gamecard extends Vue {
		@Prop({required: true}) game: any
		@Prop({required: true}) user: any
		
		winner:any = null;
		loser:any = null;

		show() {
			console.log(this.winner.data.avatar);
		}

		async fetch() {
			this.winner = await this.$axios.get(`users/${this.game.winner_id}`)
			this.loser = await this.$axios.get(`users/${this.game.loser_id}`)
		}

		get isWinner():boolean {
			if (this.winner.data.id === this.user.id)
				return true;
			else
				return false;
		}

	}

</script>

<style scoped>

</style>