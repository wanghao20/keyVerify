<template>
    <div class="login-container">
        <el-form
            ref="loginForm"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            autocomplete="on"
            label-position="left"
        >
            <div class="title-container">
                <h3 class="title">管理员登录</h3>
            </div>

            <el-form-item>
                <span class="svg-container">
                    <svg-icon name="user" />
                </span>
                <el-input
                    ref="username"
                    v-model="loginForm.username"
                    name="username"
                    type="text"
                    autocomplete="on"
                    placeholder="请输入用户名"
                />
            </el-form-item>

            <el-form-item>
                <span class="svg-container">
                    <svg-icon name="password" />
                </span>
                <el-input
                    :key="passwordType"
                    ref="password"
                    v-model="loginForm.password"
                    :type="passwordType"
                    placeholder="请输入密码"
                    name="password"
                    autocomplete="on"
                    @keyup.enter.native="handleLogin"
                />
                <span class="show-pwd" @click="showPwd">
                    <svg-icon
                        :name="
                            passwordType === 'password' ? 'eye-off' : 'eye-on'
                        "
                    />
                </span>
            </el-form-item>
            <el-form-item label prop="captchaCode">
                <el-input
                    v-model="loginForm.captchaCode"
                    placeholder="验证码"
                    prefix-icon="lj-icon-yanzhengma"
                    autocomplete="off"
                    autocapitalize="off"
                    spellcheck="false"
                    maxlength="8"
                    @keyup.enter.native="handleLogin"
                    style="float: left; width: 122px; margin-top: 6px"
                ></el-input>
                <div class="captcha_code">
                    <img
                        v-bind:src="captchaCode"
                        style="display: inline; float: right"
                        @click="initCaptchaCode"
                    />
                </div>
            </el-form-item>
            <el-button
                :loading="loading"
                type="primary"
                style="width: 100%; margin-bottom: 30px"
                @click.native.prevent="handleLogin"
                >登录</el-button
            >

            <!-- <div style="position: relative">
                <el-button
                    class="thirdparty-button"
                    type="info"
                    style="display: inline; float: left"
                    size="mini"
                    @click="showDialogPwd = true"
                    >忘记密码?</el-button
                >
                <el-button
                    class="thirdparty-button"
                    type="success"
                    style="display: inline; float: right"
                    size="mini"
                    @click="showDialog = true"
                    >注册</el-button
                >
            </div> -->
        </el-form>
        <el-dialog :title="'注册'" :visible.sync="showDialog">
            <el-form ref="insertForm" :model="insertForm" :rules="emailRules">
                <el-form-item style="background-color: #333" prop="name">
                    <span class="svg-container">
                        <svg-icon name="user" />
                    </span>
                    <el-input
                        ref="name"
                        v-model="insertForm.name"
                        name="name"
                        type="text"
                        placeholder="输入用户名"
                    />
                </el-form-item>
                <el-form-item style="background-color: #333" prop="password">
                    <span class="svg-container">
                        <svg-icon name="password" />
                    </span>
                    <el-input
                        :key="passwordTypeTwo"
                        ref="password"
                        v-model="insertForm.password"
                        :type="passwordTypeTwo"
                        placeholder="请输入密码"
                        name="password"
                        autocomplete="on"
                    />
                    <span class="show-pwd" @click="showPwdTwo">
                        <svg-icon
                            :name="
                                passwordTypeTwo === 'password'
                                    ? 'eye-off'
                                    : 'eye-on'
                            "
                        />
                    </span>
                </el-form-item>
                <el-form-item style="background-color: #333" prop="email">
                    <span class="svg-container">
                        <i class="el-icon-message"></i>
                    </span>
                    <el-input
                        ref="email"
                        v-model="insertForm.email"
                        name="email"
                        type="text"
                        autocomplete="on"
                        placeholder="输入邮箱地址"
                    />
                </el-form-item>
                <el-button
                    :loading="insertLoading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px"
                    @click.native.prevent="insert"
                    >注册</el-button
                >
            </el-form>
        </el-dialog>
        <el-dialog :title="'找回密码'" :visible.sync="showDialogPwd">
            <el-form
                ref="retrieveForm"
                :model="retrieveForm"
                :rules="retrieveRules"
            >
                <el-form-item style="background-color: #333" prop="email">
                    <el-row :gutter="20">
                        <el-col :span="14">
                            <span class="svg-container">
                                <i class="el-icon-message"></i>
                            </span>
                            <el-input
                                ref="email"
                                v-model="retrieveForm.email"
                                name="email"
                                type="text"
                                style="width: 80%"
                                autocomplete="on"
                                placeholder="请输入您的邮箱地址"
                            />
                        </el-col>
                        <el-col :span="10">
                            <el-button
                                :disabled="getCodedisabled"
                                type="primary"
                                style="
                                    display: inline;
                                    float: right;
                                    height: 52px;
                                "
                                @click.native.prevent="getCode"
                                >发送验证码到邮箱</el-button
                            >
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item style="background-color: #333" prop="code">
                    <span class="svg-container">
                        <i class="el-icon-chat-line-square"></i>
                    </span>
                    <el-input
                        ref="code"
                        v-model="retrieveForm.code"
                        name="code"
                        type="text"
                        placeholder="请输入收到的code"
                    />
                </el-form-item>
                <el-form-item style="background-color: #333" prop="password">
                    <span class="svg-container">
                        <svg-icon name="password" />
                    </span>
                    <el-input
                        :key="passwordType3"
                        ref="password"
                        v-model="retrieveForm.password"
                        :type="passwordType3"
                        placeholder="请输入新密码"
                        name="password"
                        autocomplete="on"
                    />
                    <span class="show-pwd" @click="showPwd3">
                        <svg-icon
                            :name="
                                passwordType3 === 'password'
                                    ? 'eye-off'
                                    : 'eye-on'
                            "
                        />
                    </span>
                </el-form-item>
                <el-button
                    :loading="insertLoading"
                    type="primary"
                    style="width: 100%; margin-bottom: 30px"
                    @click.native.prevent="retrievePwd"
                    >提交</el-button
                >
            </el-form>
        </el-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { Dictionary } from "vue-router/types/router";
import { Form as ElForm, Input } from "element-ui";
import { UserModule } from "@/store/modules/user";
import {
    startLoading,
    endLoading,
    validateUsername,
    validatePassword,
} from "@/utils/common/utils";
import { captchaCode, validEmailCode, getEmailCode } from "@/api/auth/user";
import BaseUrl from "@/config/baseUrl";
import { setToken } from "@/utils/cookies";
import { resetRouter } from "@/router";
import { StaticStr } from "@/config/StaticStr";

@Component({
    name: "Login",
})
export default class extends Vue {
    /**
     * 设置默认值
     */
    private loginForm = {
        // username: "",
        // password: "",
        // username: "Administrator",
        username:"",
        password: "",
        captchaCode: "",
        time: "",
    };
    private insertForm = {
        name: "",
        password: "",
        email: "",
    };
    private retrieveForm = {
        email: "",
        code: "",
        password: "",
    };
    /**
     * 绑定表单对应方法和事件
     */
    private loginRules = {
        username: [
            { required: true, validator: validateUsername, trigger: "blur" },
        ],
        password: [
            { required: true, validator: validatePassword, trigger: "blur" },
        ],
        captchaCode: [{ required: true, message: "必填项", trigger: "blur" }],
    };
    private emailRules = {
        name: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
        email: [{ required: true, message: "必填项", trigger: "blur" }],
    };
    private retrieveRules = {
        email: [{ required: true, message: "必填项", trigger: "blur" }],
        code: [{ required: true, message: "必填项", trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }],
    };
    /**
     * 初始化定义变量
     */
    private passwordType = "password";
    private passwordTypeTwo = "password";
    private passwordType3 = "password";
    private getCodedisabled = false;
    private loading = false;
    private insertLoading = false;
    private getCodeLoading = false;
    private showDialog = false;
    private showDialogPwd = false;
    private redirect?: string;
    private captchaCode: string = "";
    private otherQuery: Dictionary<string> = {};
    /**
     * 进入页面时触发的方法
     *   @Watch:监听路由变化
     */
    @Watch("$route", { immediate: true })
    private onRouteChange(route: Route) {
        const query = route.query as Dictionary<string>;
        if (query) {
            this.redirect = query.redirect;
            this.otherQuery = this.getOtherQuery(query);
        }
    }

    /**
     * 生命周期方法
     * 在模板渲染成html后调用，通常是初始化页面完成后，
     * 再对html的dom节点进行一些需要的操作。
     */
    mounted() {
        if (this.loginForm.username === "") {
            (this.$refs.username as Input).focus();
        } else if (this.loginForm.password === "") {
            (this.$refs.password as Input).focus();
        }
        this.initCaptchaCode();
    }

    /**
     * 找回密码
     */
    private async retrievePwd() {
        const obj = this.retrieveForm;
        const { data } = await validEmailCode(obj);
    }
    /**
     * 获取邮箱验证码
     */
    private async getCode() {
        const { data } = await getEmailCode({ email: this.retrieveForm.email });

        if (data == "") {
            this.getCodedisabled = true;
            this.$notify({
                title: StaticStr.SUCCESS_CODE_CREATE,
                message: "获取成功请查收邮件",
                type: "success",
                duration: StaticStr.CODE_TIME,
            });
        }
    }
    /**
     * 获取图形验证码
     */
    private async initCaptchaCode() {
        const time = Date.now().toString();
        this.loginForm.time = time;
        this.captchaCode = `${BaseUrl}auth/captchaCode?time=${time}`;
    }

    /**
     * 显示密码
     */
    private showPwd() {
        if (this.passwordType === "password") {
            this.passwordType = "";
        } else {
            this.passwordType = "password";
        }
        this.$nextTick(() => {
            (this.$refs.password as Input).focus();
        });
    }
    /**
     * 显示密码
     */
    private showPwdTwo() {
        if (this.passwordTypeTwo === "password") {
            this.passwordTypeTwo = "";
        } else {
            this.passwordTypeTwo = "password";
        }
        this.$nextTick(() => {
            (this.$refs.passwordTypeTwo as Input).focus();
        });
    }
    /**
     * 显示密码
     */
    private showPwd3() {
        if (this.passwordType3 === "password") {
            this.passwordType3 = "";
        } else {
            this.passwordType3 = "password";
        }
        this.$nextTick(() => {
            (this.$refs.passwordType3 as Input).focus();
        });
    }

    /**
     * 注册
     */
    private insert() {
        (this.$refs.insertForm as ElForm).validate(async (valid: boolean) => {
            if (valid) {
                startLoading(this.insertLoading);
                await UserModule.insert(this.insertForm);
                this.$router.push({
                    path: "/dashboard/dashboard",
                    query: this.otherQuery,
                });
                endLoading(this.insertLoading);
            } else {
                return false;
            }
        });
    }

    /**
     * 登录
     */
    private handleLogin() {
        (this.$refs.loginForm as ElForm).validate(async (valid: boolean) => {
            if (valid) {
                startLoading(this.loading);
                const data = await UserModule.Login(this.loginForm);
                if (data) {
                    // err 自动重新获取验证码
                    this.initCaptchaCode();
                }
                //   path: this.redirect || "/dashboard/dashboard",
                this.$router
                    .push({
                        path: "/dashboard/dashboard",
                        query: this.otherQuery,
                    })
                    .catch((err) => {
                        // 捕获路由错误 这里跳转时动态路由为初始化完成,
                    });
                endLoading(this.loading);
            } else {
                return false;
            }
        });
    }

    /**
     * 获取传递来的参数
     */
    private getOtherQuery(query: Dictionary<string>) {
        return Object.keys(query).reduce((acc, cur) => {
            if (cur !== "redirect") {
                acc[cur] = query[cur];
            }
            return acc;
        }, {} as Dictionary<string>);
    }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wo    rdpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
    .login-container .el-input {
        input {
            color: $loginCursorColor;
        }
        input::first-line {
            color: $lightGray;
        }
    }
}

.login-container {
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            height: 47px;
            background: transparent;
            border: 0px;
            border-radius: 0px;
            padding: 12px 5px 12px 15px;
            color: $lightGray;
            caret-color: $loginCursorColor;
            -webkit-appearance: none;

            &:-webkit-autofill {
                box-shadow: 0 0 0px 1000px $loginBg inset !important;
                -webkit-text-fill-color: #fff !important;
            }
        }
    }

    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
.login-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: $loginBg;

    .login-form {
        position: relative;
        width: 520px;
        max-width: 100%;
        padding: 160px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: $darkGray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $lightGray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }

    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $darkGray;
        cursor: pointer;
        user-select: none;
    }
}
</style>
