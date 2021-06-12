<template>
<div>
    <div class="flex flex-row items-center justify-start m-5 hover:bg-gray-500" v-for="f in friends">
        <div>
            <div class="avatar relative m-1">
                <div class="status"></div>
            </div>
        </div>
        <span>{{f.name}}</span>
    </div>
</div>

</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	data() {
		return {
			friends : [
				{name: "Bob", connected: true, status: "Don't worry be happy"},
				{name: "Marcel", connected: true, status: "It's time to get funky"},
				{name: "Giovanni", connected: true, status: "Everybody calls me Giorgio"},
			]
		}
	},
})
</script>
<style>
.avatar
{
    width: 50px;
    height: 50px;
    background-color:pink;
    border-radius: 50px;
}

.status
{
    height: 10px;
    width: 10px;
    position:absolute;
    bottom: 2px;
    right: 2px;
    background-color:orange;
    border-radius: 50px;
}

.status.connected {

}
</style>
