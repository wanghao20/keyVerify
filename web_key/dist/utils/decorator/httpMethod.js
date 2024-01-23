"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.all = exports.head = exports.options = exports.patch = exports.put = exports.del = exports.get = exports.post = void 0;
require("reflect-metadata");
const Constants_1 = require("../../config/Constants");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc 生成 http method 装饰器
 * @param {string} method - http method，如 get、post、head
 * @return Decorator - 装饰器
 */
function createMethodDecorator(method) {
    // 装饰器接收路由 path 作为参数
    return function httpMethodDecorator(path, isVerify) {
        return (proto, name) => {
            const target = proto.constructor;
            const routeMap = Reflect.getMetadata(Constants_1.ROUTER_MAP, target, "method") || [];
            routeMap.push({ name, method, path, "isVerify": !!isVerify });
            Reflect.defineMetadata(Constants_1.ROUTER_MAP, routeMap, target, "method");
        };
    };
}
// 导出 http method 装饰器
/**
 * POST动词最常用于创建**新资源
 */
exports.post = createMethodDecorator("post");
/**
 *  GET方法用于**读取（或检索）资源的表示
 */
exports.get = createMethodDecorator("get");
/**
 * DELETE用于**删除由URI标识的资源。
 */
exports.del = createMethodDecorator("del");
/**
 * PUT最常用于更新功能，
 */
exports.put = createMethodDecorator("put");
/**
 * 是对 PUT 方法的补充，用来对已知资源进行局部更新 。
 */
exports.patch = createMethodDecorator("patch");
/**
 * options询问支持的方法
 */
exports.options = createMethodDecorator("options");
/**
 * HEAD：获取报文首部
 * 与GET类似，只是不返回报文主体部分。一般用于确认URI的有效性以及资源的更新日期时间等。
 */
exports.head = createMethodDecorator("head");
exports.all = createMethodDecorator("all");
