<template>
<<<<<<< HEAD
  <div class="container">学科管理</div>
</template>

<script>
export default {};
</script>

<style scoped lang="less"></style>
=======
  <div class="container">
    <el-card class="box-card">
      <!-- 头部 -->
      <headerVue @childKeywords="parentKeywords" @simpleSearch="simpleSearch" />
      <!-- 警示框 -->
      <alertVue />
      <!-- subject 表单 -->
      <formSubject :SubjectList="SubjectList"  />
      <!-- 分页 -->
      <Pagination :totalList="totalList" @Fen="Fenye" />
    </el-card>
  </div>
</template>

<script>
import { detail, simple, list, add } from "../../api/hmmm/subjects";
import headerVue from "../components/headerVue.vue";
import alertVue from "../components/alertVue.vue";
import formSubject from "../components/formSubject.vue";
import Pagination from "../components/Pagination.vue";
export default {
  data() {
    return {
      simpleSearchData: "",
      keywords: "",
      totalList: [], //分页
      SubjectList: [], //给子组件formsubject传
      SubjectData: {
        id: "",
        subjectName: "",
        creator: "",
        addDate: "",
        ifFontDisplay: "",
        twoLevelDirectory: "",
        tags: "",
        totals: "",
        page: 1,
      },
    };
  },
  components: {
    headerVue,
    alertVue,
    formSubject,
    Pagination,
  },
  created() {
    this.SubjectDetail();
    // this.simpleSearch();
  },
  methods: {
    //获取学科详情数据
    async SubjectDetail() {
      try {
        const res = await detail(this.SubjectData);
        console.log("学科详情数据", res);
        this.SubjectList = res.data.items;
        this.totalList = res.data;
      } catch (error) {
        console.log(error);
      }
    },
    // 分页跳转
    async Fenye(val) {
      console.log(val);
      this.SubjectData.page = val;
      this.SubjectDetail();
    },
    // 简单列表（搜索功能）
    async simpleSearch() {
      const res = await list({
        subjectName: this.getkeywords,
        page: 1,
        pagesize: 10,
      });
      console.log("关键字", this.getkeywords);
      console.log("简单列表信息", res);
      this.SubjectList = res.data.items;
    },
    parentKeywords(keywords) {
      this.getkeywords = keywords;
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
>>>>>>> 19485c56f8a62a0fd81157517383c1afd079e0d8
