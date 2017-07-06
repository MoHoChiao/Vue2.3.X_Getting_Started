import Vue from 'vue'
import Parent from './components/parent_component.vue'

new Vue({
    el: '#app',
    render: h => h(Parent)
})
