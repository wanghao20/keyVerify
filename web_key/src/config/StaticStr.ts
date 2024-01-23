/**
 * Created by wh on 2020/7/15
 * author: wanghao
 * @desc：保存静态字符串
 */
export class StaticStr {
	/**
	 * 默认参数错误状态码
	 */
    public static ERR_CODE_DEFAULT = 403;
	/**
	 * 默认成功返回状态码
	 */
    public static SUCCESS_CODE_DEFAULT = 200;
    /**
	 * 验证码错误
	 */
    public static ERR_CAPTCHA_CODE= "验证码错误/或者过期!请点击验证码重新获取!";
    /**
	 * 验证码错误
	 */
    public static ERR_DATE= "账号已过期!";
    /**
	 * 邮箱错误
	 */
    public static ERR_EMAIL_CODE= "邮箱格式错误!";
    /**
	 * 邮箱错误
	 */
    public static ERR_EMAILCO_CODE= "邮箱已经被使用!";
    /**
	 * 邮箱错误
	 */
    public static ERR_EMAILCO2_CODE= "请输入正确邮箱地址!";
	/**
	 * 默认错误提示字符
	 */
    public static DEFAULT = "信息错误";
	/**
	 * 后台接收参数验证错误默认提示文字
	 */
    public static ERR_MSG_VERIFY_DEFAULT = "参数错误";

	/**
	 * 用户名错误提示
	 */
    public static USERNAME_ERR_MSG = "用户名或密码错误";
	/**
	 * 注册错误提示
	 */
    public static INSERT_ERR_MSG = "名称已存在";
}
