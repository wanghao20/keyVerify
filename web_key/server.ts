/**
 * 项目启动文件
 */
declare var require: any;
// tslint:disable-next-line:no-var-requires
let App = require("./src/app").App;

const app = new App();

app.start();
