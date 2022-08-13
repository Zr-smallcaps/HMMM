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
        <el-table-column fixed="right" label="操作" width="200">
          <template>
            <el-button type="text" size="small"> 学科分类 </el-button>
            <el-button type="text" size="small"> 学科标签 </el-button>
            <el-button type="text" size="small"> 修改 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>
<script>
export default {
  name: "",
  data() {
    return {};
  },
  props: ["SubjectList"],
  created() {
    // this.SubjectDetail();
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>
<style lang="less" scoped></style>
