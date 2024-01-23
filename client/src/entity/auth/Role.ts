import { Mod } from './Mod';
import { BaseEntity } from '../Base.entity';

/**
 * Created by wh on 2020/3/3
 * author: wanghao
 * @desc：模块实体
 */
export class Role extends BaseEntity {

    /**
     * 角色名称
     */
    public roleName?: string = '';
    /**
     * 权限对应的模块ids
     */
    public mods?: Array<Mod> = [];
    /**
     * 是否禁止操作,0否1:是
     */
    public disabled?: number = 0;
}
