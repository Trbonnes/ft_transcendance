<template>
  <div>
    <component v-bind:is="comp"></component>
    <div
      id="menu"
      class="
        flex flex-row
        w-full
        items-center
        justify-around
        absolute
        bottom-0
        text-4xl
      "
    >
      <div
        class="cursor-pointer transform hover:scale-125"
        @click="comp = 'side-menu-online-friends'"
      >
        <font-awesome-icon icon="globe" />
      </div>
      <div
        class="cursor-pointer transform hover:scale-125"
        @click="comp = 'side-menu-chat'"
      >
        <font-awesome-icon icon="comment" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      comp: 'side-menu-online-friends',
    }
  },
})
</script>
<style></style>
