"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const tslib_1 = require("tslib");
// app.ts
const cors = require("@koa/cors");
const Router = require("@koa/router");
const Koa = require("koa");
require("reflect-metadata");
const base_1 = require("./config/base");
const routes_1 = require("./routes/routes");
const logger_1 = require("./utils/logger");
const reqfilter_1 = require("./utils/reqfilter");
const koaBody = require("koa-body");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：启动类,初始化数据
 */
class App {
    constructor() {
        this.app = new Koa();
        this.router = new Router();
        this.filter = new reqfilter_1.Filter();
        this.init().catch((error) => {
            // tslint:disable-next-line:no-console
            console.log(error);
            logger_1.logError("init error:" + error);
        });
    }
    /**
     * 初始化数据
     */
    initData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    /**
     * 装配各种中间件
     */
    init() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 解决微信支付通知回调数据
            // this.app.use(
            //     xmlParser()
            // );
            // koa(这个放第一个,要不然跨域会无效)
            this.app.use(cors());
            // 接收文件上传
            this.app.use(koaBody({
                "multipart": true,
                "formidable": {
                    "maxFileSize": 200 * 1024 * 1024 // 设置上传文件大小最大限制，默认2M
                }
            }));
            // http请求记录
            this.app.use(logger_1.logHttp());
            // 接收到数据过滤无效请求
            this.app.use(this.filter.reqfilter());
            // add route
            routes_1.addRouter(this.router);
            this.app.use(this.router.routes()).use(this.router.allowedMethods());
        });
    }
    /**
     * 服务器需要启动的服务
     */
    start() {
        // 接管数据库logger
        // Object.assign(mongodbConfig, { "logger": new MongoDbLogger() });
        // 数据库连接列表
        // const cxn = [mysqlConfig, mongodbConfig];
        this.app.listen(base_1.BaseConfig.PORT, () => {
            console.log("服务器开启成功!" + base_1.BaseConfig.PORT);
        });
    }
}
exports.App = App;
