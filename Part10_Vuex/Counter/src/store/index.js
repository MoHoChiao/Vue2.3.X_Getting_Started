import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations } from './mutations.js'
import * as getters from './getters.js'
import * as actions from './actions.js'

//一定要調用Vuex進來!!!
Vue.use(Vuex);

//宣告一個狀態管理容器(Store)
export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions,

    // 嚴格模式，禁止直接修改 state
    strict: true
});
