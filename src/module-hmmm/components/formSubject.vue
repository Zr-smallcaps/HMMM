<template>
  <div>
    <template>
      <el-table :data="SubjectList" style="width: 100%">
        <el-table-column type="index" width="100"> </el-table-column>
        <el-table-column prop="subjectName" label="学科名称" width="100">
        </el-table-column>
        <el-table-column prop="username" label="创建者" width="100">
        </el-table-column>
        <el-table-column prop="addDate" label="创建日期" width="300">
        </el-table-column>
        <el-table-column prop="isFrontDisplay" label="前台是否显示">
        </el-table-column>
        <el-table-column prop="twoLevelDirectory" label="二级目录">
        </el-table-column>
        <el-table-column prop="tags" label="标签"> </el-table-column>
        <el-table-column prop="totals" label="题目数量"> </el-table-column>
        <el-table-column fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-button type="text" size="small"> 学科分类 </el-button>
            <el-button type="text" size="small"> 学科标签 </el-button>
            <el-button
              type="text"
              size="small"
              @click="ModifySubject(scope.row)"
            >
              修改
            </el-button>
            <el-button type="text" size="small" @click="DelData(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 修改弹窗 -->
    <addSubject
      :addSubjectVisible.sync="addSubjectVisible"
      :ModifySubjectData="ModifySubjectData"
    />
    <!-- 删除弹框 -->
    <el-dialog title="宝贝" :visible.sync="DeleteVisible" width="40%">
      <span>确定要删除这么可爱的数据嘛~</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DeleteVisible = false">取 消</el-button>
        <el-button type="primary" @click="OnSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { remove } from "../../api/hmmm/subjects";
import addSubject from "./addSubject.vue";
export default {
  name: "",
  data() {
    return {
      DeleteVisible: false,
      DeleteData: "",
      ModifySubjectData: {},
      addSubjectVisible: false,
    };
  },
  props: ["SubjectList"],
  created() {
    // this.SubjectDetail();
  },
  components: {
    addSubject,
  },
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {
    async OnSave() {
      this.DeleteVisible = false;
      await remove({ id: this.DeleteData.id });
      this.$message.success("爱你哦~宝贝~");
    },
    //删除按钮
    DelData(info) {
      this.DeleteVisible = true;
      console.log("删除信息", info);
      this.DeleteData = info;
    },
    // 修改按钮
    ModifySubject(info) {
      console.log(info);
      this.addSubjectVisible = true;
      this.ModifySubjectData = info;
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped></style>
