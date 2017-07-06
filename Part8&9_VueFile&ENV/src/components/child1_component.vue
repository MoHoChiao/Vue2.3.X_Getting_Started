<template>
    <div id="child1">
        <!--顯示從組件本身data來的message資料-->
        <p>子組件本身的dataMessage值：{{ dataMessage }}</p>
        <!--顯示組件所接收到的外部message及type之資料-->
        <p>子組件所接收到的外部(父組件)來的propsMessage值：{{ propsMessage }}</p>
        <p>子組件所接收到的外部(父組件)來的type值：{{ type }}</p>
        <button v-on:click="increment">{{ counter }}</button>
    </div>
</template>
<script>
export default {
    //template屬性不用給,預設就會塞入.vue檔裡面的template
    //給這個子組件一個名字
    name: 'child1',
    props: ['type', 'propsMessage'],
    data() {
        return {
            dataMessage: 'This child component 1',
            counter: 0
        }
    },
    methods: {
        increment: function() {
            this.counter += 1

            //向外界(父組件)丟出事件(觸發事件),事件有沒有人處理不要緊
            this.$emit('increment')
        }
    }
}
</script>
<style scoped>
p {
    color: red;
    font-size: 20px;
    text-align: left;
}
</style>
