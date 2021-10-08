<template>
  <div
    class="
      relative
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-50
      py-12
      px-4
      sm:px-6
      lg:px-8
      bg-gray-500 bg-no-repeat
      md:bg-contain
      bg-center
      relative
      items-center
    "
    style="
      background-image: url(https://www.imaginarycloud.com/blog/content/images/2019/02/Pong.jpg);
    "
  >
    <div class="absolute bg-black opacity-60 inset-0 z-0"></div>
    <div class="max-w-md w-full space-y-8 p-10 bg-white rounded-xl z-10">
      <div class="text-center">
        <h2 class="mt-6 text-3xl font-bold text-gray-900">
          Welcome to ft_transcendance!
        </h2>
        <p class="mt-2 text-sm text-gray-600">Please sign in to your account</p>
        <p class="mt-2 text-sm text-gray-600 text-italic">
          For Test User: please check the box
        </p>
        <input type="checkbox" class="mt-3" v-model="testSignIn" />
      </div>
      <div v-if="testSignIn === false">
        <button
          @click="userLogin"
          class="
            w-full
            flex
            justify-center
            bg-indigo-500
            text-gray-100
            p-4
            rounded-full
            tracking-wide
            font-semibold
            focus:outline-none
            focus:shadow-outline
            hover:bg-indigo-600
            shadow-lg
            cursor-pointer
            transition
            ease-in
            duration-300
          "
        >
          Sign in with 42 !
        </button>
      </div>
      <div v-else class="">
        <label class="text-sm font-bold text-gray-700 tracking-wide"
          >Test User Name (length: 2-16 chars)</label
        >
        <input
          class="
            w-full
            text-base
            py-2
            border-b border-gray-300
            focus:outline-none
            focus:border-indigo-500
            mb-5
            text-black
          "
          type="text"
          maxlength="16"
          v-on:keypress="isAlphaNumerical($event)"
          v-model="testUserName"
          placeholder="Name"
        />
        <button
          @click="testUserLogin"
          class="
            w-full
            flex
            justify-center
            bg-indigo-500
            text-gray-100
            p-3
            rounded-full
            tracking-wide
            font-semibold
            focus:outline-none
            focus:shadow-outline
            hover:bg-indigo-600
            shadow-lg
            cursor-pointer
            transition
            ease-in
            duration-300
          "
        >
          Sign in Test User
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  layout: 'loggedout',
  middleware: 'auth',

  data() {
    return {
      testSignIn: false,
      testUserName: '',
    }
  },

  methods: {
    async userLogin() {
      await this.$auth.loginWith('fortytwo')
      .catch(error => this.$toast.error("login error: user was banned"))
    },

    testUserLogin() {
      if (this.testUserName.length < 2) {
        this.$toast.error('Test User name too short')
        return
      }
      this.$auth.loginWith('testrefresh', {
        params: {
          user: this.testUserName,
        },
      })
      .then(() => {
        if (this.$auth.$state.redirect) { // If redirect to login page from page that is required authentication (auth midleware), go that page
          this.$router.push(this.$auth.$state.redirect, () => {})
        } 
        else { // Otherwise, go to home page
          this.$auth.redirect('home');
        }
      })
      .catch(error => this.$toast.error("login error: user was banned"))
    },

    displayState() {
      // console.log(this.$store.state)
    },

    isAlphaNumerical($event: any) {
      let char = String.fromCharCode($event.keyCode)
      if (/^[A-Za-z0-9]+$/.test(char)) return true
      else {
        $event.preventDefault()
        this.$toast.error('Only alphanumerical characters')
      }
    },
  },
})
</script>

<style></style>
