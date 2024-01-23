"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLimiterConfig = void 0;
/**
 * 获取限流配置
 * @param id  对比请求(可设置为用户id)
 * @param redis // 内存或Redis [redis] 实例
 * @desc：限流工具类
 * 文档:https://github.com/koajs/ratelimit
 */
exports.getLimiterConfig = (id, redis) => {
    // 定义返回体
    const body = {
        "status": 200,
        "data": {
            "code": 429,
            "msg": "操作失败!,请求次数过快!"
        },
    };
    return {
        "driver": "redis",
        "db": redis,
        "duration": 3000,
        "errorMessage": body,
        "id": id,
        "headers": {
            "Retry-After": "10000",
            "reset": "Limit",
            "total": "Limit"
        },
        "max": 500,
        "disableHeader": false,
        "whitelist": () => {
            // 白名单配置
            // return true
        },
        "blacklist": () => {
            // 黑名单配置
            // return true
        }
    };
};
