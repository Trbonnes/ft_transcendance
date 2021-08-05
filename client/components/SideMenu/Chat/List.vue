<template>
  <div>
    <div
      class="flex flex-row w-10/12 text-2xl p-2 m-5 shadow cursor-pointer"
      @click="$emit('select', c.id)"
      v-for="c in channels"
    >
      <font-awesome-icon v-if="c.users.length > 1" icon="users" />
      <font-awesome-icon v-else icon="user" />
      <div v-if="c.users.length > 1">
        <span
          >{{ c.users.slice(0, 3).join(', ')
          }}{{
            c.users.length > 3 ? ` and ${c.users.length - 3} others` : ''
          }}</span
        >
      </div>
      <div v-else>
        <span>{{ c.users[0] }}</span>
      </div>
    </div>
    <font-awesome-icon icon="plus" @click="createChannel" />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { CreateChannelDto } from '~/utils/types/channel'

export default Vue.extend({})
</script>
