"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addRouter = void 0;
const fs = require("fs");
const path = require("path");
const path_1 = require("path");
require("reflect-metadata");
const Constants_1 = require("../config/Constants");
const ctrPath = path_1.resolve(__dirname, "../controllers");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：路由扫描自动添加,路径=controllers下文件夹名+ts文件内方法注解配置名
 */
const addRouter = (router) => {
    // 递归扫描controller文件夹，收集所有controller
    // 文件夹名称单独定义不能放在递归方法
    let derName = "";
    recursion(ctrPath);
    /**
     * 递归获取所有ts文件添加到路由
     * @param m 方法
     * @param derName 文件名
     */
    // tslint:disable-next-line:completed-docs
    function recursion(folderName) {
        // 递归扫描所有文件夹内的文件添加到路由
        // 拿到具体文件
        fs.readdirSync(folderName).forEach((name) => {
            if (/^[^.]+\.ts$/.test(name)) {
                binding(require(path.join(folderName, name)).default, derName);
                return true;
            }
            // 拿到子文件路径
            const fileN = path.join(folderName, name);
            // 转换文件对象
            const file = fs.lstatSync(fileN);
            // 是文件夹递归调用
            if (file.isDirectory()) {
                // 叠加文件夹名称递归调用
                derName = (derName + "/" + name);
                recursion(fileN);
                // 第一次循环结束初始化文件夹名称
                derName = "";
            }
            return null;
        });
    }
    /**
     * 结合meta数据添加路由
     * @param m 方法
     * @param derName 文件名
     */
    // tslint:disable-next-line:completed-docs
    function binding(m, derName) {
        const routerMap = Reflect.getMetadata(Constants_1.ROUTER_MAP, m, "method") || [];
        if (routerMap.length) {
            const ctr = new m();
            routerMap.forEach((route) => {
                // const { name, method, path } = route;
                const path = derName + route.path;
                const name = route.name;
                const method = route.method;
                const obj = ctr[name].bind(ctr);
                // router[method](path, ctr[name].bind(ctr));
                router[method](path, obj);
                // console.log("添加路由成功:" + path);
            });
        }
    }
};
exports.addRouter = addRouter;
