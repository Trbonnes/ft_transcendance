<template>
<div>
	<h1> You are signed in!! </h1>
	<button @click = "userLogout"> log out </button>
	<button @click = "fetch"> getUser </button>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	methods: {
		async userLogout() {
			try {
				let response = await this.$auth.logout();
			} catch (err) {
				console.log(err);
			}
		},

		async fetch() {
			const user = await fetch('http://localhost:3000/auth/user',
			{credentials: 'include'}
			).then(res => res.json());
		}
	}

})
</script>

<style>
</style>
