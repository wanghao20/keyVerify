const crypto = require("crypto");
import { StaticStr } from "../config/StaticStr";
import { VerifyException } from "../utils/exceptions";
import { Context } from "koa";
import { KeyName } from "../config/RedisKeys";
import { Paging } from "../format/Type";
import { redisDb1 } from "../utils/redisTool";

/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：gameService
 */
export default class PhoneService {

    /**
     * 验证 
     * 1 添加到设备列表中
     * 2 判断当前设备是否有需要执行的任务
     * 返回type=1需要执行任务
     */
    public async verificationKey(ctx: Context) {
        // 获取手机的IMEI
        const imei: string = ctx.params.imei;
        // 取得机型
        const model: string = ctx.params.model;
        // key
        const key: string = ctx.params.key.trim();
        // 账号
        const account: string = ctx.params.account.trim();
        // 验证使用账号是否存在
        let userVal = null;
        userVal = await redisDb1.hget(KeyName.HASH_USER, account);
        // 判断是否存在账号 不存在返回 6
        if (!userVal) {
            return { "state": 0, "msg": "账号不存在!" };
        }
        // 判断当前用户使用时间是否到期
        const user = JSON.parse(userVal);
        const startDate = Number(new Date(user.createdTime))
        const endDate = new Date().getTime();
        const dataDf = endDate - startDate;
        // 计算出小时数
        const hour2 = Math.floor(dataDf / 1000 / 60 / 60);
        // 判断剩余时长
        if (account !== "Administrator" && Number(user.maxDate || 0) < hour2) {
            return { "state": 0, "msg": "账号已过期" }
        }
        // 验证key数量
        if (user.name !== "Administrator") {
            // 验证最大设备数
            const users = await this.getPhoneByuser(account);
            const maxNum = Number(user.maxNum || 0);
            if (users.length >= maxNum) {
                return { "state": 0, "msg": "设备数达到最大值" };
            }
        }
        // 判断激活码是否存在,
        ;
        let keyVal: any = await redisDb1.hget(KeyName.HASH_KEY, key + account);
        if (!keyVal) {
            return { "state": 0, "msg": "key无效!" };
        }
        keyVal = JSON.parse(keyVal);
        // 验证是否是对应账号
        if (keyVal.account !== account) {
            return { "state": 0, "msg": "账号参数出错!" };
        }
        // 没绑定
        if (keyVal.isBind === 0) {
            // 判断激活码是否是免费版本,
            if (keyVal.isFree === 1) {
                // 判断设备是否使用过免费key
                const IMEI_KEY: string = await redisDb1.getString(KeyName.STR_IMEI_KEY + imei + account);
                if (IMEI_KEY) {
                    return { "state": 0, "msg": "当前设备已经使用过免费时长了哦!" };
                }
                await redisDb1.setString(KeyName.STR_IMEI_KEY + imei + account, imei);
            }
            // 绑定当前设备
            keyVal.exp = new Date().getTime();
            keyVal.isBind = 1;// 是否绑定
            keyVal.bindImei = imei;// 绑定手机号
            keyVal.model = model;
            await redisDb1.hset(KeyName.HASH_KEY, key + account, JSON.stringify(keyVal));
            return { "state": 1, "msg": "验证成功!", "time": keyVal.time, };
        }
        // 验证激活码时长
        // 获取激活时间
        const date1 = keyVal.exp; // "2015/05/01";  // 开始时间
        const date2 = new Date();    // d当前时间
        const date3 = date2.getTime() - date1;   // 时间差的毫秒数
        // 计算出小时数
        const hour = Math.floor(date3 / 1000 / 60 / 60);
        // 判断剩余时长
        if (Number(keyVal.time) < hour) {
            return { "state": 3, "msg": "key已经过期!" };
        }
        // 判断是否绑定
        if (keyVal.isBind === 1) {
            // 判断绑定设备是否一致
            if (keyVal.bindImei !== imei) {
                return { "state": 0, "msg": "key已经被使用!" };
            } else {
                return { "state": 1, "msg": "验证成功!", "time": Number(keyVal.time) - hour, };
            }
        }
    }

    /**
 * 热更新
 */
    public async update(ctx: Context) {
        // 版本
        const version = ctx.params.version;
        console.log(version);
        // 无限创建免费使用一天的key update
        const data = {
            "download_url": "http://211.159.163.43:9095/common/download/release.apk",
            "version": "1.1.0",
            "dialog": true,
            "msg": "优化部分问题",
            "force": false
        };
        // const str = crypto.randomBytes(20).toString("hex");
        // await redisDb1.hset(KeyName.HASH_KEY, str, JSON.stringify(key));

        return data;
    }
    /**
     * 计算相差时间
     * @param d1 
     */
    public async isNowTime(d1: any, d2: any) {
        return (d2 - d1) / 1000;//两个时间相差的秒数
    }
    protected statisticsData: any = {}
    protected NumData: any = 0
    /**
     * 统计  
     */
    public async statistics(ctx: Context) {


        // 获取手机序号
        const phNum: string = ctx.params.phNum;
        // 取得数据
        const list: string = JSON.parse(ctx.params.list);
        this.statisticsData[phNum] = { "phNum": phNum, "list": list, "time": new Date() }
        console.log(this.statisticsData.length);

        // 判断是否有5台设备上传数据
        if (Object.keys(this.statisticsData).length !== 5) {
            return { "state": 0, "msg": "等待其他设备上传数据", "data": {} }
        }
        // 整合每台设备数据
        let allList: any = []
        // 排序用
        let sortList: any = []
        // let currIndexNum = this.statisticsData[phNum].indexNum
        for (let index = 1; index < 6; index++) {
            const element = this.statisticsData[index];
            if (element) {
                // if (currIndexNum !== element.indexNum) {
                //     return { "state": 0, "msg": "等待其他设备上传数据-次数未同步", "data": {} }
                // }
                allList.push.apply(allList, element.list);
            }
            sortList.push(element)
        }
        sortList.sort(function (a: any, b: any) {
            var value1 = a["time"];
            var value2 = b["time"];
            return value1 - value2;
        })
        // 验证日期是否相差20秒
        let time = await this.isNowTime(sortList[0].time, sortList[4].time)
        if ((time > 20)) {
            // 去掉过期的
            delete this.statisticsData[sortList[0].phNum]
            return { "state": 0, "msg": "等待其他设备上传数据", "data": {} }
        }
        let types = ["黑桃", "红桃", "梅花", "方块"]
        let names = ["2", "3", "4", "5", "6",
            "7", "8", "9", "10", "J", "Q",
            "K", "A", "kg", "KG2",]
        let data: any = {}
        // 生成牌数
        for (let j = 0; j < names.length; j++) {
            for (let k = 0; k < types.length; k++) {
                let type = types[k]
                let name;
                if (j < 13) {
                    name = type + names[j]
                    if (type == "黑桃" || type == "红桃") {
                        data[name] = 2
                    } else if (type == "梅花" || type == "方块") {
                        data[name] = 1
                    }
                } else {
                    name = names[j]
                    data[name] = 1
                }
            }
        }
        // 统计数据计算返回结果
        for (let index = 0; index < allList.length; index++) {
            // 单张牌
            const element = allList[index];
            if (data[element]) {
                data[element] = data[element] - 1;
            }
        }
        // console.log(Object.keys(data).length);
        let dateList: any = {}
        // 删除没有的牌
        for (let index = 0; index < Object.keys(data).length; index++) {
            let element = data[Object.keys(data)[index]];
            // console.log( Object.keys(data)[index]);
            // console.log( element);
            if (element !== 0) {
                dateList[Object.keys(data)[index]] = element
            }
        }
        // 返回成功后记录,满了5个设备就清理缓存
        this.NumData = this.NumData + 1
        if (this.NumData == 5) {
            this.statisticsData = {}
            this.NumData = 0
        }
        console.log(Object.keys(dateList).length);
        return { "state": 1, "msg": "验证成功!", "data": dateList }
    }

    /**
     * 获取key
     */
    public async getChargeKey(ctx: Context) {
        // 账号
        const account: string = ctx.user.name;
        // 设置小时
        const timeNum: string = ctx.params.timeNum;
        // 是否免费
        const isFree: string = ctx.params.isFree;
        // 创建个数
        const numIndex: number = Number(ctx.params.numIndex);
        if (numIndex < 1) {
            throw new VerifyException(StaticStr.ERR_MSG_VERIFY_DEFAULT, StaticStr.ERR_CODE_DEFAULT);
        }
        let list=[]
        for (let index = 0; index < numIndex; index++) {
            const keyStr = crypto.randomBytes(3).toString("hex");
            // 创建定时的key
            const key = {
                "exp": 0,
                "isBind": 0,
                "isFree": isFree,
                "time": timeNum || 24,// 小时
                "model": "",
                "account": account,
                "keyStr": keyStr,
            };
            list.push(key)
            await redisDb1.hset(KeyName.HASH_KEY, keyStr + account, JSON.stringify(key));
        }
        return list;
    }

    /**
     * 获取设备列表(分页)
     */
    public async game(ctx: Context) {
        const pafing: Paging = ctx.params;
        const key = JSON.parse(pafing.condition).ip;
        const isBind = JSON.parse(pafing.condition).isBind;
        const time = JSON.parse(pafing.condition).time;


        let data;
        if (ctx.params.user) {
            data = await this.getPhoneByuser(ctx.params.user);
        } else {
            data = await this.getPhoneByuser(ctx.user.name);
        }
        if (key !== "") {
            data = data.filter((item: any) => String(item.keyStr).indexOf(key) !== -1);
        }
        if (time !== "") {
            data = data.filter((item: any) => String(item.time).indexOf(time) !== -1);
        }
        if (isBind !== "") {
            data = data.filter((item: any) => String(item.isBind).indexOf(isBind) !== -1);
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
     * 获取设备列表
     */
    public async getPhoneByuser(username?: string) {
        const list3: any = [];
        let phones: any;
        phones = await redisDb1.hgetall(KeyName.HASH_KEY);
        try {
            const date2 = new Date();    // d当前时间
            Object.keys(phones).forEach((val: string) => {
                const keyVal = JSON.parse(phones[val]);
                // 绑定过
                if (keyVal.isBind === 1) {

                    // 获取激活时间
                    const date1 = keyVal.exp; // "2015/05/01";  // 开始时间
                    const date3 = date2.getTime() - date1;   // 时间差的毫秒数
                    // 计算出小时数
                    const hour = Math.floor(date3 / 1000 / 60 / 60);
                    // 判断是否过期
                    if (hour > Number(keyVal.time)) {
                        keyVal["hour"] = "已过期"
                    } else {
                        keyVal["hour"] = hour
                    }
                } else {
                    keyVal["hour"] = "未使用"
                }
                if (keyVal.account === username) {
                    list3.push(keyVal);
                }
            });
        } catch (error) {
            return null;
        }

        return list3;
    }

    /**
     * 合并去重
     * @param arr1 1
     * @param arr2 2
     */
    public MergeArray(array: any[]) {
        const newJson = []; // 盛放去重后数据的新数组
        for (const item1 of array) {  // 循环json数组对象的内容
            let flag = true;  // 建立标记，判断数据是否重复，true为不重复
            for (const item2 of newJson) {  // 循环新数组的内容
                if (item1.IMEI === item2.IMEI) { // 让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
                    flag = false;
                }
            }
            if (flag) { // 判断是否重复
                newJson.push(item1); // 不重复的放入新数组。  新数组的内容会继续进行上边的循环。
            }
        }

        return newJson;
    }

    /**
     * 删除设备
     */
    public async delectBaseGame(key: string, account: string) {
        let keyStr = key + account
        await redisDb1.hdel(KeyName.HASH_KEY, keyStr);
    }

    /**
     * 清空无效keys
     */
    public async clearInvalidkeys(account: string) {
        let data = await this.getPhoneByuser(account);
        data.forEach(async (val: any) => {
            if (val["hour"] == "已过期") {
                await redisDb1.hdel(KeyName.HASH_KEY, val.keyStr + account);
            }
        });

    }


}
