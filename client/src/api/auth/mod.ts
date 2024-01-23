import request from '@/utils/request'
export const getMod = () =>
    request({
        url: '/auth/Mod',
        method: 'get',
    });
export const createMod = (data: any) =>
    request({
        url: '/auth/Mod',
        method: 'post',
        data
    });
export const updataMod = (data: any) =>
    request({
        url: '/auth/Mod',
        method: 'put',
        data
    });
export const deleteMod = (params: any) =>
    request({
        url: '/auth/Mod',
        method: 'delete',
        params
    });