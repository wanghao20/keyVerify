"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const FileService_1 = require("../../service/FileService");
const httpMethod_1 = require("../../utils/decorator/httpMethod");
const ReturnResult_1 = require("../../utils/ReturnResult");
/**
 * Created by wh on 2020/9/7
 * author: wanghao
 * @desc：文件处理Controllers
 */
class FileController {
    constructor() {
        this.service = new FileService_1.default();
    }
    /**
     * 上传文件
     * @param ctx koa中间件
     */
    createFile(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.createFile(ctx);
            return ctx.body = ReturnResult_1.ReturnResult.successData(data);
        });
    }
    /**
     * 下载文件
     * @param ctx koa中间件
     */
    downloadFile(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield this.service.downloadFile(ctx);
            // ctx.set('content-type', 'image/jpeg')
            // 设置响应头s
            return ctx.body = data;
        });
    }
}
tslib_1.__decorate([
    httpMethod_1.post("/upload"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], FileController.prototype, "createFile", null);
tslib_1.__decorate([
    httpMethod_1.get("/download/:name"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], FileController.prototype, "downloadFile", null);
exports.default = FileController;
