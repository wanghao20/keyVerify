import request from '@/utils/request'
export const getGames = (params: any) =>
    request({
        url: '/game/game',
        method: 'get',
        params
    });
export const getGamesByAccount = (params: any) =>
    request({
        url: '/game/getGamesByAccount',
        method: 'get',
        params
    });
export const getGrouping = (params: any) =>
    request({
        url: '/game/grouping',
        method: 'get',
        params
    });
export const getGroupingSu = () =>
    request({
        url: '/game/groupingSu',
        method: 'get',
    });
export const getGameList = () =>
    request({
        url: '/game/games',
        method: 'get',
    });
export const dLoadFile = (params: any) =>
    request({
        url: '/game/dLoadFile',
        method: 'get',
        params
    });
export const dowLoadFile = (params: any) =>
    request({
        url: '/game/dowLoadFile',
        method: 'get',
        params
    });

export const createBaseGame = (data: any) =>
    request({
        url: '/game/game',
        method: 'post',
        data
    });
export const createDataGrouping = (data: any) =>
    request({
        url: '/game/createGrouping',
        method: 'post',
        data
    });
export const createGroupingSu = (data: any) =>
    request({
        url: '/game/createGroupingSu',
        method: 'post',
        data
    });
export const createDatatask = (data: any) =>
    request({
        url: '/game/createDatatask',
        method: 'post',
        data
    });
export const addGrouping = (params: any) =>
    request({
        url: '/game/addGrouping',
        method: 'get',
        params
    });
export const getChargeKey = (params: any) =>
    request({
        url: '/game/getChargeKey',
        method: 'get',
        params
    });
export const addGroupingSu = (params: any) =>
    request({
        url: '/game/addGroupingSu',
        method: 'get',
        params
    });
export const saveConfig = (data: any) =>
    request({
        url: '/game/saveConfig',
        method: 'post',
        data
    });
export const uploadFile = (data: any) =>
    request({
        url: '/game/uploadFile',
        method: 'post',
        data
    });
export const setLuaUrl = (data: any) =>
    request({
        url: '/game/setLuaUrl',
        method: 'post',
        data
    });
export const createBaseGameList = (data: any) =>
    request({
        url: '/game/games',
        method: 'post',
        data
    });
export const createSource = (data: any) =>
    request({
        url: '/game/createSource',
        method: 'post',
        data
    });
export const getSources = () =>
    request({
        url: '/game/getSources',
        method: 'get',
    });
export const delSources = (params: any) =>
    request({
        url: '/game/delSource',
        method: 'delete',
        params
    });
export const delectBaseGame = (params: any) =>
    request({
        url: '/game/game',
        method: 'delete',
        params
    });
export const clearInvalidkeys = () =>
    request({
        url: '/game/clearInvalidkeys',
        method: 'delete',
    });
export const delecGroupingSu = (params: any) =>
    request({
        url: '/game/groupingSu',
        method: 'delete',
        params
    });
export const delecGrouping = (params: any) =>
    request({
        url: '/game/grouping',
        method: 'delete',
        params
    });
export const updateBaseGame = (params: any) =>
    request({
        url: '/game/game',
        method: 'put',
        params
    });
