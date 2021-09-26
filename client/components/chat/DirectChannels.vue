<template>
    <div>
        <span class="btn btn-primary m-1" @click="$emit('next', { comp : 'ChatAddDirect'})">
            <font-awesome-icon title="Search" class="cursor-pointer text-4xl m-2" icon="search" ></font-awesome-icon>
        </span>
    </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
    fetch()
    {
        this.$store.dispatch("channel/fetchAll")
    },
    computed : {
        getChannels()
        {
            return this.$store.getters["channel/all"]
        },
    },
})
</script>