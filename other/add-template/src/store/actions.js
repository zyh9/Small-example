import {types} from './types.js'
// console.log(types)
const actions = {
    //库存不足
    backIndex({commit},val){
        commit(types.BACK_INDEX,val)
    },
    //新订单
    newOrder({commit},val){
        commit(types.NEW_ORDER,val)
    },
}

export default actions;
