<template>
    <div>
        <div class="flex flex-row w-10/12 text-2xl p-2 m-5 shadow cursor-pointer" @click="$emit('select', c.id)" v-for="c in conversations">
            <font-awesome-icon v-if='c.members.length > 1' icon="users"/>
            <font-awesome-icon v-else icon="user"/>
            <div v-if="c.members.length > 1">
                <span>{{c.members.slice(0,3).join(', ')}}{{c.members.length > 3 ? ` and ${c.members.length - 3} others` : ""}}</span>    
            </div>
            <div v-else>
                <span >{{c.members[0]}}</span>
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
                    {id : "1235", members: ["boB", "MIreille"], title: "La guilde des meilleurs"},
                    {id : "1236", members: ["boB", "Celine", "Napoleon", "Andre", "Jack Sparrow", "Neils Amstrong", "Al Capone"]},
                    {id : "1237", members: ["boB", "Alphonse", "vroum vroum"]},
                    {id : "1238", members: ["boB"]},
            ]
        }
    },
}) 
</script>
