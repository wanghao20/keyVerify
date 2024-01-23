"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.limiterRedis = exports.redisDb1 = void 0;
const tslib_1 = require("tslib");
const RedisKeys_1 = require("../config/RedisKeys");
const ioredis = require("ioredis");
const Redlock = require("redlock");
const base_1 = require("../config/base");
/**
 * 创建连接
 */
const clientCreate = (config, callback) => {
    const redis = new ioredis(config);
    redis.on("connect", () => {
        // 根据 connect 事件判断连接成功
        callback(null, redis); // 链接成功， 返回 redis 连接对象
    });
    redis.on("error", (err) => {
        // 根据 error 事件判断连接失败
        callback(err, null); // 捕捉异常， 返回 error
    });
};
/**
 * 创建连接返回 promise
 * @param options 配置
 */
const redisConnect = (options) => {
    const config = options;
    return new Promise((resolve, reject) => {
        // 返回API调用方 一个 promise 对象
        clientCreate(config, (err, conn) => {
            if (err) {
                reject(err);
            }
            resolve(conn); // 返回连接的redis对象
        });
    });
};
/**
 * 初始化配置
 */
const redisConfig = {
    /**
     * 端口
     */
    "port": base_1.BaseConfig.REDIS_PORT,
    "password": base_1.BaseConfig.REDIS_PASSWORD,
    "host": base_1.BaseConfig.REDIS_HOST,
    "connectTimeout": 50000,
    "options": {
        encrypt: false //加上这个就不会报错
    },
};
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：redis封装方法
 */
class RedisTool {
    constructor(opt) {
        this.redis = null;
        opt ? (this.config = Object.assign(redisConfig, opt)) : (this.config = redisConfig);
        this.connToRedis()
            .then((res) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (res) {
                console.log("redis连接成功!");
                // 初始化数据
                const user = {
                    "avatar": "mv9a7hyk8l.jpg",
                    "createdBy": "1",
                    "createdTime": "2020-09-04 17:40:53",
                    "email": "@Gmail.com",
                    "id": "id",
                    "isDelete": 0,
                    "name": "Administrator",
                    "password": "e4cffb4cdc16bed9bb79a9ef7e7bc38b",
                    "roles": "1",
                    "rolesName": "管理员",
                    "updatedBy": "135e4f69-8e69-4dfc-a153-3fbaed1ee9c1",
                    "updatedTime": "2020-09-28 14:50:21",
                };
                const userVal = yield exports.redisDb1.hget(RedisKeys_1.KeyName.HASH_USER, user.name);
                if (!userVal) {
                    const userData = JSON.stringify(user);
                    yield this.redis.hset(RedisKeys_1.KeyName.HASH_USER, user.name, userData);
                }
            }
        }))
            .catch((e) => {
            console.error("Redis连接错误:" + e);
        });
    }
    /**
     * 连接redis
     */
    connToRedis() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                console.log(redisConfig);
                if (this.redis) {
                    resolve(true); // 已创建
                }
                else {
                    redisConnect(redisConfig)
                        .then((resp) => {
                        this.redis = resp;
                        // 初始化锁
                        this.redlock = new Redlock([this.redis], {
                            "retryDelay": 200,
                            "retryCount": 1,
                        });
                        resolve(true);
                    })
                        .catch((err) => {
                        reject(err);
                    });
                }
            });
        });
    }
    /**
     * 基于redis分布式锁实现
     * @param ressourceId 要锁定的资源的字符串标识符
     */
    lock(ressourceId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.redlock.lock(ressourceId, 1000);
                // lock.unlock();
            }
            catch (err) {
                return false;
            }
        });
    }
    /**
     * 解锁方法
     * @param lock 锁对象
     */
    unlockLock(lock) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            lock.unlock(function (err) {
                if (err) {
                    console.log("解锁失败" + err);
                }
                else {
                    console.log("解锁成功");
                }
            });
        });
    }
    /**
     * 存储string类型的key-value
     * @param key key
     * @param value value
     */
    setString(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const val = typeof value !== "string" ? JSON.stringify(value) : value;
            try {
                const res = yield this.redis.set(key, val);
                // 处理完成后解锁
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
            }
            return null;
        });
    }
    /**
     * 获取string类型的key-value
     * @param key string
     * @return value
     */
    getString(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.get(key);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e.stack);
                return null;
            }
        });
    }
    /**
     * 批量获取
     * @param keys keys
     */
    mget(keys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.mget(keys);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e.stack);
                return null;
            }
        });
    }
    /**
     * 批量获取key
     * @param keys 支持部分正则表达式
     */
    keys(keys) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.keys(keys);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e.stack);
                return null;
            }
        });
    }
    /**
     * 删除string类型的key-value
     * @param key key
     */
    del(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const lock = yield this.lock(key);
                if (lock) {
                    const res = yield this.redis.del(key);
                    // 处理完成后解锁
                    exports.redisDb1.unlockLock(lock);
                    return res;
                }
                else {
                    // 其他线程在处理中
                    console.log("其他线程在处理中");
                }
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
            return null;
        });
    }
    /**
     *  sadd 将给定元素添加到集合 插入元素数量 sadd('key', 'value1'[, 'value2', ...]) (不支持数组赋值)(元素不允许重复)
     * @param key key
     * @param value value
     */
    sadd(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const lock = yield this.lock(key);
                if (lock) {
                    const res = yield this.redis.sadd(key, value);
                    // 处理完成后解锁
                    exports.redisDb1.unlockLock(lock);
                    return res;
                }
                else {
                    // 其他线程在处理中
                    console.log("其他线程在处理中");
                }
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
            return null;
        });
    }
    /**
     *  获取集合内所有成员
     * @param key key
     */
    smembers(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.smembers(key);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     *  判断是否存在这个成员
     * @param key key
     * @param member string
     */
    sismember(key, member) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.sismember(key, member);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 散列hash：类似Java中的Map
     * @param key key
     * @param field fieldKey
     * @param value value
     */
    hset(key, field, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.hmset(key, field, value);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 散列hash：类似Java中的Map
     * @param key key
     * @param field fieldKey
     * @param value value
     */
    hdel(key, field) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.hdel(key, field);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 获取指定的key中field字段的值
     * @param key key
     * @param field 字段
     */
    hget(key, field) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.hget(key, field);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 向list中压入元素
     * @param key key
     * @param values values
     */
    lpush(key, values) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const lock = yield this.lock(key);
                if (lock) {
                    const res = yield this.redis.lpush(key, values);
                    // 处理完成后解锁
                    exports.redisDb1.unlockLock(lock);
                    return res;
                }
                else {
                    // 其他线程在处理中
                    console.log("其他线程在处理中");
                }
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
            return null;
        });
    }
    /**
     * 获取指定的key中所有键值对
     * @param key key
     */
    hgetall(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.hgetall(key);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 同时设置对个键值对数据
     * @param key key
     * @param value field,value,field,value,field,value
     */
    hmset(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const lock = yield this.lock(key);
                if (lock) {
                    const res = yield this.redis.hmset(key, value);
                    // 处理完成后解锁
                    exports.redisDb1.unlockLock(lock);
                    return res;
                }
                else {
                    // 其他线程在处理中
                    console.log("其他线程在处理中");
                }
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
            return null;
        });
    }
    /**
     * 有序集合添加成员
     * @param key key
     * @param score 分数(按照此对象排名)
     * @param value value
     */
    zadd(key, score, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const lock = yield this.lock(key);
                if (lock) {
                    const res = yield this.redis.zadd(key, score, value);
                    // 处理完成后解锁
                    exports.redisDb1.unlockLock(lock);
                    return res;
                }
                else {
                    // 其他线程在处理中
                    console.log("其他线程在处理中");
                }
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
            return null;
        });
    }
    /**
     * HyperLogLog是一种概率性数据结构，在标准误差0.81%的前提下，能够统计2^64个数据。
     * 参考资料:https://juejin.im/post/6844904097666039816
     *         https://juejin.im/post/6844903940585160718
     */
    /**
     * HyperLogLog
     *  添加一个元素，如果重复，只算作一个
     * @param key key
     * @param score 分数(按照此对象排名)
     * @param value value
     */
    pfadd(key, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.pfadd(key, value);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * HyperLogLog
     * 返回元素数量的近似值
     * @param key key
     */
    pfcount(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.pfcount(key);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * HyperLogLog
     * 将多个 HyperLogLog 合并为一个 HyperLogLog
     * return OK.
     * @param key key
     */
    pfmerge(key, sourcekey) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.pfmerge(key, sourcekey);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 在redis 2.2.0版本之后，新增了一个位图数据，其实它不是一种数据结构。实际上它就是一个一个字符串结构，
     * 只不过value是一个二进制数据， 每一位只能是0或者1。redis单独对bitmap提供了一套命令。可以对任意一位进行设置和读取,
     * https://blog.csdn.net/u011957758/article/details/74783347。
     * bitmap
     * @param key key
     * @param offset 第offset位(：给一个指定key的值得第offset位 赋值为value。)
     * @param value 值:0-1
     */
    setbit(key, offset, value) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.setbit(key, offset, value);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 判断是否存在指定key
     * @param key key
     */
    exists(key) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.exists(key);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 获取当前数据库key的数量
     * @return keySize
     */
    getDbSize() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.dbsize();
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
    /**
     * 设置key过期时间
     * @param key key
     * @param expiration 单位长度:秒
     */
    expire(key, expiration) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield this.redis.expire(key, expiration);
                return res;
            }
            catch (e) {
                // tslint:disable-next-line:no-console
                console.error(e);
                return null;
            }
        });
    }
}
/**
 * 需要用到多少个数据库，就定义多少个实例常量，这样的好处是:
 * 每次个模块调用redis的时候，始终是取第一次生成的实例，避免了多次连接redis的尴尬
 */
exports.redisDb1 = new RedisTool({ "db": base_1.BaseConfig.SYSTEM_DB });
exports.limiterRedis = new ioredis(redisConfig);
// export const redis_db2 = new RedisTool({db:2})
