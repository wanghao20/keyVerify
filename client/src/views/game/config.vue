<template>
  <div class="app-container">
    <!-- 过滤-->
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
        >{{ "新增任务" }}</el-button
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
      :default-sort="{ prop: 'date', order: 'descending' }"
      @sort-change="sortChange"
    >
      <el-table-column label="来源">
        <template slot-scope="scope">{{
          scope.row.user ? "系统下发" : "自建"
        }}</template>
      </el-table-column>
      <el-table-column label="选中设备/分组">
        <template slot-scope="scope">{{ scope.row.phoneType }}</template>
      </el-table-column>
      <el-table-column label="任务类型">
        <template slot-scope="scope">{{ scope.row.taskType }}</template>
      </el-table-column>
      <el-table-column label="任务备注">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="发布类型">
        <template slot-scope="scope">{{ scope.row.releaseType }}</template>
      </el-table-column>
      <el-table-column sortable prop="date" label="执行时间">
        <template slot-scope="scope">{{ formatDate(scope.row) }}</template>
      </el-table-column>
      <el-table-column sortable prop="date" label="执行状态">
        <template slot-scope="scope">{{ scope.row.state }}</template>
      </el-table-column>
       <el-table-column sortable prop="date" label="创建时间">
        <template slot-scope="scope">{{ scope.row.createdTime }}</template>
      </el-table-column>
      <!-- 操作按钮 -->
      <el-table-column
        :label="'操作'"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            v-if="!row.user"
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
            >{{ "编辑" }}</el-button
          >
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
      :page-sizes="[10,50,100, 200, 400]"
      :page.sync="listQueryTask.page"
      :limit.sync="listQueryTask.limit"
      @pagination="getList"
    />

    <!-- 弹窗(新建编辑) -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="150px"
        autocomplete="on"
        style="width: 400px; margin-left: 50px"
      >
        <el-form-item :label="'任务类型'">
          <el-select
            v-model="taskType"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item2 in calendarTypeOptions"
              :key="item2"
              :label="item2"
              :value="item2"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="'任务备注'">
          <el-input
            v-model="name"
            type="text"
            style="width: 200px"
            autocomplete="on"
            placeholder="输入任务名称"
          />
        </el-form-item>
        <el-form-item :label="'选择设备'">
          <el-button type="success" @click="clickSelectPhone()">{{
            selePhoneText
          }}</el-button>
          <span
            v-if="
              taskType === '群发群任务' &&
              (selectPhone.length > 1 || this.phoneType == '分组')
            "
            >默认发送到设备所有群</span
          >
        </el-form-item>
        <el-form-item :label="'任务文字'" v-if="taskType !== '加群好友'">
          <el-input
            v-model="taskText"
            type="text"
            placeholder="任务配套文字"
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item :label="'选择素材'" v-if="taskType !== '加群好友'">
          <el-button type="success" @click="clickSelectSource()">{{
            seleSourceText
          }}</el-button>
        </el-form-item>
        <el-form-item :label="'任务链接'" v-if="taskType !== '加群好友'">
          <el-input
            v-model="taskUrl"
            name="name"
            type="text"
            placeholder="链接"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="'选择群'"
          v-if="
            taskType !== '朋友圈任务' &&
            selectPhone.length == 1 &&
            this.phoneType == '设备'
          "
        >
          <!-- :multiple="taskType !== '加群好友'" -->
          <el-select
            v-model="selectGroup"
            :multiple="true"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item2 in selectGroupOptions"
              :key="item2"
              :label="item2"
              :value="item2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'输入群下标'"
          v-if="
            taskType == '加群好友' &&
            (selectPhone.length > 1 || this.phoneType == '分组')
          "
        >
          <el-input
            v-model="groupIndex"
            name="name"
            type="text"
            placeholder="所有选中设备添加第几个群"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item :label="'开始数'" v-if="taskType == '加群好友'">
          <el-input
            v-model="startAddNum"
            name="name"
            type="text"
            placeholder="从该群的第几个好友开始加"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item :label="'设置添加人数'" v-if="taskType == '加群好友'">
          <el-input
            v-model="addNum"
            name="name"
            type="text"
            placeholder="一共发送多少个好友请求"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item :label="'添加验证信息'" v-if="taskType == '加群好友'">
          <el-input
            v-model="vInfo"
            name="name"
            type="text"
            placeholder="添加验证信息"
            style="width: 400px"
          />
        </el-form-item>

        <el-form-item :label="'评论'" v-if="taskType == '朋友圈任务'">
          <el-input
            v-model="comment"
            name="name"
            type="text"
            placeholder="评论"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="'时间间隔（秒）'"
          v-if="taskType !== '朋友圈任务'"
        >
          <el-input
            v-model="intervalTime"
            type="text"
            placeholder="时间间隔（秒）"
            style="width: 400px"
          />
        </el-form-item>
        <el-form-item
          :label="'选择提醒好友'"
          v-if="
            taskType == '朋友圈任务' &&
            selectPhone.length == 1 &&
            this.phoneType == '设备'
          "
        >
          <el-button type="success" @click="clickSelectFriend()">{{
            selecFriendText
          }}</el-button>
        </el-form-item>
        <el-form-item
          :label="'发布类型'"
          prop="roles"
          v-if="taskType !== '加群好友'"
        >
          <el-select
            v-model="releaseType"
            class="filter-item"
            placeholder="请选择"
          >
            <el-option
              v-for="item2 in releaseTypeOptions"
              :key="item2"
              :label="item2"
              :value="item2"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          :label="'选择日期时间'"
          v-if="releaseType == '单次' || taskType == '加群好友'"
        >
          <el-date-picker
            v-model="taskTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item :label="'选择日期时间'" v-if="releaseType == '时间段'">
          <el-date-picker
            v-model="taskTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          :label="'选择时间'"
          v-if="
            (releaseType == '时间段' || releaseType == '每天') &&
            taskType !== '加群好友'
          "
        >
          <el-time-picker
            v-model="taskTimeDate"
            :picker-options="{
              selectableRange: '00:00:00 - 23:59:59',
            }"
            placeholder="任意时间点"
          >
          </el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ "取消" }}</el-button>
        <el-button type="primary" @click="dialogStatus === createData()">{{
          "保存"
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗(选择设备) -->
    <el-dialog title="选择设备" :visible.sync="dialogFormVisiblePhone">
      <el-tabs v-model="phoneType" @tab-click="handleClick">
        <el-tab-pane label="分组" name="分组">
          <div
            style="
          margin-top: 20px
          width: 500px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
          >
            <el-radio-group v-model="selectGrouping" size="small">
              <div
                v-for="item in listGrouping"
                :key="item.num"
                style="margin-top: 20px"
              >
                <el-radio
                  :key="item.num"
                  :label="item.num"
                  :value="item.num"
                  border
                  >{{ item.name }}</el-radio
                >
              </div>
            </el-radio-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设备" name="设备">
          <div
            style="
          margin-top: 20px
          width: 500px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
          >
            <el-checkbox-group v-model="selectPhone" size="small">
              <div
                v-for="item in listPhone"
                :key="item.IMEI"
                style="margin-top: 20px"
              >
                <el-checkbox :label="item.IMEI" :value="item.IMEI" border>{{
                  item.model
                }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisiblePhone = false">{{
          "取消"
        }}</el-button>
        <el-button type="primary" @click="savePhoneData()">{{
          "保存"
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗(选择素材) -->
    <el-dialog title="选择素材" :visible.sync="dialogFormVisibleSource">
      <el-select
        :placeholder="'选择分组'"
        size="small"
        v-model="selectG"
        clearable
        class="filter-item"
        style="width: 130px"
     
      >
        <el-option
          v-for="item in calendarTypeOptionsGrouping"
          :key="item.num"
          :label="item.name"
          :value="item.num"
        />
      </el-select>
       <el-button size="small" round @click="selectChange()">{{
          "过滤"
        }}</el-button>
      <el-tabs v-model="sourceType" @tab-click="handleClick">
        <el-tab-pane label="图片" name="图片">
          <div
            style="
          margin-top: 20px
          width: 500px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
          >
            <el-checkbox-group v-model="selectImg">
              <div
                style="margin-top: 20px"
                v-for="item in serveList"
                :key="item.url"
              >
                <el-checkbox :label="item.url" :key="item.url">
                  <img
                    width="80px"
                    height="80px"
                    :src="downloadFileUrl + item.url"
                    class="avatar"
                /></el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="视频">
          <div
            style="
          margin-top: 20px
          width: 500px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
          >
            <el-radio-group v-model="selectVid">
              <div
                v-for="item in clientList"
                :key="item.url"
                style="margin-top: 20px"
              >
                <el-radio :label="item.url" :value="item.url" :key="item.url"
                  >{{ item.fileName }}
                  <!-- <video
                    width="80px"
                    height="80px"
                    :src="downloadFileUrl + item.url"
                  ></video> -->
                </el-radio>
              </div>
            </el-radio-group>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleSource = false">{{
          "取消"
        }}</el-button>
        <el-button type="primary" @click="saveSourceeData()">{{
          "保存"
        }}</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗(选择好友) -->
    <el-dialog title="选择好友" :visible.sync="dialogFormVisibleFriend">
      <el-tabs v-model="friendType" @tab-click="handleClick">
        <el-tab-pane label="标签" name="标签">
          <div
            style="
          margin-top: 20px
          width: 500px;
          height: 200px;
          overflow-x: hidden;
          overflow-y: auto;
        "
          >
            <el-checkbox-group v-model="selectLabel" size="small">
              <div
                v-for="item in listLabel"
                :key="item"
                style="margin-top: 20px"
              >
                <el-checkbox :key="item" :label="item" :value="item" border>{{
                  item
                }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
        <el-tab-pane label="好友" name="好友">
          <div
            style="
            margin-top: 20px
            width: 500px;
            height: 200px;
            overflow-x: hidden;
            overflow-y: auto;
            "
          >
            <el-checkbox-group v-model="selectFriend" size="small">
              <div
                v-for="item in listFriend"
                :key="item"
                style="margin-top: 20px"
              >
                <el-checkbox :key="item" :label="item" :value="item" border>{{
                  item
                }}</el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleFriend = false">{{
          "取消"
        }}</el-button>
        <el-button type="primary" @click="saveFriendData()">{{
          "保存"
        }}</el-button>
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
import {
  createUser,
  updateUser,
  delectUser,
  getTask,
  addTask,
  delTask,
  addTimeTask,
  delTimeTask,
  getTimeTask,
} from "@/api/auth/user";
import { getRoles } from "@/api/auth/role";
import { Paging } from "@/utils/Type";
import { StaticStr } from "@/config/StaticStr";
import {
  getGames,
  getGrouping,
  getGroupingSu,
  getSources,
} from "@/api/game/game";
import { downloadFileUrl } from "@/api/common/common";
import { log } from "console";

const calendarTypeOptions: any = ["朋友圈任务", "加群好友", "群发群任务"];
const selectGroupOptions: any = [];
const calendarTypeOptionsGrouping: any = [];
const releaseTypeOptions: any = ["单次", "时间段", "每天"];
const listGrouping: any = [];
const listPhone: any = [];
const listLabel: any = [];
const listFriend: any = [];
@Component({
  name: "Users",
  components: {
    Pagination,
  },
})
export default class extends Vue {
  private downloadFileUrl = downloadFileUrl;
  private tableKey = 0;
   protected selectG = "";
  protected selectGroupingData= [];
  private releaseType = "单次";
  private taskType = "朋友圈任务";
  private phoneType = "分组";
  private sourceType = "图片";
  private friendType = "标签";
  private selectGrouping = "";
  private taskTime = "";
  private taskTimeDate = "";
  private selectPhone: any = [];
  private selectLabel = [];
  private selectFriend = [];
  private selectVid = "";
  private selectImg = [];
  private serveList: any[] = [];
  private clientList: any[] = [];
  private list: any[] = [];
  private listLoading = true;
  // 分页对象
  private total = 0;
  private listQuery: Paging = {
    page: 1,
    limit: 10000,
    condition: {
      name: "",
      roles: "",
    },
  };
  private listQueryPhone: Paging = {
    page: 1,
    limit: 10000,
    condition: {
      ip: "",
      status: "",
      grouping: "",
    },
  };
   private listQueryTask: any = {
    page: 1,
    limit: 10,
    condition: {
    },
    user: "",
  };
  private downloadLoading = false;
  // 弹窗上的字符
  private dialogStatus = "";
  private name = "";
  private time = "";
  private taskText = "";
  private taskUrl = "";
  private vInfo = "";
  private addNum = "";
  private startAddNum = "";
  private groupIndex = "";
  private comment = "";
  private intervalTime = "";
  private selectGroup = [];
  private con = "";
  // 控制弹窗显示
  private dialogFormVisible = false;
  private dialogFormVisiblePhone = false;
  private dialogFormVisibleSource = false;
  private dialogFormVisibleFriend = false;
  private dialogFormDelete = false;
  private tempUserData: User = new User();
  private textMap = {
    update: "编辑",
    create: "创建",
  };
  //select
  private calendarTypeOptions = calendarTypeOptions;
  private releaseTypeOptions = releaseTypeOptions;
  private calendarTypeOptionsGrouping = calendarTypeOptionsGrouping;
  private selectGroupOptions = selectGroupOptions;
  private pageviewsData = [];
  private rolesData: any = null;
  listGrouping: any = listGrouping;
  listPhone: [] = listPhone;
  listLabel: any = listLabel;
  listFriend: any = listFriend;
  private selePhoneText: string = "";
  private seleSourceText: string = "";
  private selecFriendText: string = "";

  /**
   * 生命周期方法
   * 在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
   */
  created() {
    this.getList();
  }
  formatDate(value: any) {
    if (value.releaseType == "时间段") {
      let str = "";
      for (let index = 0; index < value.taskTime.length; index++) {
        const element = value.taskTime[index];
        var date = new Date(element);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        let strli = "";
        if (index == 1) {
          strli = "  至 ";
        } else {
          strli = "";
        }
        str =
          str +
          strli +
          " " +
          year +
          "-" +
          month +
          "-" +
          day +
          " " +
          hours +
          ":" +
          minutes +
          ":" +
          seconds;
      }
      var date = new Date(value.taskTimeDate);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      return str + " 每日：" + hours + ":" + minutes + ":" + seconds;
    } else if (value.releaseType == "每天") {
      var date = new Date(
        value.taskTime == "" ? value.taskTimeDate : value.taskTime
      );
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      //返回数据
      return hours + ":" + minutes + ":" + seconds;
    } else {
      var date = new Date(value.taskTime);
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      //返回数据
      return (
        year +
        "-" +
        month +
        "-" +
        day +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        seconds
      );
    }
  }
    private async getSuList() {
        // 加载素材数据
    const data:any = await getSources();
    this.selectGroupingData = data.data;
  }
  /**
   * 获取数据
   */
  private async getList() {
    startLoading(this.listLoading);
    // todo 暂时使用auth数据显示
    const { data } = await getTimeTask(this.listQueryTask);
    this.list = data.items;
    this.total = data.total;
    // 模拟加载中结束
    this.listLoading = false;
    this.init();
    
  }
  public async init() {
    // 加载设备数据
    const { data } = await getGames(this.listQueryPhone);
    this.listPhone = data.items;
  }
  /**
   * 保存选择设备
   */
  private savePhoneData() {
 
    // 初始化标签和群和好友
    this.selectLabel = [];
    this.selectGroup = [];
    this.selectFriend = [];
    if (this.selectPhone.length == 1) {
      this.listPhone.forEach((val: any) => {
        if (val.IMEI == this.selectPhone[0]) {
          this.selectGroupOptions = val.mailList;
          this.listLabel = Object.keys(val.lableList);
          this.listFriend = val.friendList;
        }
      });
    }

    if (this.phoneType == "分组") {
      this.selectPhone = [];
      this.selePhoneText = "已选择分组:" + this.selectGrouping;
      if (this.selectGrouping == "") {
        this.$notify({
          title: "提示",
          message: "请选择分组",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
    } else {
      this.selectGrouping = "";
      this.selePhoneText = "已选择:" + this.selectPhone.length + this.phoneType;

      if (this.selectPhone.length == 0) {
        this.$notify({
          title: "提示",
          message: "请选择设备",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
    }
    this.dialogFormVisiblePhone = false;
  }
  /**
   * 保存选择素材
   */
  private saveSourceeData() {
    console.log(this.sourceType);
    console.log(this.selectImg);
    console.log(this.selectVid);
    if (this.sourceType == "视频") {
      this.selectImg = [];
      this.seleSourceText = "已选择视频:" + this.selectVid;
      if (this.selectVid == "") {
        this.$notify({
          title: "提示",
          message: "请选择视频",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
    } else {
      this.selectVid = "";
      this.seleSourceText = "已选择:" + this.selectImg.length + this.sourceType;
      if (this.selectImg.length == 0) {
        this.$notify({
          title: "提示",
          message: "请选择图片",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
      if (this.selectImg.length > 9) {
        this.$notify({
          title: "提示",
          message: "最多选择9张",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
    }
    this.dialogFormVisibleSource = false;
  }
  /**
   * 保存选择好友
   */
  private saveFriendData() {
    console.log(this.friendType);
    console.log(this.selectLabel);
    console.log(this.selectFriend);
    if (this.friendType == "标签") {
      this.selectFriend = [];
      this.selecFriendText = "已选择标签:" + this.selectLabel;
    } else {
      this.selectLabel = [];
      this.selecFriendText =
        "已选择:" + this.selectFriend.length + this.friendType;
    }

    this.dialogFormVisibleFriend = false;
  }
  /**
   *
   */
  private handleClick(tab: any, event: any) {
    console.log(tab, event);
  }
  /**
   * 点击选择设备
   */
  private async clickSelectPhone() {
    // 加载分组数据
    const gdata = await getGrouping(this.listQuery);
    this.listGrouping = gdata.data.items;
    // 加载设备数据
    const { data } = await getGames(this.listQueryPhone);
    this.listPhone = data.items;
    // this.selectPhone = [];

    this.dialogFormVisiblePhone = true;
  }
 
  /**
   * 素材分组筛选
   */
  private async selectChange() {
  
    // 获取
    this.serveList = [];
    this.clientList = [];
    let sData= this.selectGroupingData.filter((item: any) => String(item.grouping).indexOf(this.selectG) !== -1);
    sData.forEach((v: any) => {
      if (v.type == "image") {
        // 图片素材
        this.serveList.push(v);
      } else {
        // 视频素材
        this.clientList.push(v);
      }
    });
    // 排序
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
  }
  /**
   * 点击选择素材
   */

  private async clickSelectSource() {
    this.getSuList();
    // 加载分组数据
    const gdata = await getGroupingSu();
    this.calendarTypeOptionsGrouping = gdata.data.items;
    this.dialogFormVisibleSource = true;
  }
  /**
   * 点击选择好友
   */
  private async clickSelectFriend() {
    if (this.selectPhone.length !== 1 || this.phoneType !== "设备") {
      this.$notify({
        title: "提示",
        message: "选择单个设备才可以选择提醒谁看",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
      return;
    }
    // 加载数据
    this.dialogFormVisibleFriend = true;
  }
  /**
   * 创建用户
   */
  private handleCreate() {
    // 清理当前对象数据
    this.taskType = ""; // 任务类型
    this.name = ""; // 任务备注
    this.taskText = ""; // 任务文字
    this.taskUrl = ""; // 任务url
    this.selectGroup = []; // 选中群
    this.groupIndex = ""; // 群下标
    this.startAddNum = ""; // 开始添加数 从该群的第几个好友开始加
    this.addNum = ""; // 添加个数
    this.vInfo = ""; // 添加验证信息
    this.comment = ""; // 评论文字
    this.intervalTime = ""; // 时间间隔
    this.releaseType = ""; // 发布类型
    this.taskTime = ""; // 任务时间
    this.taskTimeDate = ""; // 任务时间区间
    this.phoneType = ""; // 设备类型
    this.selectGrouping = ""; // 选中分组
    this.selectPhone = []; // 选中设备
    this.sourceType = ""; // 素材类型
    this.selectImg = []; // 选中图片
    this.selectVid = ""; // 选中视频
    this.friendType = ""; // 好友类型
    this.selectLabel = []; // 选中标签
    this.selectFriend = []; // 选中好友
    this.dialogStatus = "create";
    this.dialogFormVisible = true;
    this.selePhoneText = "点击选择设备";
    this.seleSourceText = "点击选择素材";
    this.selecFriendText = "点击选择好友";

    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
  /**
   * 搜索
   */
  private async handleFilter() {
    this.listQuery.page = 1;
    startLoading(this.listLoading);
    const { data } = await getTask(this.listQuery);
    this.list = data.items;
    this.total = data.total;
    // 模拟加载中结束
    this.listLoading = false;
  }
  /**
   * 导出Excel
   */
  private handleDownload() {
    this.downloadLoading = true;
    const keys = Object.keys(this.list[0]);
    const tHeader = keys;
    const filterVal = keys;
    const data = formatJson(filterVal, this.list);
    exportJson2Excel(tHeader, data, "table-list");
    this.downloadLoading = false;
  }
  private sortChange(data: any) {
    const { prop, order } = data;
    if (prop === "id") {
    }
  }
  /**
   * 创建信息
   */
  private async createData() {
    if (this.name == "") {
      this.$notify({
        title: "提示",
        message: "必须填写任务名字!",
        type: "warning",
        duration: StaticStr.CODE_TIME,
      });
      return;
    }

    if (this.taskType == "加群好友") {
      if (
        this.selectGroup.length !== 1 &&
        this.phoneType == "设备" &&
        this.selectPhone.length == 1
      ) {
        this.$notify({
          title: "提示",
          message: "选择加群好友任务只能选择一个群!",
          type: "warning",
          duration: StaticStr.CODE_TIME,
        });
        return;
      }
    }
    const { data } = await addTimeTask({
      taskType: this.taskType, // 任务类型
      name: this.name, // 任务备注
      taskText: this.taskText, // 任务文字
      taskUrl: this.taskUrl, // 任务url
      selectGroup: this.selectGroup, // 选中群
      groupIndex: this.groupIndex, // 群下标
      startAddNum: this.startAddNum, // 开始添加数 从该群的第几个好友开始加
      addNum: this.addNum, // 添加个数
      vInfo: this.vInfo, // 添加验证信息
      comment: this.comment, // 评论文字
      intervalTime: this.intervalTime, // 时间间隔
      releaseType: this.releaseType, // 发布类型
      taskTime: this.taskTime, // 任务时间
      taskTimeDate: this.taskTimeDate, // 任务时间区间
      phoneType: this.phoneType, // 设备类型
      selectGrouping: this.selectGrouping, // 选中分组
      selectPhone: this.selectPhone, // 选中设备
      sourceType: this.sourceType, // 素材类型
      selectImg: this.selectImg, // 选中图片
      selectVid: this.selectVid, // 选中视频
      friendType: this.friendType, // 好友类型
      selectLabel: this.selectLabel, // 选中标签
      selectFriend: this.selectFriend, // 选中好友
    });
    const index = this.list.findIndex((v) => v.name === data.name);

    if (index !== -1) {
      this.list.splice(index, 1, data);
    } else {
      this.list.unshift(data);
    }
    this.dialogFormVisible = false;
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_CREATE_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
  }
  /**
   * 删除用户信息
   */
  private async handleDelete(row: any, index: number) {
    const { data } = await delTimeTask(row);
    this.$notify({
      title: StaticStr.SUCCESS_CODE_CREATE,
      message: StaticStr.SUCCESS_CODE_DEL_STR,
      type: "success",
      duration: StaticStr.CODE_TIME,
    });
    this.getList();
  }
  /**
   * 编辑用户信息
   */
  private handleUpdate(row: any) {
    console.log(row);
    this.taskType = row.taskType; // 任务类型
    this.name = row.name; // 任务备注
    this.taskText = row.taskText; // 任务文字
    this.taskUrl = row.taskUrl; // 任务url
    this.groupIndex = row.groupIndex; // 群下标
    this.startAddNum = row.startAddNum; // 开始添加数 从该群的第几个好友开始加
    this.addNum = row.addNum; // 添加个数
    this.vInfo = row.vInfo; // 添加验证信息
    this.comment = row.comment; // 评论文字
    this.intervalTime = row.intervalTime; // 时间间隔
    this.releaseType = row.releaseType; // 发布类型
    this.taskTime = row.taskTime; // 任务时间
    this.taskTimeDate = row.taskTimeDate; // 任务时间区间
    this.phoneType = row.phoneType; // 设备类型
    this.selectGrouping = row.selectGrouping || []; // 选中分组
    this.selectPhone = row.selectPhone || []; // 选中设备
    this.sourceType = row.sourceType; // 素材类型
    this.selectImg = row.selectImg || []; // 选中图片
    this.selectVid = row.selectVid || []; // 选中视频
    this.friendType = row.friendType; // 好友类型

    console.log("this.selectPhone.length :" + this.selectPhone.length);

    // 初始化显示数据
    if (this.selectPhone.length == 1) {
      for (let index = 0; index < this.listPhone.length; index++) {
        let val: any = this.listPhone[index];
        if (val.IMEI == this.selectPhone[0]) {
          this.selectGroupOptions = val.mailList;
          this.listLabel = Object.keys(val.lableList);
          this.listFriend = val.friendList;
          console.log("this.listFriend");
        }
      }
    }
    console.log("this.selectLabel");
    this.selectLabel = row.selectLabel || []; // 选中标签
    this.selectFriend = row.selectFriend || []; // 选中好友
    this.selectGroup = row.selectGroup || []; // 选中群

    // 设备
    if (this.phoneType == "分组") {
      this.selePhoneText = "已选择分组:" + this.selectGrouping;
    } else {
      this.selePhoneText = "已选择:" + this.selectPhone.length + this.phoneType;
    }
    // 素材
    if (this.sourceType == "视频") {
      this.seleSourceText = "已选择视频:" + this.selectVid;
    } else {
      this.seleSourceText = "已选择:" + this.selectImg.length + this.sourceType;
    }
    //
    if (this.friendType == "标签") {
      this.selecFriendText = "已选择标签:" + this.selectLabel.length;
    } else {
      this.selecFriendText =
        "已选择:" + this.selectFriend.length + this.friendType;
    }
    this.dialogStatus = "update";
    this.dialogFormVisible = true;
    this.$nextTick(() => {
      (this.$refs.dataForm as Form).clearValidate();
    });
  }
}
</script>
