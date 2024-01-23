import request from '@/utils/request'
export const getRoles = () =>
    request({
        url: '/auth/role',
        method: 'get',
    });
export const getRolesPage = (params: any) =>
    request({
        url: '/auth/rolePage',
        method: 'get',
        params
    });
export const createRole = (data: any) =>
    request({
        url: '/auth/role',
        method: 'post',
        data
    });
export const updateRole = (data: any) =>
    request({
        url: '/auth/role',
        method: 'put',
        data
    });
export const delectRole = (data: any) =>
    request({
        url: '/auth/role',
        method: 'delete',
        data
    });
export const getRolesMods = (params: any) =>
    request({
        url: '/auth/roleMods',
        method: 'get',
        params
    });