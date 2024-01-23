let BaseUrl = '' // 这里是一个默认的url，可以没有
switch (process.env.NODE_ENV) {
    case 'development':
        BaseUrl = 'http://127.0.0.1:9095/' // 这里是本地的请求url
        // BaseUrl = 'http://49.233.28.188:9093/' // 生产环境url
        break
    case 'alpha': // 注意这里的名字要和设置的模式名字对应起来
        BaseUrl = 'https://vue-typescript-admin-mock-server.armour.now.sh/mock-api/v1/' // 这里是测试环境中的url
        break
    case 'production':
        BaseUrl = 'http://49.232.175.251:9095/' 
        break
}
export default BaseUrl
