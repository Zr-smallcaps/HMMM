<template>
  <div class="container">
    <el-card class="box-card">
      <!-- 头部 -->
      <headerVue />
      <!-- 警示框 -->
      <alertVue />
      <!-- subject 表单 -->
      <formSubject :SubjectList="SubjectList" />
      <!-- 分页 -->
      <Pagination :totalList="totalList" @Fen="Fenye" />
    </el-card>
  </div>
</template>

<script>
import { detail } from "../../api/hmmm/subjects";
import headerVue from "../components/headerVue.vue";
import alertVue from "../components/alertVue.vue";
import formSubject from "../components/formSubject.vue";
import Pagination from "../components/Pagination.vue";
export default {
  data() {
    return {
      keywords: "",
      totalList: [],
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
