<template>
	<div>
		<section class="body-font">
  			<div class="container mx-auto flex px-5 py-24 items-center justify-center flex-col">
    			<img class="lg:w-1/6 md:w-2/6 w-4/6 mb-1 object-cover object-center rounded " alt="hero" :src="user.avatar">
				<button class="btn btn-primary"
						v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id && user.game_id"
						@click="spectateUser">
					Spectate </button>
				<button class="inline-flex text-white bg-grey border-0 py-0.5 px-5 focus:outline-none hover:bg-blue-700 rounded text-xs italic mb-3"
						v-if="showIfNotAdmin() && this.$auth.loggedIn && (this.$auth.user.id === user.id || this.$auth.user.role === 'admin' || this.$auth.user.role === 'superAdmin')"
						@click="toggleAvatarUploader">
					Change avatar </button>
				<avatar-uploader v-if="inputAvatarUpload" @imageUploaded="updateAvatar" :user="user" class="flex mb-3"/>
    			<div class="text-center lg:w-3/3 w-full">
     					<h1 class="title-font sm:text-5xl text-3xl mb-0 font-medium text-info">{{ user.displayName }}</h1>
					<button class="inline-flex text-white bg-grey border-0 py-0.5 px-2 focus:outline-none hover:bg-blue-700 rounded mb-3 text-xs italic"
							v-if="showIfNotAdmin() && this.$auth.loggedIn && (this.$auth.user.id === user.id || this.$auth.user.role === 'admin' || this.$auth.user.role === 'superAdmin')"
							@click="toggleDisplayNameField">
						Change display name (length: 2-16 chars)</button>
					<div v-if="inputDisplayName">
						<div class="form-control mb-3">
							<div class="flex space-x-2 justify-center">
								<input type="text" maxlength="16" v-on:keypress="isAlphaNumerical($event)" placeholder="Display Name" v-model="displayNameInput" class="input input-primary input-bordered"> 
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
					<p class="sm:text-lg mt-10 text-info">Level: {{ user.level }}</p>
				</div>
				<div>
					<div v-if="user.isActive">
						<p>Status: online</p>
					</div>
					<div v-else>
						<p>Status: offline</p>
					</div>
				</div>
 				<div v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id && (( user.role === 'user' && this.$auth.user.role === 'admin') || this.$auth.user.role === 'superAdmin')">
					<div v-if="user.banned === false">
						<button class="btn" @click="toggleBan">Ban</button>
					</div>
					<div v-else>
						<button class="btn" @click="toggleBan">Unban</button>
					</div>
				</div>
				<div v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id">
					<friend-button @update="updateFriend" :friendStatus="friendStatus"/>
					<div v-if="isBlocked === false">
						<button class="btn" @click="toggleBlock">Block</button>
					</div>
					<div v-else>
						<button class="btn" @click="toggleBlock">Unblock</button>
					</div>
				</div>
				<div class="flex w-full m-5 justify-center items-center">
						<div class="card shadow m-3 flex flex-grow items-center">
  							<div class="card-body items-center">
 							   <h2 class="card-title text-success">Victories</h2> 
   									<p>{{ user.victory }}</p>
  							</div>
						</div> 
						<div class="card shadow m-3 flex flex-grow">
  							<div class="card-body items-center">
    							<h2 class="card-title text-error">Defeats</h2> 
    							<p>{{ user.defeat }}</p>
  							</div>
						</div>
				</div>
				<div class="flex justify-center">
  					<button v-if="this.$auth.loggedIn && this.$auth.user.id !== user.id" class="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">Challenge</button>
				</div>
				<!-- <button @click="showuser"> click to show user debug </button> -->
				<div class="">
					<h1 class="flex mx-auto justify-center mt-10 m-5 text-3xl font-bold"> Game history </h1>
					<div v-if="playedGames.length <= 0">
						<p class="flex mx-auto justify-center text-xl font-bold"> No games found</p>
					</div>
					<div v-else>
						<div class="items-center" v-for="(game) in playedGames" :key="`${game}.id`">
							<GameCard :user="user" :game="game"/>
						</div>
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
import {FriendStatus} from '~/utils/enums/friends-request.enum'

	@Component
	export default class Profile extends Vue {

		user:any = null;
		friendRequests:any[] = [];
		inputDisplayName:boolean = false;
		displayNameInput:string = "";
		inputAvatarUpload:boolean = false;
		games: any[] = [];

		mounted() {
			if (this.$auth.loggedIn) 
				this.$auth.fetchUser()
			this.updateUserStats()
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
			this.games = await this.$axios.$get(`game`)
		}

		async fetchRequests() {
			this.friendRequests = await this.$axios.$get(`/friends/requests`)
		}

		async fetchUser() {
			this.user = await this.$axios.$get(`/users/${this.user.id}`)
		}

		async updateUserStats() {
			await this.$axios.get(`/game/user/${this.user.id}`)
			await this.fetchUser();
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

		get playedGames(): any[] {
			let tmp = this.games.filter(game => game.winner_id === (this.user as any).id
											|| game.loser_id === (this.user as any).id)
			console.log(tmp);
			return tmp.sort((a, b) => {
				return a.date - b.date ? -1 : 1
			})
		}
		
		get isBlocked(): boolean {
			if ((this.$auth.user as any).blockedUsers.indexOf(this.user.id) === -1)
				return false
			else
				return true
		}
		
		async toggleBlock() {
			if (this.isBlocked === false) {
				this.$axios.post(`/users/${this.user.id}/block`, {
				}).then((result) => {
					this.$toast.success("User blocked")
					this.$auth.fetchUser()
				})
			}
			else {
				this.$axios.post(`/users/${this.user.id}/unblock`, {
				}).then((result) => {
					this.$toast.success("User unblocked")
					this.$auth.fetchUser()
				})
			}
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

		async showuser() {
			console.log(this.$auth.user)
			console.log(this.isBlocked)
			let user = await this.$axios.$get(`/game/user/${this.user.id}`)
			console.log(user);
			
		}

		showIfNotAdmin(): boolean {
		
		const current_user = this.$auth.user;
		
		if (!current_user)
			return false

		if 	( current_user.id != this.user.id &&
			( this.user.role === "admin" || this.user.role === "superAdmin") )
			return false;
		// console("still here")
		return true
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
				this.$toast.error("Name already taken or length too short")
			})
		}

		isAlphaNumerical($event: any) {
      		let char = String.fromCharCode($event.keyCode)
      		if (/^[A-Za-z0-9]+$/.test(char)) return true
      		else {
       			$event.preventDefault()
        		this.$toast.error('Only alphanumerical characters, click to submit')
      		}
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

		toggleBan(): boolean {
			console.log("IN TOGGLEBAN")
			let ban_status: boolean = !(this.user.banned)
			this.$axios.patch(`users/update/${this.user.id}`, {
				banned: ban_status
			}).then((result) => {
				console.log("IN THEN")
				this.user.banned = ban_status
				console.log(this.user)
				this.$toast.success("User was banned")
			}).catch((error) => {
				this.$toast.error("Could not ban user")
			})
			return true
		}

		async spectateUser() {
			await this.fetchUser();
			if (this.user.game_id)
			// Link is incorrect 
				this.$router.push(`/game?spectateId=${this.user.game_id}`)
			else
				this.$toast.error("This players' game is over.")
		}
		
	}
</script>

<style  scoped>

</style>