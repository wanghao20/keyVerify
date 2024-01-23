"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnResult = void 0;
const StaticStr_1 = require("../config/StaticStr");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc： 返回结果处理
 */
// tslint:disable-next-line:class-name
class ReturnResult {
    /**
     * 请求成功返回结果
     * @param _data 返回数据体
     */
    static successData(data) {
        const obj = { "code": StaticStr_1.StaticStr.SUCCESS_CODE_DEFAULT, "msg": "操作成功!", "data": data || "" };
        return obj;
    }
    /**
     * 失败返回结果
     * @param _msg 返回的消息
     * @param _code code
     */
    static errorMsg(msg, code) {
        const obj = { "code": code || StaticStr_1.StaticStr.ERR_CODE_DEFAULT, "msg": msg || "服务器错误!" };
        return obj;
    }
}
exports.ReturnResult = ReturnResult;
