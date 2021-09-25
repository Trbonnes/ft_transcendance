<template>
    <div id="join-private"  v-bind:class="[this.joinForm.show ? 'modal-open' : 'modal']">
      <div class="modal-box ">
        <form @submit="joinPrivate">
            <label for="channelPrivatePassword" class="cursor-pointer label">
              Password required
              <input
                v-model="joinForm.password"
                id="channelPrivatePassword"
                type="password"
                placeholder=""
                class="input input-bordered"
              />
            </label>
            <input type="submit" value="Join channel" class="btn btn-primary" />
        </form>
        <a href="#" class="btn btn-primary" @click="toggleJoinForm">Close</a>
      </div>
    </div>
</template>