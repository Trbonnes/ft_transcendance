<template>
	<div/>
</template>

<script lang="ts">

import Vue from 'vue'
import { setup } from '../../phaser/phaserconfig'

export default Vue.extend({
	middleware: 'auth',
	data() {
		return { error: false, game: undefined as Phaser.Game | undefined }
	},
	async mounted() {
		if (this.$auth.loggedIn && this.$auth.user !== null) {
			this.$auth.fetchUser()
			const user: any  = this.$auth.user as any
			let token = this.getToken()
			const spectate: string | null = this.$route.query.spectateId as string | null
			const invite: string | null = this.$route.query.inviteId as string | null
			console.log('invite: ' + invite)
			if (!this.error) this.game = setup({
				userId: user.id,
				userToken: token,
				gameId: user.game_id,
				invite: invite ? invite : null,
				spectate: spectate ? spectate : null,
				store: this.$store,
				friendId : this.$route.query.friendId as string || "",
			})
		}
	},

	methods: {
		getToken() {
			return (this.$auth.strategy as any).token.get()
		}
	}
})
</script>

<style lang="scss">

#gameCtnr {
	width: 80%;
	height: 80%;
    display: block;
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
	/* background: black; */
}

>>> input {
	background-image: url(https://assets.labrute.prushka.fr/buttons/brute_button.png);
	background-size: 100% 100%;
	border: none;
	padding: 5px 15px;
	font-size: 15px;
}
.copy-field input {
	pointer-events: none;
	width: 100%;
	height: 100%;
	font-size: inherit;
	text-align: inherit;
}

</style>
