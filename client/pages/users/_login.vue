<template>
	<div>
		<section class="body-font">
  			<div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
    			<img class="lg:w-1/6 md:w-2/6 w-4/6 mb-3 object-cover object-center rounded " alt="hero" :src="user.avatar">
				<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-3"
						v-if="this.$auth.loggedIn && (this.$auth.user.id === user.id || this.$auth.user.role === 'admin' || this.$auth.user.role === 'superAdmin')"
						@click="toggleAvatarUploader">
					Change avatar </button>
				<avatar-uploader v-if="inputAvatarUpload" @imageUploaded="updateAvatar" :user="user" class="flex mb-3"/>
    			<div class="text-center lg:w-3/3 w-full">
     					<h1 class="title-font sm:text-4xl text-3xl mb-2 font-medium">{{ user.displayName }}</h1>
					<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-3"
							v-if="this.$auth.loggedIn && (this.$auth.user.id === user.id || this.$auth.user.role === 'admin' || this.$auth.user.role === 'superAdmin')"
							@click="toggleDisplayNameField">
						Change display name </button>
					<div v-if="inputDisplayName">
						<div class="form-control mb-3">
							<div class="flex space-x-2 justify-center">
								<input type="text" placeholder="Display Name" v-model="displayNameInput" class="input input-primary input-bordered"> 
							    <button @click="updateDisplayName" class="btn btn-primary">Save</button>
							</div>
						</div>
					</div>
					<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-5"
					v-if="this.$auth.loggedIn && this.$auth.user.role === 'superAdmin' && user.role === 'user'"
					@click="toggleAdmin">
					Make Admin </button>
					<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-sm mb-5"
					v-if="this.$auth.loggedIn && this.$auth.user.role === 'superAdmin' && user.role === 'admin'"
					@click="toggleAdmin">
					Remove Admin </button>
					<p class="sm:text-sm">Level: {{ user.level }}</p>
				</div>
				<div v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id">
					<friend-button @update="updateFriend" :friendStatus="friendStatus"/>
				</div>
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
				</div>
				<button @click="showuser"> click </button>
  			</div>
		</section>

	</div>
</template>

<script lang='ts'>
import { Context } from '@nuxt/types'
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import {FriendStatus} from '~/utils/enums/friends-request.enum'

	@Component
	export default class Profile extends Vue {

		user:any = null;
		friendRequests:any[] = [];
		inputDisplayName:boolean = false;
		displayNameInput:string = "";
		inputAvatarUpload:boolean = false;

		mounted() {
			if (this.$auth.loggedIn) 
				this.$auth.fetchUser()
		}

		toggleDisplayNameField() {
			this.inputDisplayName = !this.inputDisplayName;
		}

		toggleAvatarUploader() {
			this.inputAvatarUpload = !this.inputAvatarUpload;
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

		async fetch() {
			this.friendRequests = await this.$axios.$get(`/friends/requests`)
		}

		async fetchRequests() {
			this.friendRequests = await this.$axios.$get(`/friends/requests`)
		}

		async fetchUser() {
			this.user = await this.$axios.$get(`/users/${this.user.id}`)
		}

		get friendStatus(): FriendStatus {
			const friends = (this.$auth.user as any).friends
			if ((friends as string[]).indexOf(this.user.id) !== -1)
				return FriendStatus.FRIEND
			if (this.friendRequests.filter(request => request.sender.id === this.user.id).length > 0)
				return FriendStatus.PENDING_RECEIPIENT
			if (this.friendRequests.filter(request => request.receipient.id === this.user.id).length > 0)
				return FriendStatus.PENDING_SENDER
			return FriendStatus.NOT_FRIEND
		}

		async updateFriend(friendStatus: FriendStatus) {
			if (friendStatus === FriendStatus.NOT_FRIEND) {
				this.$axios.post(`/friends/requests`, {
					receipient: {
						id: this.user.id
					}
				}).then((result) => {
					this.$toast.info("Friend request sent")
					this.friendRequests.push(result.data)
				}).catch((error) => {

				})
			}
			else if (friendStatus === FriendStatus.FRIEND) {
				this.$axios.delete(`friends`, {
					data: {
						friend: {
							id: this.user.id
						}
					}
				}).then(() => {
					this.$toast.info("Friend removed")
					this.$auth.fetchUser()
				}).catch((error) => {

				})
			}
			else if (friendStatus === FriendStatus.PENDING_RECEIPIENT) {
				this.$axios.post(`/friends/accept`, {
					sender: {
						id: this.user.id
					}
				}).then(() => {
					this.$toast.success("You have a new friend!")
					this.$auth.fetchUser()
				}).catch((error) => {

				})
			}
			await this.fetchRequests()
		}

		showuser() {
			console.log(this.$auth.user)
		}

		updateDisplayName() {
			this.$axios.patch(`users/update/${this.user.id}`, {
				displayName: this.displayNameInput
			}).then((result) => {
				this.user.displayName = this.displayNameInput
				this.$auth.fetchUser()
				this.fetchUser()
				this.$toast.success("Display Name changed!")
				this.toggleDisplayNameField();
			}).catch((err) => {
				this.toggleDisplayNameField();
				this.$toast.error("Name already taken")
			})
		}

		updateAvatar(filename: any) {
			const avatarFileName = filename.filename
			const avatar = `http://localhost:3000/avatar/${filename.filename}`
			this.$axios.patch(`users/update/${this.user.id}`, {
				avatar,
				avatarFileName
			}).then(() => {
				this.user.avatar = avatar
				this.$auth.fetchUser()
				this.fetchUser()
				this.$toast.success("Avatar updated!")
				this.toggleAvatarUploader()
			}).catch((error) => {
				this.$toast.error("Avatar change failed")
				this.toggleAvatarUploader()
			})
		}

		toggleAdmin() {
			let newRole = ""
			if (this.user.role === "user")
				newRole = "admin"
			else
				newRole = "user"

			this.$axios.patch(`users/update/${this.user.id}`, {
				role: newRole
			}).then((result) => {
				this.user.role = newRole
				this.$toast.success("User's role changed")
			}).catch((error) => {
				this.$toast.error("Could not change user's role")
			})
		}
		
	}
</script>

<style  scoped>

</style>