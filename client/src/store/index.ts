import Vue from 'vue'
import Vuex from 'vuex'
import { IAppState } from './modules/app'
import { IUserState } from './modules/user'

Vue.use(Vuex)

export interface IRootState {
    app: IAppState
    user: IUserState
}
// 首先声明空存储，然后动态注册所有模块。
export default new Vuex.Store<IRootState>({})
