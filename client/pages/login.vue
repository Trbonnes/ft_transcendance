<template>
<div class="relative min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat bg-cover relative items-center"
	style="background-image: url(https://www.imaginarycloud.com/blog/content/images/2019/02/Pong.jpg);">
	<div class="absolute bg-black opacity-60 inset-0 z-0"></div>
	<div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
		<div class="text-center">
			<h2 class="mt-6 text-3xl font-bold text-gray-900">
				Welcome to ft_transcendance!
			</h2>
			<p class="mt-2 text-sm text-gray-600">Please sign in to your account</p>
		</div>
		<div class="flex items-center justify-center space-x-2">
			<span class="h-px w-16 bg-gray-300"></span>
			<span class="text-gray-500 font-normal">OR</span>
			<span class="h-px w-16 bg-gray-300"></span>
		</div>
		<form  @submit.prevent = "userLogin" class="mt-8 space-y-6">
			<input type="hidden" name="remember" value="true">
			<div class="relative">
				<label class="text-sm font-bold text-gray-700 tracking-wide">Email</label>
				<input class=" w-full text-base py-2 border-b border-gray-300 focus:outline-none 
				focus:border-indigo-500" v-model="login.email" type="text" placeholder="mail@gmail.com">
            </div>
			<div class="mt-8 content-center">
				<label class="text-sm font-bold text-gray-700 tracking-wide">
					Password
				</label>
				<input class="w-full content-center text-base py-2 border-b border-gray-300 
				focus:outline-none focus:border-indigo-500" 
				v-model="login.password" type="password" placeholder="Enter your password">
            </div>
			<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input id="remember_me" name="remember_me" type="checkbox" class="h-4 w-4 bg-indigo-500 focus:ring-indigo-400 border-gray-300 rounded">
						<label for="remember_me" class="ml-2 block text-sm text-gray-900">
                            Remember me
                        </label>
					</div>
				<div class="text-sm">
					<a href="#" class="font-medium text-indigo-500 hover:text-indigo-500">
								Forgot your password?
					</a>
				</div>
			</div>
			<div>
				<button type="submit" class="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                    Sign in
                </button>
			</div>
		</form>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data() {
		return {
			login: {
				username: '',
				password: ''
			}
		}
	},

	methods: {
		async userLogin() {
			try {
				let response = await this.$auth.loginWith('local', {data: this.login});
				console.log(response);
			} catch (err) {
				console.log(err);
			}
		}
	}

})
</script>

<style>
</style>
