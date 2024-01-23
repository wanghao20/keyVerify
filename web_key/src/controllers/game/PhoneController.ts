import { Context } from "koa";

import PhoneService from "../../service/PhoneService";
import { ReturnResult } from "../../utils/ReturnResult";
import { del, get } from "../../utils/decorator/httpMethod";

/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：设备Controllers
 */
export default class PhoneController {

    /**
     * 逻辑处理service类
     */
    private readonly service: PhoneService;

    constructor() {
        this.service = new PhoneService();
    }

    /**
     * 获取key
     * @param ctx koa中间件
     */
    @get("/getChargeKey")
    public async getChargeKey(ctx: Context) {
        const data = await this.service.getChargeKey(ctx);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
   * 热更新
   * @param ctx koa中间件
   */
    @get("/update")
    public async update(ctx: Context) {
        const data = await this.service.update(ctx);

        return ctx.body = data;
    }
    /**
     * 验证key
     * @param ctx koa中间件
     */
    @get("/verificationKey")
    public async report(ctx: Context) {
        const data = await this.service.verificationKey(ctx);

        return ctx.body = ReturnResult.successData(data);
    }

    /**
     * 统计,返回计算出的数据
     * @param ctx koa中间件
     */
    @get("/statistics")
    public async statistics(ctx: Context) {
        const data = await this.service.statistics(ctx);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
     * 获取设备列表
     * @param ctx koa中间件
     */
    @get("/game")
    public async games(ctx: Context) {

        const data = await this.service.game(ctx);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
     * 删除
     * @param ctx koa中间件
     */
    @del("/game")
    public async delectBaseGame(ctx: Context) {
        const key: string = ctx.params.key;
        const account: string = ctx.user.name
        const data = await this.service.delectBaseGame(key, account);

        return ctx.body = ReturnResult.successData(data);
    }
    /**
     * 清空无效keys
     * @param ctx koa中间件
     */
    @del("/clearInvalidkeys")
    public async clearInvalidkeys(ctx: Context) {
        const account: string = ctx.user.name
        const data = await this.service.clearInvalidkeys(account);
        return ctx.body = ReturnResult.successData(data);
    }

}
