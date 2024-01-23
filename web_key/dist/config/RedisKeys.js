"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyName = void 0;
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：redis中使用到的key名字定义(
 *  按照“存储类型: 业务类型：id：字段”的方式进行命名)
 * STR: 字符型
 * SET:无序集合不可重复的，和列表一样，在执行插入和删除和判断是否存在某元素时，效率是很高
 * 散列HASH:可以看成具有String key和String value的map容器，可以将多个key-value存储到一个key中。每一个Hash可以存储4294967295个键值对。
 */
class KeyName {
}
exports.KeyName = KeyName;
/**
 * 设备key
 */
KeyName.HASH_PHONE = "HASH_PHONE";
/**
 * 素材
 */
KeyName.HASH_SOURCE = "HASH_SOURCE";
/**
 * 用户
 */
KeyName.HASH_USER = "HASH_USER";
/**
 * 验证码
 */
KeyName.STR_SVGCAPTCHA_TIME = "STR:SVGCAPTCHA_TIME:";
/**
 * 系统配置
 */
KeyName.HASH_CONFIG = "HASH:CONFIG";
/**
 * 定时任務
 */
KeyName.HASH_TIME_TASK = "HASH:HASH_TIME_TASK";
/**
* 密钥key
*/
KeyName.HASH_KEY = "HASH_KEY";
/**
 * 密钥 验证码 绑定
 */
KeyName.STR_IMEI_KEY = "STR_imei_key:";
