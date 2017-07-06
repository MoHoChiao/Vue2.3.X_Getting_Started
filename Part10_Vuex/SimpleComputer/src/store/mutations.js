import * as types from './mutations_type.js'

// state
export const state = {
    count: 0
}

// mutations
export const mutations = {
    // numObject參數是接收 commit 傳遞的值: numObject
    // 計算邏輯，改變 state
    [types.ADD](state, numObject) {
        // 在 mutation 改變 state（只有 mutation 可以改變！）
        state.count = Number(numObject.num1) + Number(numObject.num2);
        console.log('state.count=' + state.count);
    },
    [types.SUB](state, numObject) {
        // 在 mutation 改變 state（只有 mutation 可以改變！）
        state.count = Number(numObject.num1) - Number(numObject.num2);
        console.log('state.count=' + state.count);
    },
    [types.MULTIPLY](state, numObject) {
        // 在 mutation 改變 state（只有 mutation 可以改變！）
        state.count = Number(numObject.num1) * Number(numObject.num2);
        console.log('state.count=' + state.count);
    },
    [types.DEVIDE](state, numObject) {
        // 在 mutation 改變 state（只有 mutation 可以改變！）
        state.count = Number(numObject.num1) / Number(numObject.num2);
        console.log('state.count=' + state.count);
    },
    [types.RESET](state) {
        // 在 mutation 改變 state（只有 mutation 可以改變！）
        // 歸零，就將 state 設定為 0
        state.count = 0;
    },
}
