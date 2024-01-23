<template>
  <div class="app-container">
    <!-- 过滤-->
    <div class="filter-container">
      <el-input
        v-model="listQuery.condition.ip"
        :placeholder="'key'"
        style="width: 20%"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.condition.time"
        :placeholder="'有效时长'"
        style="width: 10%"
        class="filter-item"
        size="small"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.condition.isBind"
        :placeholder="'是否使用'"
        size="small"
        clearable
        class="filter-item"
        style="width: 15%; margin-left: 10px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.name"
          :label="item.name"
          :value="item.val"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        style="margin-left: 10px;width: 10%"
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="handleFilter"
        >{{ "搜索" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px;width: 12%"
        type="primary"
        size="small"
        icon="el-icon-s-operation"
        @click="handleOperation(2)"
        >{{ "生成卡密" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px;width: 18%"
        type="primary"
        size="small"
        icon="el-icon-download"
        @click="handleDownload"
        >{{ "导出当前页面keys" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px;width: 17%"
        type="primary"
        size="small"
        icon="el-icon-loading"
        @click="handleDownloadAll"
        >{{ "清空失效key" }}</el-button
      >
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
      ref="multipleTable"
      :row-class-name="tableRowClassName"
      :default-sort="{
        prop: 'data',
        order: 'descending',
        name: 'model',
        order: 'descending',
      }"
    >
      >
      <el-table-column label="是否使用" width="100" align="center">
        <template slot-scope="scope">{{
          scope.row.isBind == 0 ? "否" : "是"
        }}</template>
      </el-table-column>
      <el-table-column width="150" align="center"
       label="key(点击复制)">
        <template slot-scope="scope"> 
        <el-button  
              slot="reference"
              @click="clickCoop(scope.row)">{{
           scope.row.keyStr
          }}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="绑定设备号" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.bindImei }}</template>
      </el-table-column>
      <el-table-column label="有效时长(小时)" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.time }}</template>
      </el-table-column>
      <el-table-column label="激活时间(小时)" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.hour }}</template>
      </el-table-column>
      <el-table-column label="是否是免费key" width="150" align="center">
        <template slot-scope="scope">{{
          scope.row.isFree == 0 ? "否" : "是"
        }}</template>
      </el-table-column>
      <el-table-column label="机型" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.model }}</template>
      </el-table-column>

      <!-- 操作按钮 -->
      <el-table-column
        :label="'操作'"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-popconfirm
            confirmButtonText="确认"
            cancelButtonText="取消"
            icon="el-icon-info"
            iconColor="red"
            title="确认删除吗?"
            @onConfirm="handleDelete(row, $index)"
            @keyup.enter.native="handleDelete(row, $index)"
            @click="handleDelete(row, $index)"
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
      :page-sizes="[50, 100, 200, 400]"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <!-- 弹窗(设置任务) -->
    <el-dialog :title="'生成卡密'" :visible.sync="dialogShowipTask">
      <el-form
        ref="dataForm1"
        label-position="left"
        label-width="150px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item label="是否免费">
          <el-select
            v-model="taskName"
            :placeholder="'(免费key每个设备只能用一次)'"
            size="small"
            clearable
            class="filter-item"
            style="width: 300px"
          >
            <el-option
              v-for="item in calendarTaskOptions"
              :key="item.name"
              :label="item.name"
              :value="item.val"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="使用时长(小时-不填写默认选择天数)">
          <el-input
            v-model="timeNum"
            type="number"
            style="width: 200px"
            placeholder="使用时长(小时-不填写默认选择天数)"
          />
        </el-form-item>
        <el-form-item :label="'使用时长(天)'">
          <el-input
            v-model="numDay"
            name="numDay"
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
              v-for="item in calendarTypeOptions2"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input
            v-model="numIndex"
            type="number"
            style="width: 200px"
            placeholder="生成数量"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowipTask = false">{{ "取消" }}</el-button>
        <el-button type="primary" @click="createDatatask(1)">{{
          "生成"
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { startLoading, endLoading, formatJson } from "@/utils/common/utils";
import { exportJson2Excel } from "@/utils/common/excel";
import { Form, Input } from "element-ui";
import Pagination from "@/components/Pagination/index.vue";
import {
  getGames,
  delectBaseGame,
  updateBaseGame,
  createBaseGame,
  createBaseGameList,
  setLuaUrl,
  uploadFile,
  dLoadFile,
  dowLoadFile,
  getGrouping,
  delecGrouping,
  addGrouping,
  createDataGrouping,
  createDatatask,
  saveConfig,
  getChargeKey,
  clearInvalidkeys,
} from "@/api/game/game";
import { getRoles } from "@/api/auth/role";
import { getToken } from "@/utils/cookies";
import { Paging } from "@/utils/Type";
import { downloadFileUrl, updateFileUrl } from "@/api/common/common";
import { StaticStr } from "@/config/StaticStr";
import { Phone } from "@/entity/Phone";
import axios from "axios";
import { getConfig, getTask } from "@/api/auth/user";
import { UserModule } from "@/store/modules/user";
import { log } from "console";
 // 导入插件
 import useClipboard from 'vue-clipboard3'
const calendarTypeOptions: any = [];
const calendarStatusOptions: any = [];
const calendarTaskOptions: any = [];
const calendarTaskAconOptions: any = [];
const calendarTypeOptions2: any = [];
@Component({
  name: "Game",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private ip = "";
  private name = "";
  private num = "0";
  private numDay = 1;
  private numIndex = 1;
  private timeNum = 0;
  private dayNum = "";
  private dates = "天";
  //select
  private calendarTypeOptions2 = calendarTypeOptions2;
  private taskName = 0;
  private groupingNum = "0";
  private tableFiles = 0;
  // 切换账号
  private switchNum: any = [1, 2, 3, 4, 5, 6];
  private switchOpenNum: any = {};
  private switchInNum: any = {};
  // 福袋参与时间
  private partTimeCk = false;
  private partTime = 0;
  private rateCk = false;
  private rate = 0;
  // 随机养号
  private randomkegCk = false;
  private isfree = false;
  private randomkegStart = 0;
  private randomkegEnd = 0;
  // 判断直播间人数是福袋数量的倍数
  private liveNumData = 0;
  private IsInNum = 0;
  private sleeTime = 0;
  // 随机养号时长
  private randomkegStartTime = 0;
  private randomkegEndTime = 0;
  // 配置
  private mediumRandom = false;
  private grabAttention = false;
  private grabIt = false;

  private tableKey = 0;
  private listGrouping = [];
  private fileList = [];
  private tableKeyPhone = 0;
  private list: Phone[] = [];
  private listPhone: Phone[] = new Array();
  private listLoading = true;
  private listLoadingPhone = false;
  private baseUrl = updateFileUrl;
  private downloadFileUrl = downloadFileUrl;
  // 分页对象
  private total = 0;
  private listQuery: Paging = {
    page: 1,
    limit: 50,
    condition: {
      ip: "",
      isBind: "",
      time: "",
      grouping: "",
    },
  };
  private downloadLoading = false;
  // 弹窗上的字符
  private dialogStatus = "";
  // 控制弹窗显示
  private dialogFormVisible = false;
  private dialogShowip = false;
  private dialogShowipFile = false;
  private dialogShowipLable = false;
  private dialogShowipList = false;
  private dialogShowipFileDLoad = false;
  private dialogFormVisibleCoom = false;
  private dialogShowipTask = false;
  private dialogShowipGroupingTask = false;
  private dialogShowipFiled = false;
  private dialogFormDelete = false;
  private dialogShowipscript = false;
  private ipStart = "";
  private tempBaseGameData: Phone = new Phone();
  private textMap = {
    update: "编辑",
    create: "创建",
  };

  //select
  private calendarTypeOptions = calendarTypeOptions;
  private calendarStatusOptions = calendarStatusOptions;
  private calendarTaskOptions = calendarTaskOptions;
  private calendarTaskAconOptions = [1, 2, 3, 4, 5, 6];
  private pageviewsData = [];
  private headers = { authentication: getToken() };
  private rolesData: any = null;
  private sortChange(data: any) {
    const { prop, order } = data;
    if (prop === "id") {
    }
  }
  /**
   * 绑定表单对应方法和事件
   */
  private saveRules = {
    name: [{ required: true, message: "必填项", trigger: "blur" }],
  };
  /**
   * 生命周期方法
   * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
   */
  created() {
    this.getList();
    this.calendarStatusOptions = [
      { name: "闲置", type: 0 },
      { name: "待运行任务", type: 1 },
      { name: "正在运行任务", type: 2 },
      { name: "任务出错", type: 3 },
      { name: "任务完成", type: 4 },
    ];
    this.calendarTypeOptions = [
      { name: "是", val: 1 },
      { name: "否", val: 0 },
    ];
    this.calendarTypeOptions2 = ["天", "月", "年"];
  }

  /**
   * 获取游戏数据
   */
  private async getList() {
    startLoading(this.listLoading);
    const { data } = await getGames(this.listQuery);
    this.list = data.items;
    this.total = data.total;
    // 模拟加载中结束
    this.listLoading = false;
  }

  private dIp = "";

  tableRowClassName(data: any) {
    // 0: 未设置任务(绿色)  1: 接到任务待执行(黄色) , 2 正在执行任务(蓝色), 3 : 任务出错(红色)
    if (data.row.type === 1) {
      return "warning-row";
    } else if (data.row.type === 0) {
      return "success-row";
    } else if (data.row.type === 2) {
      return "bu-row";
    } else if (data.row.type === 3) {
      return "dr-row";
    } else if (data.row.type === 4) {
      return "suc-row";
    }
    return "";
  }
  private lableList = {};
  private showList = {};
  /**
   * 导出json文件
   */
  private async handleDownload() {
    let link = document.createElement("a");
    link.download = "当前页面keys.txt";
    let keys = "";
    this.list.forEach((element: any) => {
      keys = keys + element.keyStr + " ";
    });
    // 验证是否选择文件
    link.href = "data:text/plain," + keys;
    // link.href = "data:text/plain," + this.tempCfgData.body;
    link.click();
  }
  /**
   * 验证是否选择手机
   */
  private async cilckShowLable(row: any, type: number) {
    if (type == 3) {
      this.lableList = row.lableList;
      this.dialogShowipLable = true;
    } else if (type == 2) {
      this.showList = row.friendList;
      this.dialogShowipList = true;
    } else {
      this.showList = row.mailList;
      this.dialogShowipList = true;
    }
  }
  private async handleOperation(type: number) {
    // 设置任务
    if (type === 2) {
      this.timeNum == 0;
      this.taskName == 0;
      this.calendarTaskOptions = [
        { name: "是", val: 1 },
        { name: "否", val: 0 },
      ];
      this.dialogShowipTask = true;
    }
  }
  /**
   * 保存新增的手机
   */
  private async savePhoneList() {
    if (this.listPhone.length == 0) {
      this.$notify({
        title: "提示!",
        message: "未搜索到设备",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
      return;
    }
    //保存数据到服务器
    const { data } = await createBaseGameList({ list: this.listPhone });
    this.dialogShowip = false;
    this.list = this.list.concat(this.listPhone);
  }
  /**
   * 创建
   */
  private handleCreate() {
    // 清理当前对象数据
    // this.imageUrl = "";
    this.name = "";
    this.num = "";
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
    startLoading(this.listLoading);
    const { data } = await getGames(this.listQuery);
    this.list = data.items;
    this.total = data.total;
    // 模拟加载中结束
    this.listLoading = false;
  }

  /**
   * 创建分组信息
   */
  private async createData() {
    const { data } = await addGrouping({
      name: this.name,
      num: this.num,
    });

    this.listGrouping = data;
    this.calendarTypeOptions = data;
    this.dialogFormVisible = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  /**
   * 创建配置信息
   */
  private async createConfigData() {
    // 账号切换配置
    let acoutConfig: any = {};
    for (let index = 0; index < 6; index++) {
      // 账号1
      acoutConfig[index] = [this.switchOpenNum[index], this.switchInNum[index]];
    }
    const config = {
      acoutConfig: acoutConfig,
      // 福袋参与时间
      partTimeCk: this.partTimeCk,
      partTime: this.partTime,
      // 福袋中奖率
      rateCk: this.rateCk,
      rate: this.rate,
      // 随机养号
      randomkegCk: this.randomkegCk,
      isfree: this.isfree,
      randomkegStart: this.randomkegStart,
      liveNumData: this.liveNumData,
      sleeTime: this.sleeTime,
      IsInNum: this.IsInNum,
      randomkegEnd: this.randomkegEnd,
      // 随机养号时长
      randomkegStartTime: this.randomkegStartTime,
      randomkegEndTime: this.randomkegEndTime,
      // 中福袋随机发留言点赞
      mediumRandom: this.mediumRandom,
      // 只抢关注直播间
      grabAttention: this.grabAttention,
      // 抢了是否抢免费福袋
      grabIt: this.grabIt,
    };
    const { data } = await saveConfig({
      config: config,
    });
    this.dialogFormVisibleCoom = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  /**
   * 创建任务
   */
  private async createDatatask(type: number) {
    this.numIndex;
    let data: any = {
      timeNum: this.timeNum,
      numIndex: this.numIndex,
      isFree: this.taskName,
    };
    // 使用时长
    if (this.timeNum == 0) {
      if (this.dates == "天") {
        data.timeNum = this.numDay * 24;
      }
      if (this.dates == "月") {
        data.timeNum = this.numDay * 24 * 30;
      }
      if (this.dates == "年") {
        data.timeNum = this.numDay * 24 * 30 * 360;
      }
    }
    // 生成数量

    let list:any[any] =await getChargeKey(data);
    console.log(list.data)
    let str=""
    for (let index = 0; index < list.data.length; index++) {
      const element = list.data[index];
      str=str+element.keyStr+"\n"
    }
    const { toClipboard } = useClipboard()
    // 复制
    await toClipboard(str)

    this.dialogShowipTask=false
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: "创建复制成功！",
      type: "success",
      duration: StaticStr.CODE_TIME,
    });

    this.handleFilter();
  }
  /**
   * 设置分组信息
   */
  private async createDataGrouping() {
    if (!this.groupingNum) {
      this.$notify({
        title: "提示!",
        message: "请选择分组",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
      return;
    }
    const phones: Phone[] = (<any>this.$refs.multipleTable).selection;
    const { data } = await createDataGrouping({
      phones: phones,
      num: this.groupingNum,
    });
    this.list = data;
    this.dialogShowipFile = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }

  /**
   * 删除设备信息
   */
  public async handleDelete(row: any, index: number) {
    console.log("row");
    const { data } = await delectBaseGame({ key: row.keyStr });
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.list.splice(index, 1);
  }
  /**
   * 点击复制
   * @param row 
   */
  public async clickCoop(row: any) {
    const { toClipboard } = useClipboard()
    // 复制
    await toClipboard(row.keyStr)
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: "点击复制成功！",
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  /**
   * 清空无效keys
   */
  private async handleDownloadAll(row: any, index: number) {
    const { data } = await clearInvalidkeys();
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.getList();
  }

  /**
   * 删除分组信息
   */
  private async handleDeleteGrouping(row: any, index: number) {
    const { data } = await delecGrouping(row);
    this.listGrouping = data;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
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
  width: 68px;
  height: 48px;
  line-height: 58px;
  text-align: center;
}
.avatar {
  width: 68px;
  height: 48px;
  display: block;
}

.el-table .bu-row {
  background: rgb(155, 175, 241);
}
.el-table .suc-row {
  background: rgb(106, 230, 117);
}

.el-table .dr-row {
  background: #f3b0b0;
}
.el-table .warning-row {
  background: rgb(238, 204, 145);
}

.el-table .success-row {
  background: #d3f1c2;
}
</style>