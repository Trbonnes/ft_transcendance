<template>
	<div>
		<div @click.prevent="updateFriendStatus">
			<p>lol</p>
			<button v-if="friendStatus === 0" class="btn btn-primary">
				Add Friend
			</button>
			<button v-if="friendStatus === 1" class="btn btn-secondary">
				Remove Friend
			</button>
			<button v-if="friendStatus === 2" class="btn btn-info">
				Accept Request
			</button>
			<button v-if="friendStatus === 3" class="btn btn-primary" disabled="disabled">
				Request sent
			</button>
		</div>
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {Component, Prop} from 'nuxt-property-decorator'

	@Component
	export default class FriendButton extends Vue {
		@Prop({required: true}) friendStatus: any	

		updateFriendStatus() {
			this.$emit('update', this.friendStatus)	
		}
	}
</script>

<style scoped>

</style>