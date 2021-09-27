<template>
  <div>
    <NavBar />
    <Nuxt />
    <ChatMain/>    
    <ChatGameNotification/>
	<keep-alive>
		<div id="gameCtnr" :style="{ display: !$route || $route.name !== 'game' ? 'none' : null }"></div>
	</keep-alive>
  </div>
</template>

<script lang="ts"></script>

<style>
#top {
  width: 80vw;
}
</style>
