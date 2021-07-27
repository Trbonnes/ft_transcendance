<template>
<div class="relative min-h-screen flex items-center justify-center
			bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 bg-gray-500 bg-no-repeat
			bg-cover relative items-center"
	style="background-image: url(https://www.imaginarycloud.com/blog/content/images/2019/02/Pong.jpg)">
	<div class="absolute bg-black opacity-60 inset-0 z-0"></div>
	<div class="max-w-lg w-full space-y-9 p-12 bg-white rounded-xl z-10">
		<div class="text-center">
			<h2 class="mt-6 text-2xl font-bold text-gray-900">
				Welcome to Ft_Transcendance!
			</h2>
			<p class="mt-2 text-sm text-gray-600">Please sign with 42 Oauth</p>
		</div>
			<div>
				<button type="submit" class="w-full flex justify-center bg-indigo-500 text-gray-100 p-4  rounded-full tracking-wide
                                font-semibold  focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg cursor-pointer transition ease-in duration-300">
                    Sign in
                </button>
			</div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
</style>
