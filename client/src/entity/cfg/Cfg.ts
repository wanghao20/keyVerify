import { BaseEntity } from '../Base.entity';

/**
 * Created by wh on 2020/94
 * author: wanghao
 * @desc：游戏配置
 */
export class Cfg extends BaseEntity {

    /**
     * 游戏gameId
     */
    public gameId: string = '';

    /**
     * 配置名称
     */
    public cfgName: string = '';
    /**
     * 描述
     */
    public doc: string = '';
    /**
     * 版本号
     */
    public version: string = '';
    /**
     * 配置类型:0服务器配置,1客户端配置
     */
    public type: number = 0;
    /**
     * 配置唯一id,新增时创建,更新版本时复用,用于区分配置
     */
    public cfgId: string = '';
    /**
     * 配置状态,0未启用,1启用,cfgId相同的配置中只能存在一个state=1
     */
    public state: number = 0;
    /**
     * 配置内容
     */
    public body: string = '';
    /**
     * 游戏name
     */
    public gameName: string = '';
    /**
     * 是否加密,0未加密,1加密
     */
    public encryption: number = 0;
    /**
    * 是否合并相同游戏配置,0否,1是,合并压缩
    */
    public merge: number = 0;
}
