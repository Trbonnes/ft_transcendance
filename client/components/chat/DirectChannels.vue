<template>
    <div>
        direct channels list
        
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