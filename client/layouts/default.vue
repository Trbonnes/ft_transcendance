<template>
  <div>
    <main-menu id="top"></main-menu>
    <side-menu id="side"></side-menu>
    <nuxt/>
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
  background-color: rgb(143, 143, 143);
  position: fixed;
  right: 0;
  top: 0;
}
</style>
