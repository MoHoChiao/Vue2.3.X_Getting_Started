<template>
    <div>
        <!--使用v-model雙向綁定資料num1-->
        <span><input type='number' v-model='num1' style="width: 50px;"></span>
        <span>
            <!--傳送運算元給callAction方法,讓它決定要用什麼action-->
            <button @click="callAction('+')"> + </button>
            <button @click="callAction('-')"> - </button>
            <button @click="callAction('*')"> * </button>
            <button @click="callAction('/')"> / </button>
        </span>
        <!--使用v-model雙向綁定資料num2-->
        <span><input type='number' v-model='num2' style="width: 50px;"></span>
        <span>={{ count }}</span>
        <br>
        <br>
        <button @click="actionReset">Reset</button>
    </div>
</template>
<script>
/*
    引用 vuex
    mapActions 在 computed 中使用，提取 action 函式的方法，使用函式名稱
    mapGetters 在 methods 中使用，提取 getter 函式的方法，可以利用物件 key: value 方式取別名
*/
import {
    mapGetters,
    mapActions
} from 'vuex'

export default {
    //宣告兩個資料變數
    data: function() {
        return {
            num1: 1,
            num2: 1
        };
    },

    computed: {
        //ES7的寫法,把所有getters都引入
        ...mapGetters({
            // getCount return value 將會存在別名為 count 的 data 上
            count: 'getCount',
        }),
    },

    methods: {
        //ES7的寫法,把所有actions都引入
        ...mapActions([
            'actionAdd',
            'actionSub',
            'actionMultiply',
            'actionDivide',
            'actionReset',
        ]),
        callAction(operator) {
            var numObject = {
                num1: this.num1,
                num2: this.num2
            };
            if (operator === '+') {
                //傳送一個value給actionAdd這個動作,你也只能傳一個value,所以必須要組成object的形式
                this.actionAdd(numObject);
            } else if (operator === '-') {
                //傳送一個value給actionSub這個動作,你也只能傳一個value,所以必須要組成object的形式
                this.actionSub(numObject);
            } else if (operator === '*') {
                //傳送一個value給actionMultiply這個動作,你也只能傳一個value,所以必須要組成object的形式
                this.actionMultiply(numObject);
            } else if (operator === '/') {
                //傳送一個value給actionDivide這個動作,你也只能傳一個value,所以必須要組成object的形式
                this.actionDivide(numObject);
            } else {
                //不需要傳送任何參數
                this.actionReset;
            }
        }
    }
}
</script>
