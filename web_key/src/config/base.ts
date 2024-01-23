/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：服务器基础配置
 */

export class BaseConfig {
    /**
     * 服务器端口配置
     */
    public static PORT = 9095;
    /**
     * redis配置
     */
    // public static REDIS_HOST = "127.0.0.1";
    public static REDIS_HOST = "49.232.175.251";
    	/**
	 * redis db配置(项目使用)
	 */
    public static SYSTEM_DB = 2;
    /**
     * redis端口配置
     */
    public static REDIS_PORT = 6379;
    /**
     * redis密码配置(需要在redisTool打开注释)
     */
    public static REDIS_PASSWORD = "wh231951";
 
    /**
         * token验证白名单Url
     */
    public static OPEN_URL = [
        "/auth/login",
        "/auth/captchaCode",
        "/favicon.ico",
        // 下载
        "/common/download",
        // 卡密
        "/game/verificationKey",
        // statistics
        "/game/statistics",
        // 热更新
        "/game/update",
    ];
    /**
     * 文件URL
     */
    public static OPEN_FILE_URL = "/common/download";

    /**
     * 这里处理特殊返回没有状态码的Url地址打印时显示正常
     */
    public static OPEN_LOG_URL = "/auth/captchaCode";
    /**
     * 1
     */
    public static OPEN_LOG_URL1 = "/common/download/";
    /**
     * 新注册玩家默认权限id
     */
    public static GHOST_DEFAULT_ROLE_ID = "b6363d60-71aa-4489-b784-4effa01dffd2";
    /**
     * name
     */
    public static GHOST_DEFAULT_ROLE_NAME = "访客";

}
