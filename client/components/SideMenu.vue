<template>
	<div>
		<h1>ok this is the sidebard</h1>
		<div class="flex flex-row w-full items-center justify-around">
			<div>
				<font-awesome-icon icon="globe"/>
			</div>
			<div>
				<font-awesome-icon icon="comment"/>
			</div>
			<div>
				<font-awesome-icon icon="users"/>
			</div>
		</div>	
	</div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			friends : [
				{name: "Bob", connected: true, status: "Don't worry be happy"},
				{name: "Marcel", connected: true, status: "It's time to get funky"},
				{name: "Giovanni", connected: true, status: "Everybody calls me Giorgio"},
			]
		}
	},	
})
</script>
<style>
	
</style>
