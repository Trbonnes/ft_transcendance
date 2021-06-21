<template>
    <div>
        <div class="w-10/12 text-2xl p-2 m-5 shadow" @click="$emit('select')" v-for="c in conversations">
            <font-awesome-icon v-if='c.members.length > 1' icon="users"/>
            <font-awesome-icon v-else icon="user"/>
            <div v-if="c.members.lenght > 1">
                
            </div>
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
                    {id : "1234", members: ["boB", "MIreille"], title: "La guilde des meilleurs"},
                    {id : "1234", members: ["boB", "Celine", "Napoleon", "Andre", "Jack Sparrow", "Neils Amstrong"]},
                    {id : "1234", members: ["boB", "Alphonse"]},
                    {id : "1234", members: ["boB"]},

            ]
        }
    },
}) 
</script>
