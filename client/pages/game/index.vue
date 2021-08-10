<template>
	<keep-alive>
		<div id="gameCtnr"></div>
	</keep-alive>
</template>

<script lang="ts">

import Vue from 'vue'
import { setup } from '../../phaser/phaserconfig'

export default Vue.extend({
	// middleware: 'auth',
	data() {
		return { error: false, game: undefined as Phaser.Game | undefined }
	},
	async mounted() {
		if (!this.error) this.game = setup({invite: null, spectate: null})
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
	font-size: 60;
	pointer-events: auto;
}

</style>
