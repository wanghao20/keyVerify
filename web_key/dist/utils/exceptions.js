"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryFailedError = exports.QueryRunnerAlreadyReleasedError = exports.TransactionNotStartedError = exports.VerifyException = exports.BaseException = void 0;
const StaticStr_1 = require("../config/StaticStr");
/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc： 异常处理
 */
class BaseException extends Error {
}
exports.BaseException = BaseException;
/**
 * 数据验证异常
 * 自定义返回信息和code
 */
// tslint:disable-next-line:max-classes-per-file
class VerifyException extends BaseException {
    constructor(msg, code) {
        super();
        this.msg = msg || StaticStr_1.StaticStr.DEFAULT;
        this.code = code;
    }
}
exports.VerifyException = VerifyException;
/**
 * 数据库事务开启异常
 * 自定义返回信息和code
 */
// tslint:disable-next-line:max-classes-per-file
class TransactionNotStartedError extends BaseException {
    constructor() {
        super();
        this.msg = "数据库事务开启失败";
        this.code = 500;
    }
}
exports.TransactionNotStartedError = TransactionNotStartedError;
/**
 * 存在事务无法执行当前查询
 * 自定义返回信息和code
 */
// tslint:disable-next-line:max-classes-per-file
class QueryRunnerAlreadyReleasedError extends BaseException {
    constructor() {
        super();
        this.msg = "存在事务无法执行当前查询";
        this.code = 500;
    }
}
exports.QueryRunnerAlreadyReleasedError = QueryRunnerAlreadyReleasedError;
/**
 * 查询数据库出错
 * 自定义返回信息和code
 */
// tslint:disable-next-line:max-classes-per-file
class QueryFailedError extends BaseException {
    constructor() {
        super();
        this.msg = "查询数据库出错";
        this.code = 500;
    }
}
exports.QueryFailedError = QueryFailedError;
