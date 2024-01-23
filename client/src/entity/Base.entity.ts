
/**
 * 实例公共字段
 */
export class BaseEntity {
    /**
     * id
     */
    public id: string = "";

    /**
     * createdTime
     */
    public createdTime?: string = "";

    /**
     *创建人
     */
    public createdBy?: string = "";

    /**
     *修改时间
     */
    public updatedTime?: string = "";

    /**
     *修改id
     */
    public updatedBy?: string = "";
    /**
     * 是否删除,0:否1:是
     */
    public isDelete?: number = 0;
}
