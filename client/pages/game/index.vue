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
		if (!this.error) this.game = setup({user:null, invite: null, spectate: null})
	},
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
