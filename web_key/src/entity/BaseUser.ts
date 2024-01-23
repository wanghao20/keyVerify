
/**
 * Created by wh on 2020/8/31
 * author: wanghao
 * @desc：用户
 */
export class BaseUser  {

   
    /**
     * 对应角色
     */
     public roles: string = '';
     /**
      * 用户名
      */
     public name: string = '';
     /**
      * 密码
      */
     public password: string = '';
     /**
      * createdTime
      */
     public createdTime: string = "";
     /**
      * hour
      */
     public hour: string = "";
     /**
      * 权限名称
      */
     public rolesName: string = '';
     /**
      * 设备数量
      */
     public maxNum: string = '';
     /**
      * 使用时长
      */
     public maxDate: number = 0;
}
