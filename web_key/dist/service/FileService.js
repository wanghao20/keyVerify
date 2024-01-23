"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs = require("fs");
const path = require("path");
/**
 * Created by wh on 2020/9/7
 * author: wanghao
 * @desc：FileService
 */
class FileService {
    /**
     * 新增
     */
    createFile(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            // 开启静态文件访问
            const file = ctx.request.files.file; // 获取上传文件
            const reader = fs.createReadStream(file.path); // 创建可读流
            const ext = file.name.split(".").pop(); // 获取上传文件扩展名
            const fileName = `${Math.random().toString(36).substr(2, 15)}.${ext}`;
            const loadPath = path.resolve(__dirname, "../../public/upload");
            const filePath = path.resolve(__dirname, "../../public/upload/" + fileName);
            if (!fs.existsSync(loadPath)) {
                fs.mkdirSync(loadPath);
            }
            const upStream = fs.createWriteStream(filePath); // 创建可写流
            reader.pipe(upStream);
            return fileName;
        });
    }
    /**
     * 下载
     */
    downloadFile(ctx) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fileName = ctx.params.name;
            const filePath = path.resolve(__dirname, "../../public/upload/" + fileName);
            return fs.createReadStream(filePath);
        });
    }
}
exports.default = FileService;
