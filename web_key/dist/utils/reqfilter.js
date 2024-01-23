"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = require("jsonwebtoken");
const Constants_1 = require("../config/Constants");
const StaticStr_1 = require("../config/StaticStr");
const base_1 = require("../config/base");
const ReturnResult_1 = require("./ReturnResult");
const logger_1 = require("./logger");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：请求验证/过滤
 */
class Filter {
    /**
     * reqfilter
     * @desc：请求验证/过滤
     */
    reqfilter() {
        return (ctx, next) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 参数设置
            ctx.params = Object.assign(Object.assign({}, ctx.request.body), ctx.query);
            try {
                let url = ctx.originalUrl.substring(0, ctx.originalUrl.indexOf("?"));
                if (url === "") {
                    url = ctx.originalUrl;
                }
                if (url.indexOf(base_1.BaseConfig.OPEN_FILE_URL) !== -1) {
                    // 文件查看
                    yield next();
                }
                else if (base_1.BaseConfig.OPEN_URL.indexOf(url) !== -1) {
                    // 白名单接口直接通过
                    yield next();
                }
                else {
                    const decodedToken = jsonwebtoken_1.verify(ctx.headers.authentication, Constants_1.JWT_SECRET);
                    // 解析token保存到中间
                    ctx.user = decodedToken.data; // 这里的key = 'user'
                    yield next();
                }
            }
            catch (error) {
                this.catchError(ctx, error);
            }
            // 判断404
            if (ctx.status === 404 || ctx.status === 405) {
                // 设置浏览器状态码
                ctx.status = 200;
                return (ctx.body = ReturnResult_1.ReturnResult.errorMsg("未找到当前路径", 404));
            }
        });
    }
    /**
     * 捕捉错误处理后记录日志
     * @param ctx koa
     * @param error 错误信息
     */
    catchError(ctx, error) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 判断是否是参数错误
            if (error.msg) {
                // 设置浏览器状态码
                ctx.status = 200;
                return (ctx.body = ReturnResult_1.ReturnResult.errorMsg(error.msg, StaticStr_1.StaticStr.ERR_CODE_DEFAULT));
            }
            else if (error.message === "invalid token" || error.message === "jwt must be provided" || error.message === "jwt expired") {
                // 设置浏览器状态码
                ctx.status = 200;
                // token验证错误
                return (ctx.body = ReturnResult_1.ReturnResult.errorMsg("当前token失效", 401));
            }
            else {
                // 系统错误
                logger_1.logError(error.message, ctx.ip);
                // 设置浏览器状态码
                ctx.status = 200;
                return (ctx.body = ReturnResult_1.ReturnResult.errorMsg("服务器错误", 500));
            }
        });
    }
}
exports.Filter = Filter;
