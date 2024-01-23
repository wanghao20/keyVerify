/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc： jwt加密使用的秘钥
 */
export const JWT_SECRET = "secret_2020-8-20";
/**
 * 用户密码加密密钥
 */
export const SECRET_KEY = "#2020/9/9_";
/**
 * 配置文件加密密钥
 */
export const CFG_KEY = "#2020/10/28_Put_Your_Password_Here";
// 设置10小时过期时间
export const JWT_EXP: number = 600 * 60;// 过期时间
// 路由配置
export const ROUTER_MAP = Symbol("route_map");
/**
 * 生成验证码的配置
 */
export const svgCaptchaCfg = {
    "size": 4, // 验证码长度
    "width": 160,
    "height": 60,
    "fontSize": 50,
    "ignoreChars": "0oO1ilI", // 验证码字符中排除 0o1i
    "noise": 0, // 干扰线条的数量
    "color": false, // 验证码的字符是否有颜色，或没有，如果设定了背景，则交替有
    "background": "#eee" // 验证码图片背景颜色
};
