/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：类型定义
 */
/**
 *请求处理返回类型
 */
export type ResData = {
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
 * 路由类型
 */
export type RouteMeta = {
	/**
	 * 路由名称
	 */
    "name": string;
	/**
	 * 方法名称
	 */
    "method": string;
	/**
	 * 路径
	 */
    "path": string;
};
/**
 * token配置类型
 */
export type TokenConfig = {
    /**
     * 过期时间
     */
    exp: number;
    /**
     * 数据体
     */
    data: {};
};
export type Key = {
    /**
     * 激活时间
     */
    exp: number;
    /**
     * 是否是免费
     */
    isFree:number;// 0否 1是
    /**
     * 是否绑定
     */
    isBind:number;// 0否 1是
      /**
     * 绑定设备id
     */
    bindImei:string;// 0否 1是
    /**
     * time
     */
    time:number;// 可使用时长
    /**
     * model
     */
    model:string;// model
};
/**
 *分页数据
 */
export type Paging = {
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
/**
 *任务
 */
export type Task = {
    /**
     * 时间戳
     */
    time: string;
    /**
     * 任务内容
     */
    con: string;
    /**
     * 任务名称
     */
    name: string;
    /**
     * 设备号
     */
    IMEI: string;
    /**
     * 手机型号
     */
    model: string;
    /**
     * 任务状态
     */
    type: 0; // 0: 未设置任务 1: 已设置任务
    /**
     * ip
     */
    ip: string;
    /**
     * 设备分组
     */
    grouping: 0;// 默认分组

};
