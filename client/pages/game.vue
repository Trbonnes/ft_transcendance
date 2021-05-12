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
		if (!this.error) this.game = setup({}, this.$router)
	},
})
</script>

<style scoped>
#gameCtnr {
	width: 100%;
	height: 100%;
  pointer-events: none;
}
</style>
