import request from '@/utils/request'

export const getCfgList = (params: any) =>
    request({
        url: '/cfg/cfg',
        method: 'get',
        params
    });
export const cfgByCfgId = (params: any) =>
    request({
        url: '/cfg/cfgByCfgId',
        method: 'get',
        params
    });
export const createCfg = (data: any) =>
    request({
        url: '/cfg/cfg',
        method: 'post',
        data
    });
export const delectCfg = (params: any) =>
    request({
        url: '/cfg/cfg',
        method: 'delete',
        params
    });
export const updateCfg = (data: any) =>
    request({
        url: '/cfg/cfg',
        method: 'put',
        data
    });
