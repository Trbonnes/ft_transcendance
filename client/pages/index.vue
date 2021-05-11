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
	// beforeRouteEnter(to, from, next) {
	// 	console.log(to, from)
	// 	if (from.meta.isGameView) {
	// 		next()
	// 	}
	// }
})
</script>

<style scoped>
#gameCtnr {
	width: 100%;
	height: 100%;
	/* min-height: 100vh; */
}

.container {
	margin: 0 auto;
	min-height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
}

.title {
	font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
		'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	display: block;
	font-weight: 300;
	font-size: 100px;
	color: #35495e;
	letter-spacing: 1px;
}

.subtitle {
	font-weight: 300;
	font-size: 42px;
	color: #526488;
	word-spacing: 5px;
	padding-bottom: 15px;
}

.links {
	padding-top: 15px;
}
/* 
/deep/ input {
	background-image: url(https://assets.labrute.prushka.fr/buttons/brute_button.png);
	background-size: 100% 100%;
	border: none;
	padding: 5px 15px;
	font-size: 15px;
}

/deep/ .copy-field input {
	pointer-events: none;
	width: 100%;
	height: 100%;
	font-size: inherit;
	text-align: inherit;
} */
</style>
