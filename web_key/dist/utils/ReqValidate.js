"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Validate = void 0;
const Joi = require("joi");
const util_1 = require("util");
const StaticStr_1 = require("../config/StaticStr");
const exceptions_1 = require("./exceptions");
/**
 * Created by wh on 2020/7/18
 * author: wanghao
 * @desc：请求参数验证(Joi:https://hapi.dev/module/joi/:https://github.com/hapijs/joi/blob/v8.0.5/API.md)
 * https://www.cnblogs.com/zzbo/p/5906101.html
 */
class Validate {
    /**
     * 判断参数是否是字符串
     * @param val 需要验证的字符
     */
    static isId(val) {
        const schema = Joi.object({
            "str": Joi.string().min(1).max(40).required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
    /**
     * 判断参数isEmail
     * @param val 需要验证的字符
     */
    static isEmail(val) {
        const schema = Joi.object({
            "str": Joi.string().email().required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_EMAIL_CODE, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
    /**
     * 判断参数是否是指定对象
     * @param val 传入判断的对象
     */
    static isObj(val) {
        // 暂时判断是否为空
        const schema = Joi.object({
            "str": Joi.object().required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
    /**
     * 判断参数是否是array
     * @param val 判断是否是list
     */
    static isArray(val) {
        // 暂时判断是否为空
        const schema = Joi.object({
            "str": Joi.array().min(1).max(500).required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
    /**
     * 判断数据是否是有效数字
     * @param val number
     */
    static isNumber(val) {
        // 暂时判断是否为空
        const schema = Joi.object({
            "str": Joi.required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
    /**
    * 灵活判断字符类型?参数
    * @param val any
    */
    static isFlexValid(val) {
        // 判断对象是否存在如果存在判断数据大小
        if (util_1.isUndefined(val) || val === "") {
            return true;
        }
        const schema = Joi.object({
            "str": Joi.string().min(1).max(40).required(),
        });
        const { error } = schema.validate({ "str": val });
        if (error) {
            throw new exceptions_1.VerifyException(StaticStr_1.StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
        return false;
    }
    /**
     * 判断字符串是否符合规格
     * @param name 用户名称
     * @param pwd 用户密码
     */
    static user(name, pwd) {
        // 暂时判断是否为空
        const schema = Joi.object({
            "str1": Joi.string().min(3).max(15).required(),
            "str2": Joi.string().min(6).max(15).required(),
        });
        const { error } = schema.validate({ "str1": name, "str2": pwd });
        if (error) {
            throw new exceptions_1.VerifyException("用户名或者密码格式验证未成功!", StaticStr_1.StaticStr.ERR_CODE_DEFAULT);
        }
    }
}
exports.Validate = Validate;
