/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：类型定义
 */

/**
 *请求处理返回类型
 */
type ResData = {
    /**
     * 状态码
     */
    code: number;
    /**
     * 对称加密key
     */
    // key: string;
    /**
     * 消息提示
     */
    msg?: string;
    /**
     * 数据体
     */
    data?: any;
    /**
     * 错误体
     */
    err?: any;
};



/**
 *操作记录
 */
type TbLog = {
    /**
     * id
     */
    id?: string;
    /**
     * 操作用户id
     */
    userId?: string;
    /**
     * 操作时间
     */
    createdTime?: Date;
    /**
     * 操作类型:查询、新增、删除、更新
     */
    operationType?: string;
    /**
     * 操作地址
     */
    operationUrl?: string;
    /**
     * 操作ip
     */
    ip?: string;
};
/**
 *分页数据
 */
type Paging = {
    /**
     * 当前页面
     */
    page: number;
    /**
     * 分页大小
     */
    limit: number;
    /**
     * 过滤条件{}
     */
    condition: any;


};

export { Paging, ResData, TbLog };
