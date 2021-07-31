<template>
	<div>
		<h1> Connecting... </h1>
	</div>
</template>

<script lang='ts'>
	import Vue from 'vue'

	export default Vue.extend({
		methods: {
			login() {
				const code = this.$route.query.code as string;
				if (code !== '') {
					this.$auth.loginWith('local', {
						data : {
							code: code
						}
					}).then(() => {
						this.$router.replace('/');
					}).catch((error) => {
						console.log(error);
					})
				}
				else {
					this.$router.push('/login');
				}
			}
		},

		mounted() {
			this.login();
		}
	})
</script>

<style  scoped>

</style>