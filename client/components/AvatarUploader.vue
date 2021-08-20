<template>
	<div>
		<input type="file" ref="file" @change="uploadImage($event)" accept="image/png, image/jpeg" class="hidden">
		<button class="btn" @click="$refs.file.click()"> Choose File </button>
	</div>
</template>

<script lang='ts'>
import Vue from 'vue'
import { Component, Prop } from 'nuxt-property-decorator'

	@Component
	export default class AvatarUploader extends Vue {
		@Prop({required: true}) user: any

		uploadImage($event: any): void {
			if ($event.target && $event.target.files.length > 0) {
				let data = new FormData()
				const file = $event.target.files[0]
				let ext = file.filename

				ext = ext.split('.').pop()

				const filename = this.user.login + '.' + ext

				data.append('file', file, filename)

				this.$axios.post(`avatar`, data, {
					headers: {
						'accept': 'application/json',
						'Content-type': `multipart/form-data;boundary=${(data as any)._boundary}`
					}
				}).then((response) => {
					this.$emit('imageUploaded', {
						filename: filename
					})
				}).catch((error) => {

				})
			} else {
				console.log("no file provided")
			}
		}

	}
</script>

<style scoped>

</style>