<template>
	<div class="container  flex flex-row items-center justify-around text-gray-500">
		<font-awesome-icon icon="bolt"/>
		<font-awesome-icon icon="scroll"/>
		<font-awesome-icon icon="play"/>
		<font-awesome-icon icon="user"/>
		<font-awesome-icon icon="cog"/>
	</div>
</template>
<script>
export default {
	
}
</script>
<style>
.container{
	font-size: 3em;
	background-color: rgb(201, 201, 201);
	min-height: 10vh;
}

.container > svg
{
	transition: all 0.4s;
	@apply transform hover:scale-125
}
</style>