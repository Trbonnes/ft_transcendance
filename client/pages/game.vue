<template>
	<keep-alive>
		<div id="gameCtnr"></div>
	</keep-alive>
</template>

<script lang="ts">

import Vue from 'vue'
import { setup } from '../phaser/phaserconfig'

export default Vue.extend({
	data() {
		return { error: false, game: undefined as Phaser.Game | undefined }
	},
	async mounted() {
		if (!this.error) this.game = setup({})
	},
})
</script>

<style scoped lang="scss">

#gameCtnr {
	width: 100%;
	height: 100%;
	/* background: black; */
}

>>> input {
	//background-image: url(https://assets.labrute.prushka.fr/buttons/brute_button.png);
	//background-size: 100% 100%;
	border: black;
	//padding: 5px 15px;
	font-size: 30px;
	pointer-events: auto;
}

</style>
