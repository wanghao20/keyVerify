import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import BaseUrl from '@/config/baseUrl'
import { Notification } from 'element-ui';
import { StaticStr } from '@/config/StaticStr';
const service = axios.create({
    baseURL: BaseUrl, // 服务器地址
    timeout: 5000 // 超时time
})

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 在每个请求中添加X-Access-Token头，您可以在这里添加其他自定义头
        if (UserModule.token) {
            config.headers['authentication'] = UserModule.token
        }
        return config
    },
    (error) => {
        Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 这里有一些示例代码：
        // code == 20000: success
        // code == 50001: invalid access token
        // code == 50002: already login in other place
        // code == 50003: access token expired
        // code == 50004: invalid user (user not exist)
        // code == 50005: username or password is incorrect
        // 您可以更改此部件以供您自己使用。
        const res = response.data
        if (res.code !== 200) {
            if (res.code === StaticStr.ERR_CODE_LOGIN) {
                MessageBox.confirm(
                    '您已退出，请尝试重新登录.',
                    'Log out',
                    {
                        confirmButtonText: 'Relogin',
                        cancelButtonText: 'Cancel',
                        type: 'warning'
                    }
                ).then(() => {
                    UserModule.ResetToken()
                    location.reload() // 防止vue路由器出现错误
                })
            } else if (res.code === StaticStr.ERR_CODE_DEFAULT) {
                Notification({
                    title: "提示",
                    message: res.msg,
                    type: "warning",
                    duration: StaticStr.CODE_TIME,
                });
                return response.data
            } else {

                return Promise.reject(new Error(res.msg || 'Error'))
            }
        } else {
            return response.data
        }
    },
    (error) => {
        console.log(error)
        Message({
            message: error.message,
            type: 'error',
            duration: StaticStr.CODE_TIME,
        })
        return Promise.reject(error)
    }
)

export default service
