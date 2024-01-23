
import { Context } from "koa";
import FileService from "../../service/FileService";
import { get, post } from "../../utils/decorator/httpMethod";
import { ReturnResult } from "../../utils/ReturnResult";

/**
 * Created by wh on 2020/9/7
 * author: wanghao
 * @desc：文件处理Controllers
 */
export default class FileController  {

        /**
     * 逻辑处理service类
     */
    private readonly service: FileService;

    constructor() {
        this.service = new FileService();
    }
    /**
     * 上传文件
     * @param ctx koa中间件
     */
    @post("/upload")
    public async createFile(ctx: Context) {
        const data = await this.service.createFile(ctx);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
     * 下载文件
     * @param ctx koa中间件
     */
    @get("/download/:name")
    public async downloadFile(ctx: Context) {

        const data = await this.service.downloadFile(ctx);
        // ctx.set('content-type', 'image/jpeg')
        // 设置响应头s

        return ctx.body = data;
    }
}
