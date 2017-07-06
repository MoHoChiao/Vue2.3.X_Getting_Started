# Part 4 Computed Properties-綁定資料屬性的異動

簡單來說就是有邏輯能力的屬性，允許把較複雜的邏輯綁定在資料屬性上面，**一但資料有所變化時，這個具有邏輯能力的屬性才會重新被執行邏輯進而計算出最新的屬性值，否則它只會取在緩存中的上一次的值來給你**，這一點上它和 Part 4 所介紹的**Watch**是相同的。其完整***[computed-properties.html](./computed-properties.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>computed-properties</title>
</head>
<body>
    <!--簡單的DOM元素(View)-->
    <div id="app">{{ computed_fullName }}</div>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<script>
// 創建一个 Vue 實體或稱 "ViewModel"
var vm = new Vue({
    el: '#app',
    data: {
        firstName: 'Leo',
        lastName: 'Liu',
        fullName: 'Leo Liu'
    },
    //指定這個Vue實體(ViewModel)所要綁定的資料屬性以及資料屬性值改變後所要應對的方法
    //應對的方法會自動傳入改變後的新資料屬性值
    computed: {
        //定義了一個計算屬性及其對應的getter方法,用來取值的getter方法是必要存在
        computed_fullName: function() {
            alert("fristName or lastName has been changed.")
            //只要在getter方法中出現的資料屬性都會被自動綁定在這個計算屬性上
            //例如firstName及lastName,只要它們其中任何一個的值改變,則計算屬性computed_fullName會立即執行且回傳值
            return this.firstName + ' ' + this.lastName
        }
    }
})
</script>
</html>
```
**Computed Properties**、**Watch**、**Methods**之間的差異如下：

* **Computed Properties**只要所綁定的資料屬性有異動，立刻執行對應的方法，VueJS會自動的綁定，不需要像 Part 4 的**Watch**一樣自己指定各個資料屬性的綁定工作。傳統的**Methods**是沒有跟任何資料屬性綁定的，它只不過是一段你所撰寫的邏輯而已。

* **Computed Properties**較**Watch**簡潔好管理，因為只要其**getter方法**中有運用到的資料屬性都會自動和計算屬性做綁定，而反觀**Watch**則需要一個一個資料屬性來做綁定，如果需要監看的資料屬性很多，那麼程式碼會變的非常冗長且不易維護。不過**Watch**在某些使用情境上比**Computed Properties**更具彈性。
