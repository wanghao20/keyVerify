/* 禁用eslint不使用控制台 */
/**
 * service worker是在后台运行的一个线程，可以用来处理离线缓存、消息推送、后台自动更新等任务。
 * registerServiceWorker就是为react项目注册了一个service worker，用来做资源的缓存，这样你下次访问时，
 * 就可以更快的获取资源。而且因为资源被缓存，所以即使在离线的情况下也可以访问应用（此时使用的资源是之前缓存的资源）。
 * 注意，registerServiceWorker注册的service worker 只在生产环境中生效（process.env.NODE_ENV === 'production'），
 * 所以开发的时候，可以注释掉，当然生产模式下，也可以不用这个功能。
 */
import { register } from 'register-service-worker'
import BaseUrl from './config/baseUrl'

if (process.env.NODE_ENV === 'production') {
    register(`${BaseUrl}service-worker.js`, {
        ready() {
            console.log(
                'App is being served from cache by a service worker.\n' +
                'For more details, visit https://goo.gl/AFskqB'
            )
        },
        registered() {
            console.log('服务人员已注册')
        },
        cached() {
            console.log('内容已被缓存以供离线使用')
        },
        updatefound() {
            console.log('正在下载新内容.')
        },
        updated() {
            console.log('新内容可用； 请刷新')
        },
        offline() {
            console.log('未找到互联网连接。 应用正在离线模式下运行。')
        },
        error(error) {
            console.error('服务人员注册期间发生错误：', error)
        }
    })
}
