<template>
    <div>
       This is the single viw 
           <font-awesome-icon @click="$emit('exit')" icon="times"/>
    </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            
        }
    },
})
</script>
