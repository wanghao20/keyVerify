/**
 * 通用工具class
 * wanghao
 * 2319512282@qq.com
 * @Date 2020.8.29
 * @Doc 基础常用工具类
 */

import { Mod } from '@/entity/auth/Mod';

/**
 * 开始加载动画
 * @param listLoading 控制开关
 */
export const startLoading = (listLoading: boolean) => {
    listLoading = true
}
/**
 * 结束加载动画
 * @param listLoading 控制开关
 */
export const endLoading = (listLoading: boolean) => {
    setTimeout(() => {
        listLoading = false;
    }, 0.5 * 1000);
}
// 使用filterKeys数组格式化和过滤json数据
export const formatJson = (filterKeys: any, jsonData: any) =>
    jsonData.map((data: any) => filterKeys.map((key: string) => {
        if (key === 'timestamp') {
            return parseTime(data[key])
        } else {
            return data[key]
        }
    }))
// 解析时间到字符串
export const parseTime = (

    time?: object | string | number | null,
    cFormat?: string
): string | null => {
    if (time === undefined || !time) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date: Date
    if (typeof time === 'object') {
        date = time as Date
    } else {
        if (typeof time === 'string') {
            if (/^[0-9]+$/.test(time)) {
                // support "1548221490638"
                time = parseInt(time)
            } else {
                // support safari
                // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
                time = time.replace(new RegExp(/-/gm), '/')
            }
        }
        if (typeof time === 'number' && time.toString().length === 10) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj: { [key: string]: number } = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
        const value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        return value.toString().padStart(2, '0')
    })
    return timeStr

}

/**
 * 找到根节点id
 * @param event
 */
export const findRootId = (mods: Array<Mod>) => {
    for (let i = 0; i < mods.length; i++) {
        if (
            mods[i].pId === "undefined" ||
            mods[i].pId === undefined ||
            mods[i].pId === null ||
            mods[i].pId === ""
        ) {
            return mods[i];
        }
    }
    return new Mod();
}
/**
 * 移除根节点,返回子节点列表
 * @param event
 */
export const getNoPnodes = (mods: Array<Mod>) => {
    const list = [];
    for (let i = 0; i < mods.length; i++) {
        if (
            mods[i].pId === "undefined" ||
            mods[i].pId === undefined ||
            mods[i].pId === null ||
            mods[i].pId === ""
        ) {
            mods.slice(i);
        } else {
            list.push(mods[i])
        }
    }
    return list;
}
/**
 * 根据父id递归获树形数据
 */
export const findNodes = (mods: Array<Mod>, pId?: string) => {
    // 按创建时间排序
    mods.sort(function (a, b) {
        return Number(a.createdTime) - Number(b.createdTime);
    });
    let nodes: Array<Mod> = [];
    mods.forEach((mod) => {
        if (mod.pId == pId) {
            if (isChildrenBypId(mods, mod.id)) {
                const data = findNodes(mods, mod.id);
                mod.children = data;
            }
            nodes.push(mod);
        }
    });
    return nodes;
}

/**
 * 传入有子节点模块数组判断子节点是否存在参数二中,不存在剔除返回
 */
export const takeOutNodes = (mods: Array<Mod>) => {
    let newNode = Array.from(mods)
    mods.forEach((mod) => {
        if (mod.children.length > 0) {
            // 有子节点去过滤一次
            mod.children = findNodesTakeOut(mod.children, newNode)
        }
        // 没有子节点判断新数组中是否存在不存在则删除
        if (newNode.indexOf(mod) === -1) {
            newNode = newNode.filter(({ id }) => id !== mod.id);
        }
    });
    return newNode;
}
/**
 * name
 */
const findNodesTakeOut = (mods: Array<Mod>, newNode: Array<Mod>,) => {
    const data: Array<Mod> = []
    mods.forEach((mod) => {
        if (mod.children.length > 0) {
            // 有子节点去过滤一次
            findNodesTakeOut(mod.children, newNode)
        }
        // 没有子节点判断新数组中是否存在存在则添加到children
        if (newNode.indexOf(mod) !== -1) {
            data.push(mod)
        }
    });
    return data;
}

/**
 * 判断当前node是否存在子节点
 */
export const isChildrenBypId = (mods: Array<Mod>, pId?: string) => {
    for (let i = 0; i < mods.length; i++) {
        if (mods[i].id == pId) {
            return true;
        }
    }
    return false;
}
/**
 * 拷贝对象类型
 * @param obj 
 */
export const deepClone = (obj: any) => {
    let copy: any = null;
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = deepClone(obj[i]);
        }
        return copy;
    }

    // Handle Function
    if (obj instanceof Function) {
        copy = function () {
            return obj.apply(arguments);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = deepClone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj as type isn't supported " + obj.constructor.name);
}

/**
 * 验证用户名
 * @param rule 
 * @param value 
 * @param callback 
 */
export const validateUsername = (
    rule: any,
    value: string,
    callback: Function
) => {
    if (value.length < 6) {
        callback(new Error("请检查用户名是否合法(最低6位)"));
    } else {
        callback();
    }
};
/**
 * 验证密码
 */
export const validatePassword = (rule: any, value: string, callback: Function) => {
    const pwdRegex = new RegExp("(?=.*[0-9])(?=.*[a-zA-Z]).{8,30}");
    if (!pwdRegex.test(value)) {
        callback(
            new Error(
                "您的密码复杂度太低（8位密码中必须包含字母、数字），请及时修改密码！"
            )
        );
    } else {
        callback();
    }
}
