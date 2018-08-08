import {types} from './types.js'

// 定义state的值
const state = {
    backIndex:false,
    newOrder:false
}

// 每个action的提交引发state的改变
const mutations = {
    [types.BACK_INDEX](state,val){
        state.backIndex = val;
    },
    [types.NEW_ORDER](state,val){
        state.newOrder = val;
    },
}

// 获取到变化的值
const getters = {
    backIndex(state){
        return state.backIndex;
    }
}

// 导出
export default{
	state,
	mutations,
	getters
}
