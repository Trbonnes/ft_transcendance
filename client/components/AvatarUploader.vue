<template>
	<div class="items-center">
		<input type="file" ref="file" @change="uploadImage($event)" accept="image/png, image/jpeg" class="hidden">
		<button class="btn" @click="$refs.file.click()"> Choose File </button>
		<label class="ml-2">2 Mo file max</label>
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
				console.log(file)
				let ext = file.name
				const oldAvatar = this.user.avatar

				ext = ext.split('.').pop()

				const filename = this.user.login + '.' + ext

				data.append('file', file, filename)

				this.$axios.post(`avatar/${filename}`, data, {
					headers: {
						'accept': 'application/json',
						'Content-type': `multipart/form-data;boundary=${(data as any)._boundary}`
					}
				}).then((response) => {
					if (this.user.avatarFileName !== "")
						this.$axios.delete(`avatar/${this.user.id}`)
					this.$emit('imageUploaded', {
						filename: response.data
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