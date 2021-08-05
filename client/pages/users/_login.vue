<template>
	<div>
		<section class="body-font">
  			<div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
    			<img class="lg:w-1/6 md:w-2/6 w-4/6 mb-10 object-cover object-center rounded " alt="hero" :src="user.avatar">
    				<div class="text-center lg:w-2/3 w-full">
      					<h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium">Challenger {{ user.displayName }} !</h1>
					<div class="flex flex-1 flex-row m-5 justify-center">
							<div class="card shadow compact m-3">
  								<div class="card-body">
 								   <h2 class="card-title">Victories</h2> 
   										<p>{{ user.victory }}</p>
  								</div>
							</div> 
							<div class="card shadow compact m-3">
  								<div class="card-body">
    								<h2 class="card-title">Defeats</h2> 
    								<p>{{ user.defeat }}</p>
  								</div>
							</div>
					</div>
      							<div class="flex justify-center">
        							<button class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Button</button>
        								<button class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Button</button>
      							</div>
    				</div>
  			</div>
		</section>

	</div>
</template>

<script lang='ts'>
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

	@Component
	export default class Profile extends Vue {

		user:any = null;

		mounted() {
			if (this.$auth.loggedIn)
				this.$auth.fetchUser()
		}

		async asyncData({app, params, error}: Context) {
			const user = await app.$axios.$get(`/users?login=${params.login}`)
				.catch(() => {
					error({
						statusCode: 404,
						message: `This user does not exist.`
					})
				})
			return ({user});
		}
		
	}
</script>

<style  scoped>

</style>