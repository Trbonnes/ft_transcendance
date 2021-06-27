<template>
    <div>
        <h1>The conversation id is {{id}}</h1>
        <div> names here</div>
           <font-awesome-icon @click="$emit('exit')" icon="times"/>
    </div>
</template>
<script>
import Vue from 'vue'
export default Vue.extend({
    props: [
        "id"
    ],
    data() {
        return {
            
        }
    },
})
</script>
