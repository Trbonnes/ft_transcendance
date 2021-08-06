<template>
  <div>
    <div class="block h-10 flex flex-row items-center justify-between w-full">
      <div
        class="flex cursor-pointer items-center justify-around h-10 w-10 shadow"
        @click="$emit('exit')"
      >
        <font-awesome-icon
          class="text-xl"
          icon="arrow-left"
        ></font-awesome-icon>
      </div>
      <span class="block ml-10">Here's the conversation title</span>
    </div>
    <div id="messages"></div>
    <div id="chatbox">
      Here is the chat box
      <textaera cols="30" rows="5"></textaera>
    </div>
  </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
  props: ['id'],
  data() {
    return {}
  },
})
</script>
