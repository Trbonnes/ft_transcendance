<template>
  <div>
    <div class="navbar shadow-lg bg-neutral text-neutral-content">
      <div class="flex-none px-2 mx-2">
        <NuxtLink to="/" class="text-lg font-bold"> Ft_Transcendance </NuxtLink>
      </div>
      <div class="flex-none sm:hidden">
        <div class="dropdown dropdown-end">
          <button class="btn btn-square btn-ghost" tabindex="0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-6 h-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          <ul
            tabindex="0"
            class="
              p-2
              shadow
              menu
              dropdown-content
              bg-base-100
              rounded-box
              w-52
            "
          >
            <li>
              <NuxtLink to="/game">Play</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/friends">Friends</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/leaderboard">Players</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="flex-1 px-2 mx-2">
        <div class="items-stretch hidden sm:flex">
          <NuxtLink to="/game" class="btn btn-ghost btn-sm rounded-btn">
            Play
          </NuxtLink>
          <NuxtLink to="/friends" class="btn btn-ghost btn-sm rounded-btn">
            Friends
          </NuxtLink>
          <NuxtLink to="/leaderboard" class="btn btn-ghost btn-sm rounded-btn">
            Players
          </NuxtLink>
        </div>
      </div>
      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div class="avatar" tabindex="0">
            <div class="rounded-full w-10 h-10 m-1">
              <img :src="loggedInUser.avatar" />
            </div>
          </div>
          <ul
            tabindex="0"
            class="
              p-2
              shadow
              menu
              dropdown-content
              bg-base-100
              rounded-box
              w-52
            "
          >
            <li>
              <NuxtLink :to="`/users/${this.loggedInUser.login}`"
                >Profile</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/settings">Settings</NuxtLink>
            </li>
            <li>
              <a @click="logOut">Log Out</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { Component, Getter } from 'nuxt-property-decorator'

@Component
export default class Navigation extends Vue {
  @Getter
  public isLoggedIn!: boolean

  @Getter
  public loggedInUser!: any

  logOut() {
    this.$auth.logout()
    this.$router.push('/login')
  }
}
</script>

<style lang="scss" scoped></style>
