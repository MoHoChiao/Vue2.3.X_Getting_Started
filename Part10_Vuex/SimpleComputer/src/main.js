import Vue from 'vue';
// 引入 store 資料夾（裡面五隻 js ）
// 預設會去找 index.js  如果沒有的話會報錯！
import store from './store'
import App from './App.vue';

new Vue({
    el: '#app',
    /*
    	加入 store,被掛載的組件將會共享這個store(倉庫)及其下所有狀態值
		由於Vue實體為整個應用程式的根組件,因此表示這個應用程式所有組件都將共享store這個狀態管理機制
    */
    store,
    render: h => h(App)
});
