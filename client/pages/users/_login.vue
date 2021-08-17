<template>
	<div>
		<section class="body-font">
  			<div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
    			<img class="lg:w-1/6 md:w-2/6 w-4/6 mb-3 object-cover object-center rounded " alt="hero" :src="user.avatar">
				<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-5" v-if="this.$auth.loggedIn && this.$auth.user.id === user.id">
					Change avatar </button>
    				<div class="text-center lg:w-3/3 w-full">
      					<h1 class="title-font sm:text-4xl text-3xl mb-2 font-medium">Lord {{ user.displayName }}</h1>
						<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-5" v-if="this.$auth.loggedIn && this.$auth.user.id === user.id">
							Change display name </button>
						  <p class="sm:text-sm">Level: {{ user.level }}</p>
					<div class="flex flex-1 flex-row m-5 justify-center">
							<div class="card shadow compact m-3 flex-grow">
  								<div class="card-body">
 								   <h2 class="card-title">Victories</h2> 
   										<p>{{ user.victory }}</p>
  								</div>
							</div> 
							<div class="card shadow compact m-3 flex-grow">
  								<div class="card-body">
    								<h2 class="card-title">Defeats</h2> 
    								<p>{{ user.defeat }}</p>
  								</div>
							</div>
					</div>
      							<div class="flex justify-center">
        							<button v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Challenge</button>
        								<button v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id" class="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg">Add as friend</button>
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