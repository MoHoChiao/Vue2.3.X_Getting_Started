<template>
    <div id="app">
        <computer></computer>
    </div>
</template>
<script>
import Computer from './page/computer.vue'

export default {
    name: 'app',
    components: {
        'computer': Computer
    }
}
</script>
