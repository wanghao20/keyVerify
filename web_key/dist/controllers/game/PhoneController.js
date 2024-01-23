"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const PhoneService_1 = require("../../service/PhoneService");
const ReturnResult_1 = require("../../utils/ReturnResult");
const httpMethod_1 = require("../../utils/decorator/httpMethod");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：设备Controllers
 */
class PhoneController {
    constructor() {
        this.service = new PhoneService_1.default();
    }
    /**
     * 获取key
     * @param ctx koa中间件
     */
    getChargeKey(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.getChargeKey(ctx);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
   * 热更新
   * @param ctx koa中间件
   */
    update(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.update(ctx);
            return ctx.body = data;
        });
    }
    /**
     * 验证key
     * @param ctx koa中间件
     */
    report(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.verificationKey(ctx);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 统计,返回计算出的数据
     * @param ctx koa中间件
     */
    statistics(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.statistics(ctx);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 获取设备列表
     * @param ctx koa中间件
     */
    games(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.game(ctx);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 删除
     * @param ctx koa中间件
     */
    delectBaseGame(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const key = ctx.params.key;
            const account = ctx.user.name;
            const data = yield this.service.delectBaseGame(key, account);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 清空无效keys
     * @param ctx koa中间件
     */
    clearInvalidkeys(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const account = ctx.user.name;
            const data = yield this.service.clearInvalidkeys(account);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
}
tslib_1.__decorate([
    httpMethod_1.get("/getChargeKey"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "getChargeKey", null);
tslib_1.__decorate([
    httpMethod_1.get("/update"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "update", null);
tslib_1.__decorate([
    httpMethod_1.get("/verificationKey"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "report", null);
tslib_1.__decorate([
    httpMethod_1.get("/statistics"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "statistics", null);
tslib_1.__decorate([
    httpMethod_1.get("/game"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "games", null);
tslib_1.__decorate([
    httpMethod_1.del("/game"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "delectBaseGame", null);
tslib_1.__decorate([
    httpMethod_1.del("/clearInvalidkeys"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PhoneController.prototype, "clearInvalidkeys", null);
exports.default = PhoneController;
