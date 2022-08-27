<template>
  <div class="container">
    <el-card class="box-card">
      <!-- header -->
      <div>
        <span>目录名称：</span>
        <el-input
          size="medium"
          width:100px
          v-model="Searchkeywords"
          placeholder="请输入内容"
        ></el-input>
        <span>状态：</span>

        <el-select v-model="value" clearable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <span> </span>
        <el-button class="clearBtn" @click="clearFn">清除</el-button>
        <el-button type="primary" @click="SearchFn">搜索</el-button>

        <el-button type="success" style="float: right" @click="addSubject">
          <i class="el-icon-edit"> 新增学科</i>
        </el-button>
        <el-button
          style="float: right"
          type="primary"
          @click="BackSubject"
          v-if="id"
        >
          ⬅返回学科</el-button
        >
      </div>
      <!-- alert -->
      <div style="padding: 20px">
        <el-alert
          :closable="false"
          title="宇哥真的真的帅！"
          type="info"
          show-icon
        >
        </el-alert>
      </div>
      <!-- form -->
      <el-table :data="TableList.items" style="width: 100%">
        <el-table-column type="index" width="100"> </el-table-column>
        <el-table-column prop="subjectName" label="所属学科" width="100">
        </el-table-column>
        <el-table-column prop="directoryName" label="目录名称" width="100">
        </el-table-column>
        <el-table-column prop="creatorID" label="创建者" width="100">
        </el-table-column>
        <el-table-column prop="addDate" label="创建日期"> </el-table-column>
        <el-table-column prop="totals" label="面试题数量"> </el-table-column>
        <el-table-column prop="state" label="状态">
          <span>{{ state === 1 ? "已启用" : "已禁用" }}</span>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="disable(scope.row)">
              <span v-if="scope.row.state == 0">禁用</span>
              <span v-else>启用</span>
            </el-button>

            <el-button
              v-if="scope.row.status != 'deleted'"
              type="text"
              size="small"
              :disabled="scope.row.state === 1"
              @click="ModifySubject(scope.row)"
            >
              修改
            </el-button>
            <el-button
              v-if="scope.row.status != 'deleted'"
              :disabled="scope.row.state === 1"
              type="text"
              size="small"
              @click="DelData(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- paginationg -->

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage4"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="100"
        layout=" sizes, prev, pager, next, jumper"
        :total="totalList.counts"
        background
      >
      </el-pagination>
    </el-card>
    <!-- 新增弹窗 -->
    <el-dialog title="收货地址" :visible.sync="addFormVisible">
      <el-form :model="form" style="witdh: 90px">
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select
            v-model="SimpleListData.value"
            placeholder="请选择活动区域"
          >
            <el-option
              v-for="(item, index) in SimpleListData"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" :label-width="formLabelWidth">
          <el-input v-model="keywords"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="OnSave">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改弹框 -->
    <el-dialog title="收货地址" :visible.sync="modifyFormVisible">
      <el-form :model="form">
        <el-form-item label="所属学科" :label-width="formLabelWidth">
          <el-select v-model="SimpleListData.value">
            <el-option
              v-for="(item, index) in SimpleListData"
              :key="index"
              :label="item.label"
              :value="ModifySubjectData.subjectName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目录名称" :label-width="formLabelWidth">
          <el-input
            v-model="ModifySubjectData.directoryName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modifyFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="modifyFn">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog title="宝贝" :visible.sync="DeleteVisible" width="30%">
      <span>您确定要删除这么可爱的数据嘛~</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="DeleteFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { simple } from "../../api/hmmm/directorys";
import { list, add, changeState, remove } from "../../api/hmmm/directorys";
export default {
  data() {
    return {
      id: this.$route.query.id,
      DeleteData: "",
      DeleteVisible: false,
      ModifySubjectData: {},
      modifyFormVisible: false,
      state: "",
      Searchkeywords: "",
      SimpleListData: "",
      getSimpleListData: {
        subjectName: "",
      },
      addFormVisible: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
      },
      formLabelWidth: "120px",
      //
      totalList: "",
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      TableList: [],

      keywords: "",
      // 下拉框
      options: [
        {
          value: "选项1",
          label: "启用",
        },
        {
          value: "选项2",
          label: "禁用",
        },
      ],
      value: "",
    };
  },
  created() {
    this.getSimpleList();
    this.getTableList();
  },
  computed: {
    status() {
      return status; //计算属性可以动态更改
    },
  },
  methods: {
    //返回学科按钮
    BackSubject() {
      this.$router.push("list");
    },
    // 删除按钮确定
    async DeleteFn() {
      this.DeleteVisible = false;
      const res = await remove({
        id: this.DeleteData.id,
      });
      console.log("删除成功", res);
      this.$message.success("删除成功");
    },
    // 删除按钮
    DelData(Dinfo) {
      console.log("删除信息", Dinfo);
      this.DeleteData = Dinfo;
      this.DeleteVisible = true;
    },
    // 修改确定按钮
    modifyFn() {
      this.modifyFormVisible = false;
      this.$message.success("修改成功");
    },
    // 修改按钮
    ModifySubject(info) {
      console.log(info);
      this.ModifySubjectData = info;
      this.modifyFormVisible = true;
    },
    //禁用按钮
    async disable(val) {
      console.log(val);
      try {
        await changeState({
          id: val.id,
          state: val.state == 1 ? 0 : 1,
        });
        this.getTableList();
        this.$message.success("哎呦，不错喔");
      } catch (error) {
        this.$message.erro("哎呦，不行喔");
      }
    },
    // 搜索按钮
    SearchFn() {
      console.log("搜索");
      this.Searchlist();
    },
    // 搜索功能
    async Searchlist() {
      const res = await list({
        directoryName: this.Searchkeywords,
        page: 1,
        pagesize: 10,
        state: 1,
      });
      console.log("搜索数据据", res);
      this.TableList = res.data;
    },
    // 目录添加
    async addList() {
      const res = await add({
        directoryName: this.keywords,
        subjectID: 1,
      });
      console.log("目录添加数据", res);
      this.getTableList();
    },
    //添加弹窗确定按钮
    OnSave() {
      this.addFormVisible = false;
      this.addList();
    },
    addSubject() {
      this.addFormVisible = true;
    },
    // 分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    //分页跳转
    async handleCurrentChange(val) {
      console.log(val);
      const { data } = await list({
        page: val,
        pagesize: 10,
      });
      // console.log("数据", res);
      this.TableList = data;
      // this.totalList = res.data;
    },
    // 获取目录列表信息
    async getTableList() {
      const res = await list({
        page: 1,
        pagesize: 10,
        subjectID	: this.id,
      });
      //  console.log("目录列表数据", res);
      this.TableList = res.data;
      this.totalList = res.data;
    },
    // 清除按钮
    clearFn() {
      this.value = "";
    },

    // 学科简单列表
    async getSimpleList() {
      try {
        const res = await simple(this.getSimpleListData);
        console.log("学科简单列表数据", res);
        this.SimpleListData = res.data;
      } catch (error) {
        console.log("宇哥大事不好啦！");
      }
    },
  },
};
</script>

<style scoped lang="less">
.el-input {
  width: 250px;
  padding: 0 10px;
}
.box-card {
  width: 100%;
  height: 100%;
  padding: 20px 20px;
}
</style>
