<template>
  <div>
    <div
      relative
      class="
        flex flex-row
        items-center
        justify-between
        m-5
        hover:bg-gray-500
        w-11/12
      "
      v-for="f in friends"
      @mouseleave="active = null"
    >
      <div class="flex flex-row items-center justify-between">
        <div class="avatar relative m-1">
          <div class="connection" :class="{ connected: f.connected }"></div>
        </div>
        <span>{{ f.name }}</span>
      </div>
      <font-awesome-icon
        class="m-5 block cursor-pointer"
        @click="active = f.id"
        icon="ellipsis-v"
      ></font-awesome-icon>
      <div
        class="
          p-5
          bg-gray-700
          flex flex-col
          items-start
          justify-center
          text-white
          absolute
          right-0
          top-full
          z-40
        "
        :class="{ hidden: active != f.id }"
      >
        <span>send message</span>
        <span>send invite</span>
        <span>remove friend</span>
      </div>
    </div>
    <a href="#add-friend" class="btn btn-primary">Add a friend</a>
    <div id="add-friend" class="modal">
      <div class="modal-box flex flex-col">
        Enter an username:
        <input
          type="text"
          name="username"
          placeholder="John Doe"
          class="input input-bordered"
        />

        <div>
          <a href="#" class="btn btn-primary">Close</a>
          <a href="#" class="btn btn-accent">Add friend</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      active: null, // will hold the id of the friend which is selected
      friends: [
        { id: 1, name: 'Bob', connected: true, status: "Don't worry be happy" },
        {
          id: 2,
          name: 'Marcel',
          connected: true,
          status: "It's time to get funky",
        },
        {
          id: 3,
          name: 'Giovanni',
          connected: false,
          status: 'Everybody calls me Giorgio',
        },
      ],
    }
  },
})
</script>
<style>
.avatar {
  width: 50px;
  height: 50px;
  background-color: pink;
  border-radius: 50px;
}

.connection {
  height: 10px;
  width: 10px;
  position: absolute;
  bottom: 2px;
  right: 2px;
  background-color: red;
  border-radius: 50px;
}

.connection.connected {
  background-color: green;
}
</style>
