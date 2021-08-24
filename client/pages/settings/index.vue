<template>
	<div>
		<div class="card shadow mx-auto">
  			<div class="card-body">
				  <div class="p-6 card bordered">
					<form @submit.prevent="toggleTwoFactor">
  					<div class="form-control">
   						 <label class="cursor-pointer label">
     					 <span class="label-text">Two Factor Authentication</span> 
      						<input type="checkbox" checked="checked" class="toggle toggle-primary" v-model="twoFactor">
							<button type="submit" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Save</button>
    					</label>
  					</div>
					</form>
				</div>
  			</div>
		</div>
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component } from "nuxt-property-decorator"

	@Component({
		middleware: ['auth']
	})
	export default class Settings extends Vue {

		twoFactor:boolean = false;

		mounted() {
			if (this.$auth.loggedIn)
				this.$auth.fetchUser()
			this.twoFactor = (this.$auth.user as any).twoFactor;
		}

		toggleTwoFactor() {
			this.$axios.patch(`users/me`, {
				twoFactor: this.twoFactor
			}).then(() => {
				this.$auth.fetchUser()
			}).catch((err) => {
				this.$toast.error("Error toggling two factor")
			})
		}
	}
</script>

<style lang="scss" scoped>

</style>