import { BaseEntity } from '../Base.entity';

/**
 * Created by wh on 2020/3/3
 * author: wanghao
 * @desc：模块实体
 */
export class Mod extends BaseEntity {

    /**
     * 父节点id
     */
    public pId?: string = '';
    /**
     * icon
     */
    public icon?: string = '';
    /**
     * 父节点名称
     */
    public pName?: string = '';
    /**
     * 模块名称
     */
    public label?: string = '';
    /**
     * 模块路由地址
     */
    public modPath?: string = '';
    /**
     * 模块标题
     */
    public modtTitle?: string = "";
    /**
     * vueComponent对应地址
     */
    public component?: string = '';
    /**
     * 是否禁止操作,0否1:是
     */
    public disabled?: number = 0;
    /**
     * 子节点
     */
    public children: Array<Mod> = [];
}
