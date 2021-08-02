<template>
<div>
	<h1> You are signed in!! </h1>
	<button @click = "userLogout"> log out </button>
	<button @click = "consoleLogUser"> getUser </button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	middleware: 'auth',
	methods: {
		async userLogout() {
			try {
				let response = await this.$auth.logout()
				this.$router.replace('/login')
			} catch (err) {
				console.log(err);
			}
		},

		async consoleLogUser() {
			console.log(this.$auth.user)
		}
	}

})
</script>

<style>
</style>
