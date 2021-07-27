<template>
  <div>
    <main-menu id="top"></main-menu>
    <side-menu id="side"></side-menu>
    <Nuxt/>
  </div>
</template>

<script lang="ts">
</script>

<style>
#top {
  width: 80vw;
}
#side {
  width: 20vw;
  height: 100vh;
  position: fixed;
  right: 0;
  top: 0;
  @apply shadow
}
</style>
