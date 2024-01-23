"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const AccountService_1 = require("../../service/AccountService");
const ReqValidate_1 = require("../../utils/ReqValidate");
const ReturnResult_1 = require("../../utils/ReturnResult");
const httpMethod_1 = require("../../utils/decorator/httpMethod");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：登陆注册Controllers
 */
class AuthController {
    constructor() {
        this.service = new AccountService_1.AccountService();
    }
    /**
     * 登录接口Controller
     * @param ctx koa中间件
     */
    login(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 验证
            ReqValidate_1.Validate.user(ctx.params.username, ctx.params.password);
            ReqValidate_1.Validate.isFlexValid(ctx.params.captchaCode);
            ReqValidate_1.Validate.isFlexValid(ctx.params.time);
            const obj = yield this.service.verifyPassword(ctx.params.username, ctx.params.password, ctx.params.captchaCode, ctx.params.time);
            return ctx.body = ReturnResult_1.ReturnResult.successData(obj);
        });
    }
    /**
     * 获取用户详情信息
     * @param ctx koa中间件
     */
    info(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 验证
            const user = yield this.service.info(ctx.user.name);
            return ctx.body = ReturnResult_1.ReturnResult.successData(user);
        });
    }
    /**
     * 修改用户信息
     * @param ctx koa中间件
     */
    update(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = ctx.params;
            ReqValidate_1.Validate.user(user.name, user.password);
            const users = yield this.service.update(user);
            return ctx.body = ReturnResult_1.ReturnResult.successData(users);
        });
    }
    /**
  * 获取用户列表
  * @param ctx koa中间件
  */
    users(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const paging = ctx.params;
            paging.condition = JSON.parse(paging.condition);
            const users = yield this.service.users(paging);
            return ctx.body = ReturnResult_1.ReturnResult.successData(users);
        });
    }
    /**
     * 创建用户信息
     * @param ctx koa中间件
     */
    create(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = ctx.params;
            ReqValidate_1.Validate.user(user.name, user.password);
            ReqValidate_1.Validate.isFlexValid(user.roles);
            // Validate.isEmail(user.email);
            const users = yield this.service.create(user);
            return ctx.body = ReturnResult_1.ReturnResult.successData(users);
        });
    }
    /**
 * 删除用户信息
 * @param ctx koa中间件
 */
    delect(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = ctx.params;
            // Validate.isId(user.id);
            const data = yield this.service.delect(user);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 退出登录
     * @param ctx koa中间件
     */
    register(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return ctx.body = ReturnResult_1.ReturnResult.successData();
        });
    }
    /**
     * 获取验证码图片
     * @param ctx koa中间件
     */
    captchaCode(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            ReqValidate_1.Validate.isFlexValid(ctx.params.time);
            const data = yield this.service.captchaCode(ctx.params.time);
            ctx.type = "html";
            // 设置响应头
            ctx.response.type = "image/svg+xml";
            return ctx.body = data;
        });
    }
}
tslib_1.__decorate([
    httpMethod_1.post("/login"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
tslib_1.__decorate([
    httpMethod_1.post("/info"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "info", null);
tslib_1.__decorate([
    httpMethod_1.put("/user"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "update", null);
tslib_1.__decorate([
    httpMethod_1.get("/user"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "users", null);
tslib_1.__decorate([
    httpMethod_1.post("/user"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "create", null);
tslib_1.__decorate([
    httpMethod_1.del("/user"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "delect", null);
tslib_1.__decorate([
    httpMethod_1.post("/logout"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
tslib_1.__decorate([
    httpMethod_1.get("/captchaCode"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AuthController.prototype, "captchaCode", null);
exports.default = AuthController;
