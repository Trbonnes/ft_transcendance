<template>
    <div>
        <div @click="$emit('select')" v-for="c in conversations">
            <font-awesome-icon v-if='c.members.length > 1' icon="users"/>
            <font-awesome-icon v-else icon="user"/>
        </div>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            conversations: [
                    {id : "1234", members: ["boB"]},
                    {id : "1234", members: ["boB", "MIreille"]},
                    {id : "1234", members: ["boB", "Celine"]},
                    {id : "1234", members: ["boB", "Alphonse"]},
                    {id : "1234", members: ["boB"]},

            ]
        }
    },
}) 
</script>
