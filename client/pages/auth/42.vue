<template>
<div class="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
	style="background-image: url(https://www.imaginarycloud.com/blog/content/images/2019/02/Pong.jpg);">
	<div class="absolute bg-black opacity-60 inset-0 z-0"></div>
	<div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
		<div class="text-center">
			<div v-if="twoFactorAuthentication === false">
				<h1> Connecting... </h1>
			</div>
			<div v-else class="text-gray-500">
				<h1> Please enter the two factor authentication code you received on your 42 email </h1>
				<form @submit.prevent="login">
					<input type="text" class="rounded border border-grey-900" v-model="twoFactorCode">
					<button type="submit">Sign in</button>
				</form>
			</div>
		</div>
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
				if (code !== '') {
					this.$auth.loginWith('localrefresh', {
						data : {
							code: !this.twoFactorAuthentication ? code : 'twoFactorAuthenticationActivated',
							twoFactorCode: this.twoFactorCode
						}
					}).then(() => {
						this.$router.replace('/');
						this.$toast.success("You are logged in!")
					}).catch((error) => {
						if (error.response.data.type === 'missing_twofactor') {
							this.twoFactorAuthentication = true;
						}
						else if (error.response.data.type === 'wrong_twofactor') {
							this.$toast.error("Wrong 2FA code");
						} else {
							this.$router.push('/');
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