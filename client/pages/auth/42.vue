<template>
	<div>
		<div v-if="twoFactorAuthentication === false">
			<h1> Connecting... </h1>
		</div>
		<div v-else>
			<h1> Please enter the two factor authentication code you received on your 42 email </h1>
			<form @submit.prevent="login">
				<input type="text" v-model="twoFactorCode">
				<button type="submit">Sign in</button>
			</form>
		</div>
	</div>
</template>

<script lang='ts'>
	import Vue from 'vue'

	export default Vue.extend({
		data() {
			return {
				twoFactorAuthentication: false,
				twoFactorCode: ''
			}
		},
		methods: {
			login() {
				const code = this.$route.query.code as string;
				console.log(code);
				if (code !== '') {
					this.$auth.loginWith('localrefresh', {
						data : {
							code: !this.twoFactorAuthentication ? code : 'twoFactorAuthenticationActivated',
							twoFactorCode: this.twoFactorCode
						}
					}).then(() => {
						this.$router.replace('/');
					}).catch((error) => {
						console.log(error);
						if (error.response.data.type === 'missing_twofactor') {
							this.twoFactorAuthentication = true;
						} else {
							this.$router.replace('/');
						}
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