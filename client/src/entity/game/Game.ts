import { BaseEntity } from '../Base.entity';

/**
 * Created by wh on 2020/94
 * author: wanghao
 * @desc：游戏模块
 */
export class BaseGame extends BaseEntity {

    /**
     * gameId
     */
    public gameId: string = '';
    /**
     * lcon
     */
    public icon: string = '';
    /**
     * 产品名称
     */
    public gameName: string = '';
    /**
     * 描述
     */
    public doc: string = '';
    /**
     * appid
     */
    public appid: string = '';
    /**
     * Ftp路径(游戏路径)
     */
    public gamePath: string = '';
    /**
     * 游戏配置
     */
    public config: string = '';
    /**
     * 版本号
     */
    public version: string = '';
    /**
     * 当前状态
     */
    public status: number = 0;
    /**
     * 公司团队
     */
    public team: string = '';
    /**
     * 人员安排
     */
    public staffGear: string = '';
}
