"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseUser = void 0;
/**
 * Created by wh on 2020/8/31
 * author: wanghao
 * @desc：用户
 */
class BaseUser {
    constructor() {
        /**
         * 对应角色
         */
        this.roles = '';
        /**
         * 用户名
         */
        this.name = '';
        /**
         * 密码
         */
        this.password = '';
        /**
         * createdTime
         */
        this.createdTime = "";
        /**
         * hour
         */
        this.hour = "";
        /**
         * 权限名称
         */
        this.rolesName = '';
        /**
         * 设备数量
         */
        this.maxNum = '';
        /**
         * 使用时长
         */
        this.maxDate = 0;
    }
}
exports.BaseUser = BaseUser;
