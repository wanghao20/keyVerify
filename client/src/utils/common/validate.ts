

/**
 * 验证菜单地址是否有效
 * @param path 
 */
export const isExternal = (path: string) => /^(https?:|mailto:|tel:)/.test(path)
