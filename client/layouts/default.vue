<template>
  <div>
    <NavBar />
    <Nuxt />
    <ChatMain :style="{ display: !$route || $route.name !== 'game' ? null : 'none' }" />    
    <ChatGameNotification :style="{ display: !$route || $route.name !== 'game' ? null : 'none' }" />
	<keep-alive>
		<div id="gameCtnr" :style="{ display: !$route || $route.name !== 'game' ? 'none' : null }" />
	</keep-alive>
  </div>
</template>

<script lang="ts"></script>
<style>
#top {
  width: 80vw;
}
</style>
