"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Phone = void 0;
/**
 * Created by wh on 2020/94
 * author: wanghao
 * @desc：设备模块
 */
class Phone {
    constructor() {
        /**
         * 	分组
         */
        this.grouping = 0;
        /**
         * 	IMEI
         */
        this.IMEI = "";
        /**
         * 机型
         */
        this.model = "";
        /**
         * 设备 IP
         */
        this.ip = "";
    }
}
exports.Phone = Phone;
