<template>
	<keep-alive>
		<div id="gameCtnr"></div>
	</keep-alive>
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
			console.log(token)
			console.log(user.id)
			if (!this.error) this.game = setup({
				userId: user.id,
				userToken: token,
				invite: null,
				spectate: null})
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
	width: 100%;
	height: 100%;
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
