<template>
  <div>
    <span>学科名称：</span>
    <el-input
      size="medium"
      width:100px
      v-model="keywords"
      placeholder="请输入内容"
    ></el-input>
    <el-button @click="clearFn">清除</el-button>
    <el-button type="primary" @click="SearchFn">搜索</el-button>
    <el-button type="success" style="float: right">
      <i class="el-icon-edit" @click="addSubject"> 新增学科</i>
    </el-button>
    <addSubject
      :addSubjectVisible.sync="addSubjectVisible"
      @ChildAddkeywords="ParentAddkeywords"
      @addSubjectList="addSubjectList"
    />
  </div>
</template>
<script>
import { add } from "../../api/hmmm/subjects";
import addSubject from "./addSubject.vue";
export default {
  name: "headerVue",
  data() {
    return {
      keywords: "",
      addSubjectVisible: false,
    };
  },
  components: {
    addSubject,
  },
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {
    // 清除按钮
    clearFn() {
      this.keywords = "";
    },
    SearchFn() {
      this.$emit("childKeywords", this.keywords);
      this.$emit("simpleSearch");
    },
    addSubject() {
      this.addSubjectVisible = true;
    },
    //添加学科
    async addSubjectList() {
      console.log(this.getaddkeywords);
      const res = await add({
        subjectName: this.getaddkeywords,
        isFrontDisplay: 1,
      });
      console.log("添加的学科数据", res);
    },

    ParentAddkeywords(addkeywords) {
      this.getaddkeywords = addkeywords;
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.el-input {
  width: 250px;
  padding: 0 10px;
}
</style>
