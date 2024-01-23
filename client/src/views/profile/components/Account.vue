<template>
  <el-form ref="userForm" :model="userForm" :rules="userRules">
    <el-form-item :label="'头像'" prop="avatar">
      <el-upload
        class="avatar-uploader"
        :action="baseUrl"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :headers="headers"
      >
        <img
          v-if="userForm.avatar"
          :src="downloadFileUrl + userForm.avatar"
          class="avatar"
        />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item label="设备数" prop="name">
      <el-input disabled v-model="userForm.maxNum" />
    </el-form-item>
    <el-form-item label="剩余时间" prop="name">
      <el-input disabled :value="getHour()" />
    </el-form-item>
    <el-form-item label="登录名称" prop="name">
      <el-input disabled v-model="userForm.name" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        key="password"
        ref="password"
        v-model="userForm.password"
        type="password"
        placeholder="请输入密码"
        name="password"
        autocomplete="on"
      />
    </el-form-item>
    <!-- <el-form-item label="Email" prop="email">
            <el-input v-model.trim="userForm.email" />
        </el-form-item> -->
    <el-form-item>
      <el-button type="primary" @click="submit">保存修改</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { downloadFileUrl, updateFileUrl } from "@/api/common/common";
import { getToken } from "@/utils/cookies";
import { Component, Prop, Vue } from "vue-property-decorator";
import { IProfile } from "../index.vue";
import { User } from "@/entity/auth/User";
import { ElForm } from "element-ui/types/form";
import { updateUser } from "@/api/auth/user";
import { StaticStr } from "@/config/StaticStr";

@Component({
  name: "Account",
})
export default class extends Vue {
  @Prop({ required: true }) private user!: IProfile;
  /**
   * 验证用户名
   */
  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (value.length < 5) {
      callback(new Error("请检查用户名是否合法(最低6位)"));
    } else {
      callback();
    }
  };

  /**
   * 验证密码
   */
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 6) {
      callback(new Error("请检查用户名是否合法(最低6位)"));
    } else {
      callback();
    }
  };
  private userRules = {
    name: [{ validator: this.validateUsername, trigger: "blur" }],
    password: [{ validator: this.validatePassword, trigger: "blur" }],
    avatar: [{ required: true, message: "必填项", trigger: "blur" }],
  };
  private imageUrl = "";
  private headers = { authentication: getToken() };
  private baseUrl = updateFileUrl;
  private baseUser: User = new User();
  private userForm = {
    id: this.user.id,
    maxNum: this.user.maxNum,
    name: this.user.name,
    password: "",
    avatar: this.user.avatar,
  };
  private downloadFileUrl = downloadFileUrl;
  /**
   * 提交保存
   */
  private getHour() {
    const endDate = new Date().getTime();
    const startDate = Number(new Date(this.user.createdTime));

    const dataDf = endDate - startDate;
    // 计算出小时数
    const hour = Math.floor(dataDf / 1000 / 60 / 60);
    console.log("hour" + hour);

    let lastDate = Number(this.user.maxDate) - hour;
    if (lastDate < 0) {
      lastDate = 0;
    }
    return lastDate + "小时";
  }
  private submit() {
    (this.$refs.userForm as ElForm).validate(async (valid: boolean) => {
      if (valid) {
        const { data } = await updateUser(this.userForm);
        this.$message({
          message: StaticStr.SUCCESS_CODE_SAVE_STR,
          type: "success",
          duration: StaticStr.CODE_TIME,
        });
      } else {
        return false;
      }
    });
  }
  /**
   * 文件上传成功
   */
  handleAvatarSuccess(res: any, file: { raw: any }) {
    this.userForm.avatar = res.data;
  }
  /**
   * 文件上传以前
   */
  beforeAvatarUpload(file: any) {
    const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPG) {
      this.$message.error("上传头像图片只能是 JPG 格式!");
    }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 2MB!");
    }
    return isJPG && isLt2M;
  }
}
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>