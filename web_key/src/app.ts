// app.ts
import cors = require("@koa/cors");

import Router = require("@koa/router");

import Koa = require("koa");

import "reflect-metadata";

import { BaseConfig } from "./config/base";
import { addRouter } from "./routes/routes";
import { logError, logHttp } from "./utils/logger";
import { Filter } from "./utils/reqfilter";
const koaBody = require("koa-body");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：启动类,初始化数据
 */

export class App {
    /**
     * Koa对象
     */
    private readonly app: Koa;
    /**
     * 过滤器
     */
    private readonly filter: Filter;
    /**
     * Router对象
     */
    private readonly router: Router;
    constructor() {
        this.app = new Koa();
        this.router = new Router();
        this.filter = new Filter();
        this.init().catch((error) => {
            // tslint:disable-next-line:no-console
            console.log(error);
            logError("init error:" + error);
        });

    }
    /**
     * 初始化数据
     */
    public async initData() {
    }

    /**
     * 装配各种中间件
     */
    private async init() {
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
                "maxFileSize": 200 * 1024 * 1024	// 设置上传文件大小最大限制，默认2M
            }
        }));
        // http请求记录
        this.app.use(logHttp());
        // 接收到数据过滤无效请求
        this.app.use(this.filter.reqfilter());
        // add route
        addRouter(this.router);
        this.app.use(this.router.routes()).use(this.router.allowedMethods());
    }

    /**
     * 服务器需要启动的服务
     */
    public start() {
        // 接管数据库logger
        // Object.assign(mongodbConfig, { "logger": new MongoDbLogger() });
        // 数据库连接列表
        // const cxn = [mysqlConfig, mongodbConfig];

        this.app.listen(BaseConfig.PORT, () => {
            console.log("服务器开启成功!" + BaseConfig.PORT);
        });
    }
}
