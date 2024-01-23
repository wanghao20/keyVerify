<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-select
                v-model="gameId"
                :placeholder="'游戏'"
                clearable
                class="filter-item"
                style="width: 130px"
            >
                <el-option
                    v-for="item in calendarTypeOptions"
                    :key="item.id"
                    :label="item.gameName"
                    :value="item.gameId"
                />
            </el-select> -->
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-document-add"
        @click="handleCreate"
        >{{ "新增素材" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-s-operation"
        @click="handleOperation(5)"
        >{{ "分组管理" }}</el-button
      >
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        size="small"
        icon="el-icon-s-unfold"
        @click="handleOperation(1)"
        >{{ "设置分组" }}</el-button
      >
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="图片素材" name="img">
        <!-- 表格 -->
        <el-table
          ref="multipleTableImg"
          :key="serveTableKey"
          v-loading="listLoading"
          :data="serveList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="selection"> </el-table-column>

          <el-table-column label="预览">
            <template slot-scope="scope">
              <img
                width="80px"
                height="80px"
                :src="downloadFileUrl + scope.row.url"
                class="avatar"
            /></template>
          </el-table-column>
          <el-table-column label="分组">
            <template slot-scope="scope"> {{ scope.row.grouping }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope"> {{ scope.row.createdTime }}</template>
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
      </el-tab-pane>
      <el-tab-pane label="视频素材" name="vid">
        <!-- 表格 -->
        <el-table
          ref="multipleTableVid"
          :key="clientTableKey"
          v-loading="listLoading"
          :data="clientList"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column type="selection"> </el-table-column>

          <el-table-column label="文件名">
            <template slot-scope="scope"> {{ scope.row.fileName }}</template>
          </el-table-column>
          <el-table-column label="分组">
            <template slot-scope="scope"> {{ scope.row.grouping }}</template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope"> {{ scope.row.createdTime }}</template>
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
      </el-tab-pane>
    </el-tabs>

    <!-- 弹窗(新建编辑) -->
    <el-dialog
      width="90%"
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="saveRules"
        label-position="left"
        label-width="100px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <el-upload
          class="upload-demo"
          :action="baseUrl"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          list-type="picture"
          :headers="headers"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png/mp4文件，且不超过20M
          </div>
        </el-upload>

        <el-form-item>
          <!-- <el-button type="primary" @click="showDiff()">保存</el-button> -->
          <!-- <el-button @click="dialogFormVisible = false">取消</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹窗(新建编辑) -->
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisibleG"
    >
      <el-form
        ref="dataForm"
        :rules="saveRules"
        label-position="left"
        label-width="100px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item :label="'名称'">
          <el-input
            v-model="name"
            name="gameName"
            type="text"
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>

        <el-form-item :label="'组号'">
          <el-input
            v-model="num"
            name="gameName"
            type="number"
            style="width: 200px"
            placeholder="请输入"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleG = false">{{ "取消" }}</el-button>
        <el-button type="primary" @click="createDataG()">{{
          "添加"
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗分组管理-->
    <el-dialog :title="'分组管理'" :visible.sync="dialogShowipFileDLoad">
      <div class="filter-container">
        <el-button
          class="filter-item"
          style="width: 200px"
          type="primary"
          size="small"
          icon="el-icon-s-unfold"
          @click="handleCreateG"
          >{{ "添加分组" }}</el-button
        >
      </div>
      <div
        style="
          width: 500px;
          margin-left: 50px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
      >
        <!-- 表格 -->
        <el-table
          ref="multipleTableFiles"
          v-loading="listLoading"
          :data="listGrouping"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
        >
          <el-table-column label="名称" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.name }}</template>
          </el-table-column>
          <el-table-column label="序号" sortable width="100" align="center">
            <template slot-scope="scope">{{ scope.row.num }}</template>
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
                @onConfirm="handleDeleteGrouping(row, $index)"
                @keyup.enter.native="handleDeleteGrouping(row, $index)"
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
      </div>
    </el-dialog>
    <!-- 弹窗(设置分组) -->
    <el-dialog :title="'设置分组'" :visible.sync="dialogShowipFile">
      <el-form
        ref="dataForm1"
        label-position="left"
        label-width="100px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <el-select
          v-model="groupingNum"
          :placeholder="'选择分组'"
          size="small"
          clearable
          class="filter-item"
          style="width: 130px"
        >
          <el-option
            v-for="item in calendarTypeOptions"
            :key="item.num"
            :label="item.name"
            :value="item.num"
          />
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogShowipFile = false">{{ "取消" }}</el-button>
        <el-button type="primary" @click="createDataGrouping()">{{
          "确认"
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Form, Input } from "element-ui";
import { Component, Vue } from "vue-property-decorator";
import { exportJson2Excel } from "@/utils/common/excel";
import JsonEditor from "@/components/JsonEditor/index.vue";
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
import {
  cfgByCfgId,
  createCfg,
  getCfgList,
  delectCfg,
  updateCfg,
} from "@/api/cfg/cfg";
import { Cfg } from "@/entity/cfg/Cfg";
import { BaseGame } from "@/entity/game/Game";
import {
  addGrouping,
  addGroupingSu,
  createDataGrouping,
  createGroupingSu,
  createSource,
  delecGrouping,
  delecGroupingSu,
  delSources,
  getGameList,
  getGroupingSu,
  getSources,
} from "@/api/game/game";
import XLSX from "xlsx";
import CodeMirror from "codemirror";
import {
  diff_match_patch,
  DIFF_EQUAL,
  DIFF_DELETE,
  DIFF_INSERT,
} from "diff-match-patch";
import { parse } from "path";
// 核心样式
import "codemirror/lib/codemirror.css";
// 引入主题后还需要在 options 中指定主题才会生效
import "codemirror/theme/idea.css";
// 需要引入具体的语法高亮库才会有对应的语法高亮效果
// codemirror 官方其实支持通过 /addon/mode/loadmode.js 和 /mode/meta.js 来实现动态加载对应语法高亮库
// 但 vue 貌似没有无法在实例初始化后再动态加载对应 JS ，所以此处才把对应的 JS 提前引入
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/css/css.js";
import "codemirror/mode/xml/xml.js";
import "codemirror/mode/shell/shell.js";
import "codemirror/mode/sql/sql.js";

//代码补全提示
import "codemirror/addon/hint/anyword-hint.js";
import "codemirror/addon/hint/css-hint.js";
import "codemirror/addon/hint/html-hint.js";
import "codemirror/addon/hint/javascript-hint.js";
import "codemirror/addon/hint/show-hint.css";
import "codemirror/addon/hint/show-hint.js";
import "codemirror/addon/hint/sql-hint.js";
import "codemirror/addon/hint/xml-hint.js";

//代码版本差异比较
import "codemirror/addon/merge/merge.js";
import "codemirror/addon/merge/merge.css";
import { StaticStr } from "@/config/StaticStr";
import { encryption } from "@/utils/encryption";
import { getToken } from "@/utils/cookies";
import { downloadFileUrl, updateFileUrl } from "@/api/common/common";
import { log } from "console";
// DiffMatchPatch config with global
window.diff_match_patch = diff_match_patch;
window.DIFF_DELETE = -1;
window.DIFF_INSERT = 1;
window.DIFF_EQUAL = 0;

const calendarTypeOptions: any = [];
@Component({
  name: "Cfg",
  components: {
    JsonEditor,
    UploadExcelComponent,
  },
})
export default class extends Vue {
  private downloadFileUrl = downloadFileUrl;
  private serveTableKey = 0;
  private clientTableKey = 0;
  private serveList: any[] = [];
  private clientList: any[] = [];
  private listLoading = true;
  private loading = true;
  private fileList = [];
  private headers = { authentication: getToken() };
  private baseUrl = updateFileUrl;
  // 弹窗上的字符
  private dialogStatus = "";
  // 控制弹窗显示
  private dialogFormVisibleG = false;
  private dialogFormVisible = false;
  private dialogFormVisibleCode = false;
  private dialogFormDelete = false;
  private tempCfgData: Cfg = new Cfg();
  // 默认选中
  private activeName = "img";
  private calendarTypeOptions = calendarTypeOptions;
  private activities = new Array();
  private oldStr: any;
  private newStr: any;
  private code = "";
  // 当前配置类型 0:服务器类型,1:客户端类型
  private cfgType = 0;
  private mergeValue: boolean = this.tempCfgData.merge === 1;
  private encryptionValue: boolean = this.tempCfgData.encryption === 1;

  // 选择游戏
  private gameId = "";
  private textMap = {
    update: "编辑",
    create: "创建",
  };
  private name = "";
  private num = "";
  private dialogShowipFileDLoad = false;
  private dialogShowipFile = false;
  listGrouping = [];
  groupingNum = 0;
  private handleRemove(file: any, fileList: any) {
    console.log(file, fileList);
  }
  /**
   * 删除分组信息
   */
  private async handleDeleteGrouping(row: any, index: number) {
    const { data } = await delecGroupingSu(row);
    this.listGrouping = data;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  private handlePreview(file: any) {
    console.log(file);
  }
  /**
   * 文件上传成功
   */
  private async handleAvatarSuccess(res: any, file: any) {
    let fileType = file.raw.type;
    let type = "";
    if (fileType == "image/png") {
      type = "image";
    }
    if (fileType == "image/jpeg") {
      type = "image";
    }
    if (fileType == "video/mp4") {
      type = "video";
    }
    let dataOne = {
      type: type,
      url: res.data,
      fileName: file.raw.name,
    };
    await createSource(dataOne);

    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_SAVE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.getData();
  }
  private async handleOperation(type: number) {
    //设置分组
    if (type === 1) {
      // 判断当前类型
      if (this.activeName == "img") {
        if ((<any>this.$refs.multipleTableImg).selection.length > 0) {
          this.dialogShowipFile = true;
          return;
        }
      } else {
        if ((<any>this.$refs.multipleTableVid).selection.length > 0) {
          this.dialogShowipFile = true;
          return;
        }
      }
      this.$notify({
        title: "提示!",
        message: "至少选择一个设备",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
    }
    // 分组管理
    if (type === 5) {
      this.name = "";
      this.num = "";
      this.dialogShowipFileDLoad = true;
    }
  }
  /**
   * 文件上传以前
   */
  beforeAvatarUpload(file: any) {
    // const isJPG = file.type === "image/jpeg";
    const isLt2M = file.size / 1024 / 1024 < 20;

    // if (!isJPG) {
    //   this.$message.error("上传头像图片只能是 JPG 格式!");
    // }
    if (!isLt2M) {
      this.$message.error("上传头像图片大小不能超过 20MB!");
    }
    return isLt2M;
  }
  /**
   * 绑定表单对应方法和事件
   */
  private saveRules = {
    cfgName: [{ required: true, message: "必选项", trigger: "change" }],
    version: [{ required: true, message: "必选项", trigger: "change" }],
  };
  private historyData: any[] = [];
  /**
   * 生命周期方法
   * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
   */
  created() {
    this.getData();
  }
  /**
   * 点击切换查看列表
   */
  handleClick(tab: any, event: any) {
    if (tab.name === "clientCfg") {
      this.cfgType = 1;
    } else {
      this.cfgType = 0;
    }
  }
  /**
   * 点击选择历史版本
   */
  historyClick(row: any) {
    this.tempCfgData = row;
    this.historyData.forEach((element) => {
      if (element.id === row.id) {
        this.tempCfgData = element;
      }
    });

    try {
      this.tempCfgData.body = JSON.parse(this.tempCfgData.body);
    } catch (error) {}
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
    let phones;
    if (this.activeName == "img") {
      phones = (<any>this.$refs.multipleTableImg).selection;
    } else {
      phones = (<any>this.$refs.multipleTableVid).selection;
    }
    const { data } = await createGroupingSu({
      phones: phones,
      num: this.groupingNum,
    });
    const cfgs = data;
    this.serveList = [];
    this.clientList = [];
    cfgs.forEach((v: any) => {
      if (v.type == "image") {
        // 图片素材
        this.serveList.push(v);
      } else {
        // 视频素材
        this.clientList.push(v);
      }
    });
    this.dialogShowipFile = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }

  /**
   * 选择文件
   */
  private beforeUpload(file: File) {
    // 判断文件格式
    if (!/\.(xls|xlsx|xlsm)$/.test(file.name.toLowerCase())) {
      this.$notify({
        title: "提示",
        message: "上传格式不正确，请上传xls/xlsx/xlsm格式",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
      return false;
    }
    return true;
  }
  /**
   * 初始化数据
   */
  private async getData() {
    const data = await getSources();
    const gdata = await getGroupingSu();
    this.listGrouping = gdata.data.items;
    this.calendarTypeOptions = this.listGrouping;
    // 获取
    this.serveList=[]
    this.clientList=[]
    const cfgs = data.data;
    cfgs.forEach((v: any) => {
      if (v.type == "image") {
        // 图片素材
        this.serveList.push(v);
      } else {
        // 视频素材
        this.clientList.push(v);
      }
    });
     // 按创建时间排序
    this.serveList = this.serveList.sort(function (a, b) {
      let aDate = new Date(a.createdTime || a.createdTime).getTime();
      let bDate = new Date(b.createdTime || a.createdTime).getTime();
      return bDate  - aDate;
    });
    this.clientList = this.clientList.sort(function (a, b) {
      let aDate = new Date(a.createdTime || a.createdTime).getTime();
      let bDate = new Date(b.createdTime || a.createdTime).getTime();
      return bDate-aDate;
    });
    this.listLoading = false;
  }
  /**
   * 创建
   */
  private handleCreate() {
    this.dialogFormVisible = true;
  }
  /**
   * 创建
   */
  private handleCreateG() {
    // 清理当前对象数据
    // this.imageUrl = "";
    this.name = "";
    this.num = "";
    this.dialogStatus = "create";
    this.dialogFormVisibleG = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  /**
   * 状态
   */
  changeMergeValue(state: boolean) {
    state ? (this.tempCfgData.merge = 1) : (this.tempCfgData.merge = 0);
  }
  /**
   * 状态
   */
  changeEncryptionValue(state: boolean) {
    state
      ? (this.tempCfgData.encryption = 1)
      : (this.tempCfgData.encryption = 0);
  }
  /**
   * 显示对比
   */
  private showDiff() {
    if (this.dialogStatus === "create") {
      this.createData();
      return;
    }
    // 验证是否选择文件
    if (this.newStr === undefined) {
      this.updateData();
      return;
    }
    this.dialogFormVisibleCode = true;
    /**
     * 延时执行dom加载完成调用
     */
    setTimeout((v) => {
      var target: any = this.$refs["view"]; //获取dom元素
      target.innerHTML = ""; //每次dom元素的内容清空
      CodeMirror.MergeView(this.$refs.view as HTMLTextAreaElement, {
        value: JSON.stringify(this.newStr, null, 2), //上次内容
        origLeft: null,
        orig: JSON.stringify(this.oldStr, null, 2), //本次内容
        lineNumbers: false, //显示行号
        connect: "align",
        readOnly: false, //只读 不可修改
        revertButtons: false, //事件比较替换
        mode: "application/json",
      });
    }, 1000);
  }
  /**
   * 创建保存
   */
  private createData() {
    (this.$refs.dataForm as Form).validate(async (valid) => {
      if (valid) {
        const { data } = await createCfg(this.tempCfgData);
        if (data !== undefined) {
          if (this.cfgType === 0) {
            this.serveList.unshift(data);
          } else {
            this.clientList.unshift(data);
          }
          this.dialogFormVisibleCode = false;
          this.dialogFormVisible = false;
          this.$notify({
            title: StaticStr.SUCCESS_CODE_CREATE,
            message: StaticStr.SUCCESS_CODE_CREATE_STR,
            type: "success",
            duration: StaticStr.CODE_TIME,
          });
        }
      }
    });
  }
  /**
   * 创建分组信息
   */
  private async createDataG() {
    const { data } = await addGroupingSu({
      name: this.name,
      num: this.num,
    });

    this.listGrouping = data;
    this.dialogFormVisibleG = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  /**
   * 修改保存
   */
  private async updateData() {
    (this.$refs.dataForm as Form).validate(async (valid) => {
      if (valid) {
        // 设置上对应的值
        await updateCfg(this.tempCfgData);
        this.$notify({
          title: StaticStr.SUCCESS_CODE_CREATE,
          message: StaticStr.SUCCESS_CODE_SAVE_STR,
          type: "success",
          duration: StaticStr.CODE_TIME,
        });
        this.dialogFormVisible = false;
        this.dialogFormVisibleCode = false;
      }
    });
  }
  /**
   * 导出json文件
   */
  private async exportJson() {
    let link = document.createElement("a");
    link.download = this.tempCfgData.cfgName + ".json";
    // 验证是否选择文件
    if (this.newStr === undefined) {
      link.href = "data:text/plain," + JSON.stringify(this.tempCfgData.body);
    } else {
      link.href = "data:text/plain," + this.tempCfgData.body;
    }
    link.click();
  }
  /**
   * 编辑配置信息
   */
  private async handleUpdate(row: Cfg) {
    this.tempCfgData = row;
    try {
      this.tempCfgData.body = JSON.parse(this.tempCfgData.body);
    } catch (error) {}
    this.oldStr = this.tempCfgData.body;
    this.newStr = undefined;
    this.dialogStatus = "update";
    this.dialogFormVisible = true;
    // 获取历史版本
    const data = await cfgByCfgId({ cfgId: row.cfgId });
    this.historyData = data.data;
    this.mergeValue = this.tempCfgData.merge === 1;
    this.encryptionValue = this.tempCfgData.encryption === 1;
    this.activities = [];
    this.historyData.forEach((v: Cfg) => {
      const activitie = {
        id: v.id,
        color: "#dfe4ed",
        createdTime: v.createdTime,
        version: v.version,
      };
      if (v.state === 1) {
        activitie.color = "#0bbd87";
        this.tempCfgData.version = (Number(v.version) + 0.1).toFixed(1); // 自动根据最新版设置版本号, 每次自动加0.1
      }
      this.activities.push(activitie);
    });
    this.loading = false;
  }

  /**
   * 删除信息
   */
  private async handleDelete(row: any, index: number) {
    await delSources({ url: row.url });
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.getData();
  }
}
</script>
<style lang="scss" scoped>
.editor-container {
  position: relative;
  height: 100%;
}
.el-col {
  padding: 10px;
}
.el-timeline-item {
  padding: 20px 0px;
}
</style>