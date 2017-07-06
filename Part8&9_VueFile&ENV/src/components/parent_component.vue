<template>
    <div id="parent">
        <!--宣到兩個使用v-model雙向綁定的input元素-->
        <p>type：
            <input type="text" v-model="parent_type" />
        </p>
        <p>message：
            <input type="text" v-model="parent_message" />
        </p>
        <!--在引用<child-component>這個組件時,給它傳遞兩個參數過去,且參數值動態地單向綁定在父組件的data屬性-->
        <!--即父組件的data屬性變動,則此子組件的props屬性也跟著變動-->
        <!--特別注意!上述反之不成立,資料綁定是單向的資料流,即子組件的props屬性變動不會改變父組件之data屬性-->
        <!--單向資料流是為了防止子組件無意修改了父組件的狀態,因此這會讓資料流變的難以理解,增加debug困難-->
        <!--v-on指令綁定了事件,即子組件若從它的increment方法丟出事件來,父組件則用incrementTotal方法來處理-->
        <child1-component v-bind:type="parent_type" v-bind:props-message="parent_message" v-on:increment="incrementTotal"></child1-component>
        <child2-component v-bind:type="parent_type" v-bind:props-message="parent_message" v-on:increment="incrementTotal"></child2-component>
        <p>兩個子組件共計按鈕的次數：{{ total }}</p>
    </div>
</template>
<script>
import Child1 from './child1_component.vue'
import Child2 from './child2_component.vue'

export default {
    //template屬性不用給,預設就會塞入.vue檔裡面的template
    //給這個子組件一個名字
    name: 'parent',
    data() {
        return {
            parent_type: 'child',
            parent_message: 'Hi, My child.',
            total: 0
        }
    },
    components: {
        //私域註冊兩個Child組件為此父組件的子組件,因為私域,所以該組件只能在Parent組件內使用
        'child1-component': Child1,
        'child2-component': Child2
    },
    methods: {
        incrementTotal: function() {
            this.total += 1
        }
    }
}
</script>
<style scoped>
p {
    color: black;
    font-size: 30px;
    text-align: left;
}
</style>
