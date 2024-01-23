interface ISettings {
    title: string // 重写默认标题
    showSettings: boolean //控件设置面板显示
    showTagsView: boolean // 控制tagsview显示
    showSidebarLogo: boolean // 控制siderbar徽标的显示
    fixedHeader: boolean // 如果为true，将固定组件
    errorLog: string[] // /启用errorLog组件的环境，默认值仅为“production”
    sidebarTextTheme: boolean // 如果为true，将根据主题更改提要栏的活动文本颜色
    devServerPort: number // webpack dev server的端口号
    mockServerPort: number // 模拟服务器的端口号
}

// You can customize below settings :)
const settings: ISettings = {
    title: '神乐网络卡密系统',
    showSettings: true,
    showTagsView: true,
    fixedHeader: true,
    showSidebarLogo: true,
    errorLog: ['production'],
    sidebarTextTheme: true,
    devServerPort: 9527,
    mockServerPort: 9528
}

export default settings
