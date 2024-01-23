import '@/styles/element-variables.scss';
import '@/styles/index.scss';
import App from '@/App.vue';
import store from '@/store';
import router from '@/router';
import '@/icons/components';
import '@/permission';

import Vue, { DirectiveOptions } from 'vue';

import 'normalize.css';

import ElementUI from 'element-ui';

import SvgIcon from 'vue-svgicon';
import i18n from './i18n'
import * as directives from '@/directives'

Vue.use(ElementUI);
Vue.use(SvgIcon, {
    'tagName': 'svg-icon',
    defaultWidth: '1em',
    defaultHeight: '1em'
});
// Register global directives
Object.keys(directives).forEach(key => {
    Vue.directive(key, (directives as { [key: string]: DirectiveOptions })[key])
})
/**
 * 自定义错误捕获
 */
Vue.config.productionTip = false;
const errorHandler = (err: any, vm: any) => {
    console.error("捕获到错误")
    console.error(vm)
    console.error(err)
}
Vue.config.errorHandler = errorHandler;
Vue.config.warnHandler = function (msg, vm, trace) {
    console.error("捕获到警告")
    console.error(vm)
    console.error(msg)
    console.error(trace)
}

new Vue({
    router,
    store,
    i18n,
    render: (h) => h(App)
}).$mount('#app');