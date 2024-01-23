import jwt = require("jsonwebtoken");

import crypto = require("crypto");

import svgCaptcha = require("svg-captcha");

import { JWT_SECRET, JWT_EXP, svgCaptchaCfg, SECRET_KEY } from "../config/Constants";
import { KeyName } from "../config/RedisKeys";
import { StaticStr } from "../config/StaticStr";
import { BaseUser } from "../entity/BaseUser";
import { Paging, TokenConfig } from "../format/Type";
import { DateFormat } from "../utils/DateFormat";
import { VerifyException } from "../utils/exceptions";
import { redisDb1 } from "../utils/redisTool";
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：authService
 */
export class AccountService {

    /**
      * 获取token
      */
    private getToken(user: any) {
        const tconfig: TokenConfig = {
            "exp": Math.floor(Date.now() / 1000) + JWT_EXP,
            "data": { "id": user.id, "roles": user.roles, "name": user.name },
        };

        return jwt.sign(tconfig, JWT_SECRET);
    }
    /**
     * 加密密码
     */
    private genPassword(password: string) {
        const md5 = crypto.createHash("md5");
        const str = `password=${password}&key=${SECRET_KEY}`; // 拼接方式是自定的，只要包含密匙即可

        return md5.update(str).digest("hex"); // 把输出编程16进制的格式
    }
    /**
     * 登录验证接口Service
     * @param userName 用户名
     * @param passWord 密码
     */
    public async verifyPassword(userName: string, passWord: string, captchaCode: string, time: string) {
        const userVal = await redisDb1.hget(KeyName.HASH_USER, userName);
        // 判断当前用户使用时间是否到期
        const user = JSON.parse(userVal);
        if (user === null) {
            throw new VerifyException(StaticStr.USERNAME_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }
        const startDate = Number(new Date(user.createdTime))
        const endDate = new Date().getTime();
        const dataDf = endDate - startDate;
        // 计算出小时数
        const hour = Math.floor(dataDf / 1000 / 60 / 60);
        // 判断剩余时长
        if (user.name !== "Administrator" && Number(user.maxDate || 0) < hour) {
            throw new VerifyException(StaticStr.ERR_DATE, StaticStr.ERR_CODE_DEFAULT);
        }
        // 验证码
        const val = await redisDb1.getString(KeyName.STR_SVGCAPTCHA_TIME + time);
        // 设置为过期
        redisDb1.expire(KeyName.STR_SVGCAPTCHA_TIME + time, 1);
        if (captchaCode !== val) {
            throw new VerifyException(StaticStr.ERR_CAPTCHA_CODE, StaticStr.ERR_CODE_DEFAULT);
        }

        if (userVal === undefined) {
            throw new VerifyException(StaticStr.USERNAME_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }
        if (userVal === null) {
            throw new VerifyException(StaticStr.USERNAME_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }

        if (user.name !== userName) {
            throw new VerifyException(StaticStr.USERNAME_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }
        if (user.password !== this.genPassword(passWord)) {
            throw new VerifyException(StaticStr.USERNAME_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }

        const token = this.getToken(user);

        return { "accessToken": token, "id": user.id };

    }
    /**
     * 获取用户信息
     * @param name 用户名称
     */
    public async info(name: string) {
        const userVal: any = await redisDb1.hget(KeyName.HASH_USER, name);
        const user = JSON.parse(userVal);
        // 拿到对应权限mods信息
        const mods = [
            {
                "component": null,
                "createdBy": null,
                "createdTime": "",
                "disabled": 1,
                "icon": null,
                "id": "0",
                "isDelete": 0,
                "label": "根",
                "modPath": null,
                "modtTitle": null,
                "pId": null,
                "pName": null,
                "updatedBy": null,
                "updatedTime": null,
            },
            {
                "component": "Layout",
                "createdBy": "",
                "createdTime": "1599136206538",
                "disabled": 0,
                "icon": "el-icon-menu",
                "id": "12a90106-8221-4731-9147-ab7d66a15f74",
                "isDelete": 0,
                "label": "验证码管理",
                "modPath": "/dashboard",
                "modtTitle": "验证码管理",
                "pId": "0",
                "pName": "根",
                "updatedBy": "135e4f69-8e69-4dfc-a153-3fbaed1ee9c1",
                "updatedTime": "1599616477501",
            },
            {
                "component": "game/games.vue",
                "createdBy": null,
                "createdTime": "1599136206538",
                "disabled": 0,
                "icon": "el-icon-menu",
                "id": "34234",
                "isDelete": 0,
                "label": "验证码管理",
                "modPath": "dashboard",
                "modtTitle": "验证码管理",
                "pId": "12a90106-8221-4731-9147-ab7d66a15f74",
                "pName": "验证码管理",
                "updatedBy": null,
                "updatedTime": null
            },
        ];

        // 管理员
        if (user.name === "Administrator") {
            mods.push({
                "component": "Layout",
                "createdBy": null,
                "createdTime": "1599136206538",
                "disabled": 0,
                "icon": "el-icon-user-solid",
                "id": "12a90106-8221-4731-9147-ab7d66a15f745",
                "isDelete": 0,
                "label": "账号管理",
                "modPath": "/auth",
                "modtTitle": "账号管理",
                "pId": "0",
                "pName": "根",
                "updatedBy": "135e4f69-8e69-4dfc-a153-3fbaed1ee9c1",
                "updatedTime": "1599616477501",
            });
            mods.push(
                {
                    "component": "auth/users.vue",
                    "createdBy": null,
                    "createdTime": "1599136206538",
                    "disabled": 0,
                    "icon": "el-icon-user-solid",
                    "id": "34234",
                    "isDelete": 0,
                    "label": "账号管理",
                    "modPath": "users",
                    "modtTitle": "账号管理",
                    "pId": "12a90106-8221-4731-9147-ab7d66a15f745",
                    "pName": "账号管理",
                    "updatedBy": null,
                    "updatedTime": null
                });
           
        }

        return { "user": user, "mods": mods };
    }
    /**
     * 修改用户
     * @param user User
     */
    public async update(user: BaseUser) {
        user.password = this.genPassword(user.password);
        // 验证用户名
        const userVal = await redisDb1.hget(KeyName.HASH_USER, user.name);
        // 判断当前用户使用时间是否到期
        const user2 = JSON.parse(userVal);
        user["createdTime"]=user2.createdTime
        user["maxNum"]=user2.maxNum
        user["maxDate"]=user2.maxDate
        const userData = JSON.stringify(user);
        await redisDb1.hset(KeyName.HASH_USER, user.name, userData);

        return user;
    }
    /**
   * 获取权限和后台管理用户列表
   */
    public async users(pafing: Paging) {
        const name = pafing.condition.name;
        let data = await this.getUsers();
        if (name !== "") {
            data = data.filter((item: any) => String(item.IMEI).indexOf(name) !== -1);
        }
        const len = data.length;
        data = this.pagination(pafing.page, pafing.limit, data);

        // 解析存储过程数据
        return { "items": data, "total": len };
    }
    /**
     * 实现对数组的分页，传入页码、每页显示的条数，待分页的数组，得到当前页
     * @param array 分页数据
     * @param pagesize  页面大小
     * @param currentPage   当前页面
     */
    public pagination(currentPage: number, pageSize: number, array: any[]) {
        const offset = (currentPage - 1) * pageSize;

        return (offset + pageSize >= array.length) ? array.slice(offset, array.length) : array.slice(offset, offset + pageSize);
    }
    /**
   * 创建用户
   * @param user User
   */
    public async create(user: BaseUser) {
        // 验证用户名
        const userVal = await redisDb1.hget(KeyName.HASH_USER, user.name);
        if (userVal) {
            throw new VerifyException(StaticStr.INSERT_ERR_MSG, StaticStr.ERR_CODE_DEFAULT);
        }
        user.createdTime = DateFormat.dateFormat(Date.now());
        user.rolesName = "1";
        user.password = this.genPassword(user.password);
        const userData = JSON.stringify(user);

        await redisDb1.hset(KeyName.HASH_USER, user.name, userData);

        return user;
    }

    /**
    * 获取设备列表
    */
    public async getUsers() {
        const list3: any = [];
        const phones = await redisDb1.hgetall(KeyName.HASH_USER);
        try {
            Object.keys(phones).forEach((val: string) => {
                const user = JSON.parse(phones[val]);
                const startDate = Number(new Date(user.createdTime))
                const endDate = new Date().getTime();
                const dataDf = endDate - startDate;
                // 计算出小时数
                const hour = Math.floor(dataDf / 1000 / 60 / 60);
                user["hour"]=hour+"小时";
                if (user.name !== "Administrator") {
                    list3.push(user);

                }
            });

        } catch (error) {
            return null;
        }

        return list3;
    }
    /**
     * 删除用户
     * @param user User
     */
    public async delect(user: BaseUser) {
        await redisDb1.hdel(KeyName.HASH_USER, user.name);

        return user;
    }
    /**
     * 获取验证码图片
     */
    public async captchaCode(time: string) {
        const cap = svgCaptcha.create(svgCaptchaCfg);
        const img = cap.data; // 验证码
        const text = cap.text.toLowerCase(); // 验证码字符，忽略大小写
        await redisDb1.setString(KeyName.STR_SVGCAPTCHA_TIME + time, text);
        // 一分钟过期
        await redisDb1.expire(KeyName.STR_SVGCAPTCHA_TIME + time, 6000);

        return img;
    }
}
