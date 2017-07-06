# Part 7 路由器(Single Page Routing)

使用**vue-router**創建單頁應用是非常簡單的。使用Vue.js ，我們已經可以通過組合組件來組成應用程序，當你要把vue-router 添加進來，我們需要做的是，將組件(components)映射到路由(routes)，然後告訴vue-router 在哪裡渲染它們：

* JavaScript：

    1. 創建你所需要的組件(如同上述章節所提)

    2. 創建VueRouter實體，以及定義路由和各個組件之間的映射關係。

    3. 啟動路由器。

* HTML：

    4. 使用<router-link>

    5. 使用<router-view>

完整***[basic-router.html](./basic-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>basic-router</title>
</head>
<body>
    <div id="app">
        <h1>Basic Router</h1>
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <router-link to="/home">Home</router-link>
        <router-link to="/about">About</router-link>
        <!--使用內建組件router-link進行導航(Vue2.X版),此語法可加入tag元素,例如這裡是li-->
        <router-link tag="li" to="/home">
            <a>Home</a>
        </router-link>
        <router-link tag="li" to="/about">
            <a>About</a>
        </router-link>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--Home這個子組件的template內容-->
    <script type="text/x-template" id="home">
        <div>
            <h1>Home</h1>
            <p>{{msg}}</p>
        </div>
    </script>
    <!--About這個子組件的template內容-->
    <script type="text/x-template" id="about">
        <div>
            <h1>About</h1>
            <p>{{msg}}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立Home這個子組件
var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            msg: "Routing to 'Home' Component."
        }
    }
})
//建立About這個子組件
var About = Vue.extend({
    template: '#about',
    data: function() {
        return {
            msg: "Routing to 'About' Component."
        }
    }
})
/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
var router = new VueRouter({
    routes: [{
        path: '/home',
        component: Home
    }, {
        path: '/about',
        component: About
    }, {
        path: '/',
        redirect: '/home'
    }]
})
new Vue({
    el: '#app',
    //啟動路由
    router: router
})
</script>
</html>
```

## 7.1 動態路由(Dynamic Routing)

簡單來說，即某種路由模式都對映到同一個組件，這是很常見的需求。例如，我們有一個 User 組件，對於所有 User Name 各不相同的用戶，都要使用同一個User組件：
```
routes: [
    // 動態路徑參數以冒號開頭
    { path: '/user/:username', component: User }
]
```
User組件被使用時，會接收到從路徑傳來的username參數及其值：
```
$route.params.username
```
每一個『路徑參數』使用冒號 : 標記。當然，路徑中的動態參數可以有很多組：

| 模式                                | 對應路徑              | $route.params                            |
| ----------------------------------- | -------------------- | ---------------------------------------- |
| /user/:username                     |  /user/evan          | ```{ username: 'evan' }```               |
| /user/:username/post/:post_id       |  /user/evan/post/123 | ```{ username: 'evan', post_id: 123 }``` |

使用動態路由時，組件實體會被復用。因為每一個不同的路徑參數值都會對應到同一個組件(User)，比起銷毀再創建，復用則顯得更加高效。不過，這也意味著組件的生命週期方法不會再被調用。復用組件時，想對路由參數的變化作出響應的話，可以使用watch來監測$route的變化即可：
```
watch: {
    '$route' (to, from) {
      //對路由參數的變化作出響應...  
    }
}
```
我們簡單設計了一個User物件，他使用動態路由來對映，路由參數有user name及post_id。同時，當路由的參數值變動的話，User組件會經由watch來監測$route並作出反應。完整***[dynamic-router.html](./dynamic-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>dynamic-router</title>
</head>
<body>
    <div id="app">
        <h1>Basic Router</h1>
        <div>
            <!--宣告兩個雙向綁定-->
            <input type="text" v-model="user_name" placeholder="使用者名稱" />
            <input type="text" v-model="user_id" placeholder="使用者識別號" />
            <!--
                使用內建組件router-link進行導航(Vue2.X版).
                routing_path這個計算屬性單向綁定於路徑及參數.
                只要輸入的name或id改變,立刻會使計算屬性重新執行,進而回傳新的路徑
                按下送出使用者資料後,會以新的路徑來傳遞參數
            -->
            <router-link v-bind:to="routing_path">送出使用者資料</router-link>
        </div>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--User這個子組件的template內容-->
    <script type="text/x-template" id="user">
        <div>
            <h1>User</h1>
            <p>{{msg}}</p>
            <!--使用$route.params存取路由參數-->
            <p>Your Name:{{ $route.params.username }}</p>
            <p>Your ID:{{ $route.params.post_id }}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立User這個子組件
var User = Vue.extend({
    template: '#user',
    data: function() {
        return {
            msg: "Routing to 'User' Component."
        }
    },
    watch: {
        //監控$route,當路由參數發生變化時執行的函數
        '$route': function(to, from) {
            //from表示原本的路由參數(改變前),to表示現在最新的路由參數(改變後)
            alert(from.params.post_id + " " + from.params.username + "==>" + to.params.post_id + " " + to.params.username)
        }
    }
})
/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
var router = new VueRouter({
    routes: [{
        //這裡使用動態路由,參數以冒號開頭
        path: '/user/name/:username/id/:post_id',
        component: User
    }, {
        path: '/',
        redirect: '/user'
    }]
})
new Vue({
    el: '#app',
    //啟動路由
    router: router,
    data: {
        user_name: 'Leo',
        user_id: '00'
    },
    computed: {
        //定義了一個計算屬性及其對應的getter方法,用來取值的getter方法是必要存在
        routing_path: function() {
            //只要在getter方法中出現的資料屬性都會被自動綁定在這個計算屬性上
            //例如user_name及user_id,只要它們其中任何一個的值改變,則計算屬性routing_path會立即執行且回傳值
            return '/user/name/' + this.user_name + '/id/' + this.user_id
        }
    }
})
</script>
</html>
```

## 7.2 巢狀路由(Nested Routing)

最簡單的說法，使用**children**屬性為某路由(路徑)底下加入其子路由(子路徑)，下列程式碼表示為user這個路由底下加入兩個子路由：
```
routes: [{
        path: '/user',
        component: User,
        //宣告user底下的子路由
        children: [{
            path: 'profile', //路徑為/user/profile時,導向UserProfile組件
            component: UserProfile
        }, {
            path: 'news', //路徑為/user/news時,導向UserProfile組件
            component: UserNews
        }, {
            path: '', //若路徑為空(/user)時,預設為導向UserProfile組件
            component: UserProfile
        }]
    }, {
        path: '/', //若路徑為空(/)時,預設為導向User組件
        redirect: '/user'
}]
```
完整***[nested-router.html](./nested-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>nested-router</title>
</head>
<body>
    <div id="app">
        <h1>Nested Router</h1>
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <router-link to="/user">User</router-link>
        <!--使用內建組件router-link進行導航(Vue2.X版),此語法可加入tag元素,例如這裡是li-->
        <router-link tag="li" to="/user/profile">
            <a>UserProfile</a>
        </router-link>
        <router-link tag="li" to="/user/news">
            <a>UserNews</a>
        </router-link>
        <hr>
        <div>
            <router-view>
                <!--所有Vue實體底下的路由組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--User這個子組件的template內容-->
    <script type="text/x-template" id="user">
        <div>
            <h1>User</h1>
            <p>{{msg}}</p>
            <hr>
            <div>
                <router-view>
                    <!--所有User組件底下的子路由組件內容都會在這裡渲染-->
                </router-view>
            </div>
        </div>
    </script>
    <!--UserProfile這個子組件的template內容-->
    <script type="text/x-template" id="user-profile">
        <div align="center">
            <h1>User Profile</h1>
            <p>{{msg}}</p>
        </div>
    </script>
    <!--UserNews這個子組件的template內容-->
    <script type="text/x-template" id="user-news">
        <div align="center">
            <h1>User News</h1>
            <p>{{msg}}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立User這個子組件
var User = Vue.extend({
    template: '#user',
    data: function() {
        return {
            msg: "Routing to 'User' Component."
        }
    }
})

//建立UserProfile這個子組件
var UserProfile = Vue.extend({
    template: '#user-profile',
    data: function() {
        return {
            msg: "Routing to 'UserProfile' Component."
        }
    }
})

//建立UserNews這個子組件
var UserNews = Vue.extend({
    template: '#user-news',
    data: function() {
        return {
            msg: "Routing to 'UserNews' Component."
        }
    }
})

/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
    children代表某路由底下的子路由
*/
var router = new VueRouter({
    routes: [{
        path: '/user',
        component: User,
        //宣告user底下的子路由
        children: [{
            path: 'profile', //路徑為/user/profile時,導向UserProfile組件
            component: UserProfile
        }, {
            path: 'news', //路徑為/user/news時,導向UserProfile組件
            component: UserNews
        }, {
            path: '', //若路徑為空(/user)時,預設為導向UserProfile組件
            component: UserProfile
        }]
    }, {
        path: '/', //若路徑為空(/)時,預設為導向User組件
        redirect: '/user'
    }]
})

new Vue({
    el: '#app',
    //啟動路由
    router: router
})
</script>
</html>
```

## 7.3 編程式的導航(Programmatic Navigation)

除了使用```<router-link>```創建 a 標籤來定義導航鏈接，我們還可以藉助 router 實例的方法，通過編寫代碼來實現。

### 7.3.1 router.push(location)

想要導航到不同的 URL，則使用 **router.push** 方法。這個方法會向 history 棧添加一個新的記錄，所以，當用戶點擊瀏覽器後退按鈕時，則回到之前的 URL。當你點擊 ```<router-link>``` 時，其實這個方法就會偷偷的在背後調用，所以說，點擊 ```<router-link :to="...">``` 等同於調用 **router.push(...)**。

| 聲明式                              | 編程式                   |
| ----------------------------------- | ----------------------- |
| ```<router-link :to="...">```       |  ```router.push(...)``` |

該方法的參數可以是一個字符串路徑，或者一個描述地址的對象。例如：
```
// 字符串
router.push('home')
// 對象
router.push({ path: 'home' })
// 命名的路由
router.push({ name: 'user', params: { userId: 123 }})
// 帶查詢參數，變成 /register?plan=private
router.push({ path: 'register', query: { plan: 'private' }})
```
### 7.3.2 router.replace(location)

跟 **router.push** 很像，唯一的不同就是，它不會向 history 添加新記錄，而是跟它的方法名一樣 —— 替換掉當前的 history 記錄。

| 聲明式                                | 編程式                      |
| ------------------------------------- | -------------------------- |
| ```<router-link :to="..." replace>``` |  ```router.replace(...)``` |

### 7.3.3 router.go(n)

這個方法的參數是一個整數，意思是在 history 記錄中向前或者後退多少步，類似 **window.history.go(n)**。例如：
```
// 在瀏覽器記錄中前進一步，等同於 history.forward()
router.go(1)
// 後退一步記錄，等同於 history.back()
router.go(-1)
// 前進 3 步記錄
router.go(3)
// 如果 history 記錄不夠用，那就默默地失敗唄
router.go(-100)
router.go(100)
```

## 7.4 命名的路由(Named Routing)

在有些情況下，給一條路徑加上一個名字能夠讓我們更方便地進行路徑的跳轉，尤其是在路徑較長的時候。你可以在創建 Router 實例的時候，在 routes 配置中給某個路由設置名稱：
```
const router = new VueRouter({
  routes: [
    {
      path: '/user/:userId',
      name: 'user',
      component: User
    }
  ]
})
```
要鏈接到一個命名路由，可以給 **router-link 的 to 屬性傳一個物件的型式**：

```<router-link :to="{ name: 'user', params: { id: 123 }}">User</router-link>```

這跟代碼調用 **router.push()** 是一樣的：

```router.push({ name: 'user', params: { userId: 123 }})```

完整***[named-router.html](./named-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Named-router</title>
</head>
<body>
    <div id="app">
        <h1>Named Router</h1>
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <!--給 router-link 的 to 屬性傳一個物件型式,只需要指定name就可以了,不用指明完整的路徑-->
        <!--另外如果有動態路徑參數的話,要物件之中要定義params-->
        <router-link :to="{ name: 'user', params: { id: 123 }}">User</router-link>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--User這個子組件的template內容-->
    <script type="text/x-template" id="user">
        <div>
            <h1>User</h1>
            <p>ID:{{ $route.params.id }}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立User這個子組件
var User = Vue.extend({
    template: '#user'
})

/* 

    建立路由器 

    建立路由路徑與組件之間的映射關係

*/
var router = new VueRouter({
    routes: [{
        //宣告此路徑的名稱
        name: 'user',
        //故意把路徑定義的比較複雜一點
        path: '/home/customer/user/:id',
        component: User
    }]
})

new Vue({
    el: '#app',
    //啟動路由
    router: router
})

</script>
</html>
```

## 7.5 命名的視圖(Named Router-View)

有時候想同時（同級）展示多個視圖，而不是像7.2節的**Nested**方式，例如創建一個佈局，有 sidebar（側導航） 和 main（主內容） 兩個視圖，這個時候命名視圖就派上用場了。你可以在界面中擁有多個單獨命名的視圖，而不是只有一個單獨的出口。如果 **router-view** 沒有設置名字，那麼默認為 default。
```
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
```
一個**router-view**可以塞入一個組件：
```
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```
完整***[named-view-router.html](./named-view-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>named-view-router</title>
</head>
<body>
    <div id="app">
        <h1>Named Views</h1>
        <ul>
            <li>
                <router-link to="/">/</router-link>
            </li>
            <li>
                <router-link to="/other">/other</router-link>
            </li>
        </ul>
        <router-view class="view one"></router-view>
        <router-view class="view two" name="a"></router-view>
        <router-view class="view three" name="b"></router-view>
    </div>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
const Foo = {
    template: '<div>foo</div>'
}
const Bar = {
    template: '<div>bar</div>'
}
const Baz = {
    template: '<div>baz</div>'
}

/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
const router = new VueRouter({
    routes: [{
        path: '/',
        // 單一一個路由可以定義很多個被命名的組件
        // 這些被命名的組件必須和router-view裡的name對應
        // 其中default表示對應的是沒有命名的router-view
        components: {
            default: Foo,
            a: Bar,
            b: Baz
        }
    }, {
        path: '/other',
        components: {
            default: Baz,
            a: Bar,
            b: Foo
        }
    }]
})

new Vue({
    router,
    el: '#app'
})
</script>
</html>
```

## 7.6 重新導向與別名(Redirect and Alias)

### 7.6.1 重新導向

網頁重新導向也是通過 routes 配置來完成，下面例子是從 /a 重導到 /b：
```
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: '/b' }
  ]
})
```
網頁重新導向的目標也可以是一個命名的路由：
```
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: { name: 'foo' }}
  ]
})
```
甚至是一個方法，動態返回重新導向目標：
```
const router = new VueRouter({
  routes: [
    { path: '/a', redirect: to => {
      // 方法接收 目标路由 作为参数
      // return 重定向的 字符串路径/路径对象
    }}
  ]
})
```
### 7.6.2 別名

『重新導向』的意思是，當用戶訪問 /a時，URL 將會被替換成 /b，然後匹配路由為 /b。而別名是指/a 的別名是 /b，意味著，當用戶訪問 /b 時，URL 會保持為 /b，但是路由匹配則為 /a，就像用戶訪問 /a 一樣。
```
const router = new VueRouter({
  routes: [
    { path: '/a', component: A, alias: '/b' }
  ]
})
```
『別名』的功能讓你可以自由地將 UI 結構映射到任意的 URL，而不是受限於配置的路由結構。

## 7.7 Navigation Guards

**vue-router** 提供的**navigation guards**主要用來攔截導航，讓它完成跳轉或取消，簡單的說就是讓你有機會去介入路由的過程。有多種方式可以在路由導航發生時執行guards：**全局的**, **單個路由獨享的**, 或者**組件級的**。

### 7.7.1 全局影響的navigation guards

你可以使用 **router.beforeEach** 註冊一個全局的**navigation guards**：
```
const router = new VueRouter({ ... })
router.beforeEach((to, from, next) => {
  // ...
})
```
**router.beforeEach**在路由切換開始時調用，它有下列三個參數：

* to：即將要進入的目標之**路由訊息物件(Route Object)**。

* from：當前導航正要離開的**路由訊息物件(Route Object)**。

* next：一定要調用該方法來 resolve 這個**navigation guards**。執行效果依賴 next 方法的調用參數如下：

    * ```next()```進行路由中的下一站。如果全部路由都執行完了，則導航的狀態就是 confirmed （確認的）。

    * ```next(false)```中斷當前的導航。即使是使用者的瀏覽器之 URL 改變了(可能是用戶手動或者瀏覽器後退按鈕)，其 URL 地址也是會重置到 from 路由對應的地址(即最終是完全沒改變URL)。

    * ```next('/') 或者 next({ path: '/' })```跳轉到一個不同的地址。當前的導航被中斷，然後進行一個新的導航。

你可以使用**router.afterEach** 註冊一個全局的**navigation guards**：
```
router.afterEach(route => {
  // ...
})
```
**其中route即為路由訊息物件(Route Object)**。**afterEach方法**會在每次路由成功切換完成之時被調用，由於路由已完全結束，因此不能改變導航，不需要提供**next函數**。

完整***[global-navigation-guards-router.html](./global-navigation-guards-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>global-natigationguards-router</title>
</head>
<body>
    <div id="app">
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <router-link to="/home">Home</router-link>
        <router-link to="/about">About</router-link>
        <!--使用內建組件router-link進行導航(Vue2.X版),此語法可加入tag元素,例如這裡是li-->
        <router-link tag="li" to="/home">
            <a>Home</a>
        </router-link>
        <router-link tag="li" to="/about">
            <a>About</a>
        </router-link>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--Home這個子組件的template內容-->
    <script type="text/x-template" id="home">
        <div>
            <h1>Home</h1>
            <p>{{msg}}</p>
        </div>
    </script>
    <!--About這個子組件的template內容-->
    <script type="text/x-template" id="about">
        <div>
            <h1>About</h1>
            <p>{{msg}}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立Home這個子組件
var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            msg: "Routing to 'Home' Component."
        }
    }
})
//建立About這個子組件
var About = Vue.extend({
    template: '#about',
    data: function() {
        return {
            msg: "Routing to 'About' Component."
        }
    }
})
/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
var router = new VueRouter({
    routes: [{
        path: '/home',
        component: Home
    }, {
        path: '/about',
        component: About
    }, {
        path: '/',
        redirect: '/home'
    }]
})
//此方法為全局的Navigation Guards, 每一個路由的切換開始時調用
router.beforeEach((to, from, next) => {
    alert("From Path[" + from.path + "] To Path[" + to.path + "]")
    next()
})
//此方法為全局的Navigation Guards, 每次路由成功切換完成之時被調用
router.afterEach(route => {
    alert("Welcome to path[" + route.path + "]")
})
new Vue({
    el: '#app',
    //啟動路由
    router: router
})
</script>
</html>
```
### 7.7.2 路由訊息物件(Route Object)

一個 **route object（路由訊息物件）** 表示當前激活的路由的狀態信息，包含了當前 URL 解析得到的訊息，還有 URL 匹配到的 route records（路由記錄）。**route object 是 immutable**(不可變) 的，每次成功的導航後都會產生一個新的**route object**。**route object** 會出現在許多的地方：

* 組件內的 this.$route 和 $route watcher (監測變化處理)：
```
watch: {
        //監控$route,當路由參數發生變化時執行的函數
        '$route': function(to, from) {
            // to 和 from 都是route object(路由訊息物件)
        }
    }
```
* router.match(location) 的返回值。

* navigation guards的參數：
```
router.beforeEach((to, from, next) => {
  // to 和 from 都是route object(路由訊息物件)
})
```
* scrollBehavior 方法的參數：
```
const router = new VueRouter({
  scrollBehavior (to, from, savedPosition) {
    // to 和 from 都是route object(路由訊息物件)
  }
})
```
**route object(路由訊息物件)的屬性如下：**

* $route.path

    * 類型: string

    * 字串，對應當前路由的路徑，總是解析為絕對路徑，如 "/foo/bar"。

* $route.params

    * 類型: Object

    * 一個 key/value 的集合，包含了路由參數，如果沒有路由參數，就是一個空物件。

* $route.query

    * 類型: Object

    * 一個 key/value 集合，表示 URL 查詢參數。例如，對於路徑 /foo?user=1，則有 $route.query.user == 1，如果沒有查詢參數，則是個空物件。

* $route.hash

    * 類型: string

    * 當前路由的 hash 值 (帶 #) ，如果沒有 hash 值，則為空字串。

* $route.fullPath

    * 類型: string

    * 完成解析後的 URL，包含查詢參數和 hash 的完整路徑。

* $route.matched

    * 類型: Array<RouteRecord>

    * 一個記錄的陣列，包含當前路由的所有Nested路徑片段的路由記錄：
```
const router = new VueRouter({
  routes: [
    // 下面的物件就是 route record
    { path: '/foo', component: Foo,
      children: [
        // 這也是個 route record
        { path: 'bar', component: Bar }
      ]
    }
  ]
})
```

* $route.name

    * 類型: string

    * 當前路由的名稱，如果有的話。

### 7.7.3 單個路由被影響的navigation guards

在單個路由中直接設定**beforeEnter**這個guards，它的作用域只有在這個路由上而已：
```
const router = new VueRouter({
  routes: [
    {
      path: '/foo',
      component: Foo,
      beforeEnter: (to, from, next) => {
        //只有在/foo這個路徑才會觸發
      }
    }
  ]
})
```
完整***[private-navigation-guards-router.html](./private-navigation-guards-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>private-natigationguards-router</title>
</head>
<body>
    <div id="app">
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <router-link to="/home">Home</router-link>
        <router-link to="/about">About</router-link>
        <!--使用內建組件router-link進行導航(Vue2.X版),此語法可加入tag元素,例如這裡是li-->
        <router-link tag="li" to="/home">
            <a>Home</a>
        </router-link>
        <router-link tag="li" to="/about">
            <a>About</a>
        </router-link>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--Home這個子組件的template內容-->
    <script type="text/x-template" id="home">
        <div>
            <h1>Home</h1>
            <p>{{msg}}</p>
        </div>
    </script>
    <!--About這個子組件的template內容-->
    <script type="text/x-template" id="about">
        <div>
            <h1>About</h1>
            <p>{{msg}}</p>
        </div>
    </script>
</body>

<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立Home這個子組件
var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            msg: "Routing to 'Home' Component."
        }
    }
})
//建立About這個子組件
var About = Vue.extend({
    template: '#about',
    data: function() {
        return {
            msg: "Routing to 'About' Component."
        }
    }
})
/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
var router = new VueRouter({
    routes: [{
        path: '/home',
        component: Home,
        //只有在這個path範圍內(/home)的Navigation Guards, 要切換至此路徑的開始時調用
        beforeEnter: (to, from, next) => {
            alert("From Path[" + from.path + "] To Path[" + to.path + "]")
            next()
        }
    }, {
        path: '/about',
        component: About
    }, {
        path: '/',
        redirect: '/home'
    }]
})
new Vue({
    el: '#app',
    //啟動路由
    router: router
})
</script>
</html>
```
### 7.7.4 單個組件被影響的navigation guards

在要被路由的組件中設定navigation guards，則它所影響的作用域就在這個組件之內的路由而已，有以下三種方法：

* **beforeRouteEnter**：路徑要切換至此組件的開始時被調用。

* **beforeRouteUpdate**：此組件要被複用時被週用。

* **beforeRouteLeave**：離開該組件的對應路由時調用。

下列是Foo組件的設定範例：
```
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    /* 
       要切換至存取此組件的路徑之開始時調用
       不能獲取組件實體 `this`
       因為當guards執行前，組件實體還沒被創建
    */
  },
  beforeRouteUpdate (to, from, next) {
    /* 
       在當前路由改變，但是該組件被復用時調用
       舉例來說，對於一個帶有動態參數的路徑 /user/:id，在 /user/1 和 /user/2 之間跳轉的時候，由於會渲染同樣的 User 組件，因此組件實體會被復用。而這個guards就會在這個情況下被調用。
       可以訪問組件實例 `this`
    */
  },

  beforeRouteLeave (to, from, next) {
    /*
       導航離開該組件的對應路由時調用
       可以訪問組件實體 `this`
    */
  }
}
```
完整***[component-navigation-guards-router.html](./component-navigation-guards-router.html)***範例如下所示：
```
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>component-natigationguards-router</title>
</head>
<body>
    <div id="app">
        <!--使用內建組件router-link進行導航(Vue2.X版)-->
        <router-link to="/home">Home</router-link>
        <router-link to="/user/1">User1</router-link>
        <router-link to="/user/2">User2</router-link>
        <hr>
        <div>
            <router-view>
                <!--所有被routing的組件內容都會在這裡渲染-->
            </router-view>
        </div>
    </div>
    <!--Home這個子組件的template內容-->
    <script type="text/x-template" id="home">
        <div>
            <h1>Home</h1>
            <p>{{msg}}</p>
        </div>
    </script>
    <!--User這個子組件的template內容-->
    <script type="text/x-template" id="user">
        <div>
            <h1>User</h1>
            <p>{{msg}}</p>
            <!--使用$route.params存取路由參數-->
            <p>Your ID:{{ $route.params.id }}</p>
        </div>
    </script>
</body>
<!--使用引入JS檔的方式來引入Vue.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.3.4/vue.min.js"></script>
<!--使用引入JS檔的方式來引入Vue-Router.js-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/vue-router/2.6.0/vue-router.min.js"></script>
<script>
//建立Home這個子組件
var Home = Vue.extend({
    template: '#home',
    data: function() {
        return {
            msg: "Routing to 'Home' Component."
        }
    }
})
//建立User這個子組件
var User = Vue.extend({
    template: '#user',
    data: function() {
        return {
            msg: "Routing to 'User' Component."
        }
    },
    /*

        要切換至存取此組件的路徑之開始時調用

        不能獲取組件實體 `this`,因為當beforeRouteEnter執行前，組件實體還沒被創建

    */
    beforeRouteEnter(to, from, next) {
        alert("Start => From Path[" + from.path + "] To Path[" + to.path + "]")
        next()
    },
    /*
        在當前路由改變，但是該組件被復用時調用
        路徑 /user/:id，在 /user/1 和 /user/2 之間跳轉的時候，由於會引用同樣的User組件
        因此組件實體會被復用。而這個guards就會在這個情況下被調用
    */
    beforeRouteUpdate(to, from, next) {
        alert("Finish => From Path[" + from.path + "] To Path[" + to.path + "]")
        next()
    },
    /*
        導航離開該組件的對應路由時調用
        可以訪問組件實例 `this`
    */
    beforeRouteLeave(to, from, next) {
        alert("Leave => From Path[" + from.path + "] To Path[" + to.path + "]")
        next()
    }
})
/* 
    建立路由器 
    建立路由路徑與組件之間的映射關係
*/
var router = new VueRouter({
    routes: [{
        path: '/home',
        component: Home
    }, {
        path: '/user/:id',
        component: User
    }, {
        path: '/',
        redirect: '/home'
    }]
})
new Vue({
    el: '#app',
    //啟動路由
    router: router
})
</script>
</html>
```
由於**beforeRouteEnter**不能訪問 this，因為這個guards在導航確認前被調用，因此即將登場的新組件還沒被創建。不過，你可以通過傳一個vue實體來給 next，再由vue實體物件來訪問組件實體：
```
beforeRouteEnter (to, from, next) {
  next(vm => {
    // 通過 `vm` (vue實體)訪問組件實體
  })
}
```
> 在beforeRouteLeave 中直接訪問 this。這個leave的guards通常用來禁止用戶在還未保存修改前突然離開。可以通過 next(false) 來取消導航。


