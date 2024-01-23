
const fs = require("fs");
import { Context } from "koa";
import path = require("path");

/**
 * Created by wh on 2020/9/7
 * author: wanghao
 * @desc：FileService
 */
export default class FileService  {

    /**
     * 新增
     */
    public async createFile(ctx: any) {
        // 开启静态文件访问
        const file = ctx.request.files.file;	// 获取上传文件
        const reader = fs.createReadStream(file.path);	// 创建可读流
        const ext = file.name.split(".").pop();		// 获取上传文件扩展名
        const fileName = `${Math.random().toString(36).substr(2, 15)}.${ext}`;
        const loadPath= path.resolve(__dirname, "../../public/upload");
        const filePath = path.resolve(__dirname, "../../public/upload/"+fileName);
        if (!fs.existsSync(loadPath)) {
            fs.mkdirSync(loadPath);
        }
        const upStream = fs.createWriteStream(filePath);		// 创建可写流
        reader.pipe(upStream);

        return fileName;
    }

    /**
     * 下载
     */
    public async downloadFile(ctx: Context) {
        const fileName = ctx.params.name;
        const filePath = path.resolve(__dirname, "../../public/upload/"+fileName);

        return fs.createReadStream(filePath);
    }

}
