import { Context } from "koa";

import { verify } from "jsonwebtoken";

import { JWT_SECRET } from "../config/Constants";
import { StaticStr } from "../config/StaticStr";
import { BaseConfig } from "../config/base";

import { ReturnResult } from "./ReturnResult";
import { logError } from "./logger";
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：请求验证/过滤
 */
export class Filter {
	/**
	 * reqfilter
	 * @desc：请求验证/过滤
	 */
    public reqfilter() {
        return async (ctx: any, next: () => Promise<void>) => {
            // 参数设置
            ctx.params = {
                ...ctx.request.body,
                ...ctx.query
            };
            try {
                let url = ctx.originalUrl.substring(0, ctx.originalUrl.indexOf("?"));
                if (url === "") {
                    url = ctx.originalUrl;
                }
                if (url.indexOf(BaseConfig.OPEN_FILE_URL) !== -1) {
                    // 文件查看
                    await next();
                } else if (BaseConfig.OPEN_URL.indexOf(url) !== -1) {
                    // 白名单接口直接通过
                    await next();
                } else {
                    const decodedToken: any = verify(ctx.headers.authentication, JWT_SECRET);
                    // 解析token保存到中间
                    ctx.user = decodedToken.data; // 这里的key = 'user'
                    await next();
                }
            } catch (error) {
                this.catchError(ctx, error);
            }

            // 判断404
            if (ctx.status === 404 || ctx.status === 405) {
                // 设置浏览器状态码
                ctx.status = 200;

                return (ctx.body = ReturnResult.errorMsg("未找到当前路径", 404));
            }

        };
    }

	/**
	 * 捕捉错误处理后记录日志
	 * @param ctx koa
	 * @param error 错误信息
	 */
    public async catchError(ctx: Context, error: any) {
        // 判断是否是参数错误
        if (error.msg) {
            // 设置浏览器状态码
            ctx.status = 200;

            return (ctx.body = ReturnResult.errorMsg(error.msg, StaticStr.ERR_CODE_DEFAULT));
        } else if (error.message === "invalid token" || error.message === "jwt must be provided" || error.message === "jwt expired") {
            // 设置浏览器状态码
            ctx.status = 200;
            // token验证错误

            return (ctx.body = ReturnResult.errorMsg("当前token失效", 401));
        } else {
            // 系统错误
            logError(error.message, ctx.ip);
            // 设置浏览器状态码
            ctx.status = 200;

            return (ctx.body = ReturnResult.errorMsg("服务器错误", 500));
        }
    }
}
