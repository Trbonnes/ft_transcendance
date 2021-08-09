<template>
	<div>
		<div class="card shadow">
		  <div class="card-body">
		    <h2 class="card-title">no border with shadow</h2> 
		    <p>Rerum reiciendis beatae tenetur excepturi</p>
		  </div>
		</div> 
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import {Component, Prop} from "nuxt-property-decorator"

	@Component
	export default class UserCard extends Vue {
		@Prop({required: true}) user: any
		
	}
</script>

<style scoped>

</style>