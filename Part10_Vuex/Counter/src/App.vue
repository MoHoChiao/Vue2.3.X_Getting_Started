<template>
    <div id="app">
        <counter></counter>
    </div>
</template>
<script>
import Count from './page/count.vue'

export default {
    name: 'app',
    components: {
        'counter': Count
    }
}
</script>
