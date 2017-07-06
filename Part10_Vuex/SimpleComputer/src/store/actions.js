// 引入 mutations_type （引用同一個 key）
import * as types from './mutations_type.js'

/*
 * 下面各式中的第二個參數為value,value一定只能有 1 個，如果需要傳遞多個，必須使用 Object 包裝。
 Value它是接收 Vue 傳遞的 value: numObject
 * 在computer.vue的callAction方法中我們是這麼寫的:
 *   this.actionAdd(numObject);
     this.actionSub(numObject);
     this.actionMultiply(numObject);
     this.actionDivide(numObject);
   numObject參數會跟著commit傳過去給mutations.js
 */

export const actionAdd = ({ commit }, numObject) => {
    console.log(numObject.num1 + '+' + numObject.num2);
    commit(types.ADD, numObject);
}

export const actionSub = ({ commit }, numObject) => {
    console.log(numObject.num1 + '-' + numObject.num2);
    commit(types.SUB, numObject);
}

//跟10.4節比較,下面多加了三個actions,分別是乘,除以及reset

export const actionMultiply = ({ commit }, numObject) => {
    console.log(numObject.num1 + '*' + numObject.num2);
    commit(types.MULTIPLY, numObject);
}

export const actionDivide = ({ commit }, numObject) => {
    console.log(numObject.num1 + '/' + numObject.num2);
    commit(types.DEVIDE, numObject);
}

export const actionReset = ({ commit }) => {
    console.log(Reset);
    commit(types.RESET);
}
