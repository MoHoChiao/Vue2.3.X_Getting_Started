# Part 5 Filter(資料的格式化)

從VueJS 2.0以後，過濾器只能用在Mustache語法的內文綁定及v-bind表達式之中：
```
<!-- in mustaches(利用Filter A格式化資料message) -->
{{ message | filterA }}
<!-- in v-bind(利用Filter B格式化資料rawId) -->
<div v-bind:id="rawId | filterB"></div>
過濾器之間可以串聯在一起：
<!-- in mustaches(資料message先經過Filter A後,再流經Filter B) -->
{{ message | filterA | filterB }}
過濾器其實是Vue實體中的 JavaScript 函數之形式，因此可以接受參數：
<!-- in mustaches(資料message先經過Filter A,同時可以把兩個參數傳給Filter A) -->
{{ message | filterA('arg1', arg2) }}
```
完整***[filter.html](./filter.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>filter</title>
</head>
<body>
    <!--簡單的DOM元素(View)-->
    <div id="app">
        <!--把message資料套用capitalize這個Filter-->
        <div>{{ message | capitalize }}</div>
        <!--把message資料套用reverse這個Filter-->
        <div>{{ message | reverse }}</div>
        <!--把message資料先套用capitalize後,再套用reverse-->
        <div>{{ message | capitalize | reverse }}</div>
        <!--把message資料先套用reverse後,再套用capitalize-->
        <div>{{ message | reverse | capitalize }}</div>
        <!--把message資料套用pluswords這個Filter,同時代入指定字串-->
        <div>{{ message | pluswords('-AsignWords') }}</div>
    </div>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<script>
// 創建一个 Vue 實體或稱 "ViewModel"
var vm = new Vue({
    el: '#app',
    data: {
        message: 'i am leo'
    },
    //指定這個Vue實體(ViewModel)所擁有的Filters
    filters: {
        //定義一個可以把資料(value=message)的第一個字母格式化為大寫的Filter
        capitalize: function(value) {
            if (!value) return ''
            value = value.toString()
            return value.charAt(0).toUpperCase() + value.slice(1)
        },
        //定義一個可以把資料(value=message)做反轉格式化的Filter
        reverse: function(value) {
            if (!value) return ''
            value = value.toString()
            return value.split('').reverse().join('')
        },
        //定義一個可以把資料(value=message)加入指定字串在後端的Filter
        pluswords: function(value, data) {
            if (!value) return ''
            value = value.toString()
            return value + data
        }
    }
})
</script>
</html>
```