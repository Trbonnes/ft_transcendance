<template>
	<div>
		<div>
			<div>
				<font-awesome-icon icon="user"/>
			</div>
			<div>
			</div>
			<div>
			</div>
		</div>	
	</div>
</template>
<script>
import Vue from 'vue'

export default Vue.extends({
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