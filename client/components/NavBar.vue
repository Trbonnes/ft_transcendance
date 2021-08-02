<template>
	<div>
		<div class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box">
			<div class="flex-none px-2 mx-2">
			    <span class="text-lg font-bold">
	            Ft_Transcendance
	        	</span>
			</div> 
  		<div class="flex-1 px-2 mx-2">
    		<div class="items-stretch hidden lg:flex">
    	  		<a class="btn btn-ghost btn-sm rounded-btn">
    	          Home
    	        </a> 
    	  		<a class="btn btn-ghost btn-sm rounded-btn">
    	          Play
    	        </a> 
    	  		<a class="btn btn-ghost btn-sm rounded-btn">
    	          Friends
    	        </a>
    		</div>
  		</div> 
  		<div class="flex-none">
    		<button class="btn btn-square btn-ghost">
      		<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">             
        	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>             
      		</svg>
    		</button>
  		</div>
		<div class="flex-none">
    		<div class="avatar">
     			<div class="rounded-full w-10 h-10 m-1">
        		<img :src="loggedInUser.avatar">
      			</div>
    		</div>
  		</div>
	</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapGetters} from "vuex"

	export default Vue.extend ({
		computed: {
			...mapGetters(['isLoggedIn', 'loggedInUser']),
		},
	})
</script>

<style lang="scss" scoped>

</style>