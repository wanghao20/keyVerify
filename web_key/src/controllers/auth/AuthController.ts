
import { Context } from "koa";

import { AccountService } from "../../service/AccountService";
import { Validate } from "../../utils/ReqValidate";
import { ReturnResult } from "../../utils/ReturnResult";
import { post, get, put, del } from "../../utils/decorator/httpMethod";
import { BaseUser } from "../../entity/BaseUser";
import { Paging } from "../../format/Type";

/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：登陆注册Controllers
 */
export default class AuthController {
    /**
     * 逻辑处理service类
     */
    private readonly service: AccountService;

    constructor() {
        this.service = new AccountService();
    }

    /**
     * 登录接口Controller
     * @param ctx koa中间件
     */
    @post("/login")
    public async login(ctx: Context) {
         // 验证
         Validate.user(ctx.params.username, ctx.params.password);
         Validate.isFlexValid(ctx.params.captchaCode);
         Validate.isFlexValid(ctx.params.time);
         const obj = await this.service.verifyPassword(ctx.params.username, ctx.params.password, ctx.params.captchaCode,ctx.params.time);

        return ctx.body = ReturnResult.successData(obj);
    }
    /**
     * 获取用户详情信息
     * @param ctx koa中间件
     */
    @post("/info")
    public async info(ctx: Context) {
        // 验证
        const user = await this.service.info(ctx.user.name);

        return ctx.body = ReturnResult.successData(user);
    }
    /**
     * 修改用户信息
     * @param ctx koa中间件
     */
    @put("/user")
    public async update(ctx: Context) {
        const user: BaseUser = ctx.params;
        Validate.user(user.name, user.password);
        const users = await this.service.update(user);

        return ctx.body = ReturnResult.successData(users);
    }
       /**
     * 获取用户列表
     * @param ctx koa中间件
     */
    @get("/user")
    public async users(ctx: Context) {
        const paging: Paging = ctx.params;
        paging.condition = JSON.parse(paging.condition);
        const users = await this.service.users(paging);

        return ctx.body = ReturnResult.successData(users);
    }
    /**
     * 创建用户信息
     * @param ctx koa中间件
     */
    @post("/user")
    public async create(ctx: Context) {
        const user: BaseUser = ctx.params;
        Validate.user(user.name, user.password);
        Validate.isFlexValid(user.roles);
        // Validate.isEmail(user.email);
        const users = await this.service.create(user);

        return ctx.body = ReturnResult.successData(users);
    }
        /**
     * 删除用户信息
     * @param ctx koa中间件
     */
    @del("/user")
    public async delect(ctx: Context) {
        const user: BaseUser = ctx.params;
        // Validate.isId(user.id);
        const data = await this.service.delect(user);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
     * 退出登录
     * @param ctx koa中间件
     */
    @post("/logout")
    public async register(ctx: Context) {
        return ctx.body = ReturnResult.successData();
    }
    /**
     * 获取验证码图片
     * @param ctx koa中间件
     */
    @get("/captchaCode")
    public async captchaCode(ctx: Context) {
        Validate.isFlexValid(ctx.params.time);
        const data = await this.service.captchaCode(ctx.params.time);
        ctx.type = "html";
        // 设置响应头
        ctx.response.type = "image/svg+xml";

        return ctx.body = data;

    }
}
