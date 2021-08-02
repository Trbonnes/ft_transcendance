<template>
	<div>
		<div class="navbar shadow-lg bg-neutral text-neutral-content">
			<div class="flex-none px-2 mx-2">
			    <span class="text-lg font-bold">
	            Ft_Transcendance
	        	</span>
			</div> 
  		<div class="flex-1 px-2 mx-2">
    		<div class="items-stretch hidden lg:flex">
    	  		<NuxtLink to='/' class="btn btn-ghost btn-sm rounded-btn">
    	          Home
    	        </NuxtLink> 
    	  		<NuxtLink to='/game' class="btn btn-ghost btn-sm rounded-btn">
    	          Play
    	        </NuxtLink> 
    	  		<a class="btn btn-ghost btn-sm rounded-btn">
    	          Friends
    	        </a>
    	  		<a class="btn btn-ghost btn-sm rounded-btn">
				  Leaderboard
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
			<div class="dropdown dropdown-end">
    		<div class="avatar" tabindex="0">
     			<div class="rounded-full w-10 h-10 m-1">
        		<img :src="loggedInUser.avatar">
      			</div>
    		</div>
			<ul tabindex="0" class="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52">
          		<li>
           			<a>Profile</a>
         		</li> 
          		<li>
            		<a>Settings</a>
          		</li>
          		<li>
            		<a>Log Out</a>
          		</li>
        	</ul>
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