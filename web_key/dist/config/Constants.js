"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.svgCaptchaCfg = exports.ROUTER_MAP = exports.JWT_EXP = exports.CFG_KEY = exports.SECRET_KEY = exports.JWT_SECRET = void 0;
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc： jwt加密使用的秘钥
 */
exports.JWT_SECRET = "secret_2020-8-20";
/**
 * 用户密码加密密钥
 */
exports.SECRET_KEY = "#2020/9/9_";
/**
 * 配置文件加密密钥
 */
exports.CFG_KEY = "#2020/10/28_Put_Your_Password_Here";
// 设置10小时过期时间
exports.JWT_EXP = 600 * 60; // 过期时间
// 路由配置
exports.ROUTER_MAP = Symbol("route_map");
/**
 * 生成验证码的配置
 */
exports.svgCaptchaCfg = {
    "size": 4,
    "width": 160,
    "height": 60,
    "fontSize": 50,
    "ignoreChars": "0oO1ilI",
    "noise": 0,
    "color": false,
    "background": "#eee" // 验证码图片背景颜色
};
