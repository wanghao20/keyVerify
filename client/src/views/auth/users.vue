<template>
  <div class="app-container">
    <!-- 过滤-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition.name"
        :placeholder="'用户名'"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
                v-model="listQuery.condition.roles"
                :placeholder="'角色'"
                clearable
                class="filter-item"
                style="width: 130px"
            >
                <el-option
                    v-for="item in calendarTypeOptions"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id"
                />
            </el-select> -->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
        >{{ "搜索" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >{{ "新增" }}</el-button
      >
      <!-- <el-button
                v-waves
                :loading="downloadLoading"
                class="filter-item"
                type="primary"
                icon="el-icon-download"
                @click="handleDownload"
                >{{ "导出" }}</el-button
            > -->
    </div>
    <!-- 表格 -->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="sortChange"
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="剩余时长">
        <template slot-scope="scope">{{ scope.row.hour }}</template>
      </el-table-column>
      <!-- <el-table-column label="对应角色" width="180" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.rolesName }}</span>
                </template>
            </el-table-column> -->
      <el-table-column
        align="center"
        prop="created_at"
        label="创建时间"
        width="250"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createdTime }}</span>
        </template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column
        :label="'操作'"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">{{
            "编辑"
          }}</el-button>

          <el-popconfirm
            confirmButtonText="确认"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="确认删除吗?"
            @onConfirm="handleDelete(row, $index)"
            @keyup.enter.native="handleDelete(row, $index)"
          >
            <el-button
              v-if="row.status !== 'deleted'"
              size="mini"
              type="danger"
              slot="reference"
              >{{ "删除" }}</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 弹窗(新建编辑) -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="saveRules"
        :model="tempUserData"
        label-position="left"
        label-width="100px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <!-- <el-form-item :label="'角色'" prop="roles">
                    <el-select
                        v-model="tempUserData.roles"
                        class="filter-item"
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item2 in calendarTypeOptions"
                            :key="item2.id"
                            :label="item2.roleName"
                            :value="item2.id"
                        />
                    </el-select>
                </el-form-item> -->

        <el-form-item
          :label="'用户名'"
          :prop="dialogStatus === 'create' ? 'name' : ''"
        >
          <el-input
            v-model="tempUserData.name"
            name="name"
            type="text"
            placeholder="输入用户名"
            style="width: 200px"
            :disabled="dialogStatus !== 'create'"
          />
        </el-form-item>

        <el-form-item :label="'密码'" v-if="dialogStatus !== 'create'">
          <el-input
            v-model="tempUserData.password"
            type="password"
            style="width: 200px"
            :placeholder="
              dialogStatus === 'create' ? '请输入密码' : '不输入默认不更改'
            "
            name="password"
          />
        </el-form-item>

        <el-form-item
          :label="'密码'"
          v-if="dialogStatus === 'create'"
        >
          <el-input
            v-model="tempUserData.password"
            type="password"
            style="width: 200px"
            :placeholder="
              dialogStatus === 'create' ? '请输入密码' : '不输入默认不更改'
            "
            name="password"
          />
        </el-form-item>
        <el-form-item :label="'设备数'">
          <el-input
            v-model="tempUserData.maxNum"
            name="name"
            type="number"
            placeholder="输入最大连接数"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item :label="'账号有效时长'">
          <el-input
            v-model="num"
            name="num"
            type="number"
            style="width: 100px"
          />
          <el-select
            v-model="dates"
            :placeholder="'选择时长'"
            clearable
            class="filter-item"
            style="width: 130px"
          >
            <el-option
              v-for="item in calendarTypeOptions"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ "取消" }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
          >{{ "保存" }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import {
  startLoading,
  endLoading,
  formatJson,
  validatePassword,
  validateUsername,
} from "@/utils/common/utils";
import { exportJson2Excel } from "@/utils/common/excel";
import { User } from "@/entity/auth/User";
import { Form, Input } from "element-ui";
import Pagination from "@/components/Pagination/index.vue";
import { getUsers, createUser, updateUser, delectUser } from "@/api/auth/user";
import { getRoles } from "@/api/auth/role";
import { Paging } from "@/utils/Type";
import { StaticStr } from "@/config/StaticStr";

const calendarTypeOptions: any = [];
@Component({
  name: "Users",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private tableKey = 0;
  private list: User[] = [];
  private listLoading = true;
  // 分页对象
  private total = 0;
  private listQuery: Paging = {
    page: 1,
    limit: 10,
    condition: {
      name: "",
      roles: "",
    },
  };
  private dates = "";
  private num = 0;
  // 弹窗上的字符
  private dialogStatus = "";
  // 控制弹窗显示
  private dialogFormVisible = false;
  private dialogFormDelete = false;
  private tempUserData: User = new User();
  private textMap = {
    update: "编辑",
    create: "创建",
  };
  //select
  private calendarTypeOptions = calendarTypeOptions;
  private pageviewsData = [];
  private rolesData: any = null;
  /**
   * 绑定表单对应方法和事件
   */
  private saveRules = {
    roles: [{ required: true, message: "必选项", trigger: "change" }],
    name: [{ required: true, validator: validateUsername, trigger: "blur" }],
  };

  /**
   * 生命周期方法
   * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
   */
  created() {
    this.getList();
  }

  /**
   * 获取玩家数据
   */
  private async getList() {
    startLoading(this.listLoading);
    // todo 暂时使用auth数据显示
    const { data } = await getUsers(this.listQuery);
    if (this.rolesData === null) {
      // this.rolesData = await getRoles();
    }
    this.calendarTypeOptions = ["天", "月", "年"];
    data.items.forEach((user: any) => {
      const startDate = Number(new Date(user.createdTime));
      const endDate = new Date().getTime();
      const dataDf = endDate - startDate;
      // 计算出小时数
      const hour = Math.floor(dataDf / 1000 / 60 / 60);
      console.log("hour" + hour);

      let lastDate = Number(user.maxDate) - hour;
      if (lastDate < 0) {
        lastDate = 0;
      }
      user["hour"] = lastDate + "小时";
    });
    this.list = data.items;
    this.total = data.total;
    // 模拟加载中结束
    this.listLoading = false;
  }
  /**
   * 创建用户
   */
  private handleCreate() {
    // 清理当前对象数据
    this.tempUserData = new User();
    this.num = 0;
    this.dates = "天";
    this.dialogStatus = "create";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  /**
   * 搜索
   */
  private async handleFilter() {
   this.getList()
  }

  private sortChange(data: any) {
    const { prop, order } = data;
    if (prop === "id") {
    }
  }
  /**
   * 创建用户信息
   */
  public createData() {
    (this.$refs.dataForm as Form).validate(async (valid) => {
      if (valid) {
        const user = this.tempUserData;
        if (this.dates == "天") {
          user.maxDate = this.num * 24;
        }
        if (this.dates == "月") {
          user.maxDate = this.num * 24 * 30;
        }
        if (this.dates == "年") {
          user.maxDate = this.num * 24 * 30 * 360;
        }
        const { data } = await createUser(user);
        data.timestamp = Date.parse(data.timestamp);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: StaticStr.SUCCESS_CODE_CREATE,
          message: StaticStr.SUCCESS_CODE_CREATE_STR,
          type: "success",
          duration: StaticStr.CODE_TIME,
        });
      }
    });
  }
  /**
   * 修改用户信息
   */
  private updateData() {
   
    (this.$refs.dataForm as Form).validate(async (valid) => {
      if (valid) {
        this.calendarTypeOptions.forEach((v: any) => {
          if (v.id === this.tempUserData.roles) {
            this.tempUserData.rolesName = v.roleName;
          }
        });
        const tempData = Object.assign({}, this.tempUserData);
        if (this.dates == "天") {
          tempData.maxDate = this.num * 24;
        }
        if (this.dates == "月") {
          tempData.maxDate = this.num * 24 * 30;
        }
        if (this.dates == "年") {
          tempData.maxDate = this.num * 24 * 30 * 360;
        }

        const { data } = await updateUser(tempData);
        const index = this.list.findIndex((v) => v.id === data.id);
        this.getList();
        this.dialogFormVisible = false;
        this.$notify({
          title: StaticStr.SUCCESS_CODE_CREATE,
          message: StaticStr.SUCCESS_CODE_UPDATA_STR,
          type: "success",
          duration: StaticStr.CODE_TIME,
        });
      }
    });
  }

  /**
   * 编辑用户信息
   */
  private handleUpdate(row: any) {
    this.tempUserData = Object.assign({}, row);
    this.dialogStatus = "update";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }

  /**
   * 删除用户信息
   */
  private async handleDelete(row: any, index: number) {
    const { data } = await delectUser(row);
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.list.splice(index, 1);
  }
}
</script>
