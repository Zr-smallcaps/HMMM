<template>
  <div>
    <div class="table-header">
      <i class="el-icon-info"></i>
      <span class="text">数据一共{{ counts }}条</span>
    </div>

    <QuestionDetailTable :questionList="questionList"></QuestionDetailTable>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        background
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 4, 5, 6]"
        :page-size="pagesize"
        layout="prev, pager, next,sizes, jumper"
        :total="counts"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { choice } from "../../api/hmmm/questions";
import QuestionDetailTable from "./questionDetailTable.vue";
export default {
  name: "QuestionTable",
  data() {
    return {
      activeName: "first",

      page: 1,
      pagesize: 5,
      chkState: "",
      questionList: [],
      counts: 10,
      allPages: "",
      currentPage: 1,
    };
  },
  components: { QuestionDetailTable },
  computed: {},
  created() {
    this.getFirstquestionList();
    // 自定义事件
    this.$EventBus.$on("sendTbaleList", (data) => {
      this.questionList = data.items;
      this.counts = data.counts;
    });
  },
  mounted() {},
  methods: {
    // 此时是全部的状态
    async getFirstquestionList() {
      const { data } = await choice({
        page: this.page,
        pagesize: this.pagesize,
      });
      console.log(data);
      this.questionList = data.items;
      this.counts = data.counts;
    },
    // async getOthersquestionList(chkState) {
    //   const { data } = await choice({
    //     page: this.page,
    //     pagesize: this.pagesize,
    //     chkState: chkState,
    //   });
    //   //console.log(data)
    //   this.questionList = data.items;
    //   this.counts = data.counts;
    // },
    // async handleClick(tab) {
    //   console.log(this.activeName);
    //   if (tab._uid === 252) {
    //     this.currentIndex = "first";
    //     // 此时是全部状态
    //     this.getFirstquestionList();
    //   }
    //   if (tab._uid === 277) {
    //     // 此时是切换到了待审核状态
    //     this.getOthersquestionList(0);
    //   }
    //   if (tab._uid === 302) {
    //     this.getOthersquestionList(1);
    //   }
    //   if (tab._uid === 327) {
    //     this.getOthersquestionList(2);
    //   }
    // },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.getFirstquestionList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.page = val;
      this.getFirstquestionList();
      //   if (this.activeName === "first") {
      //     this.page = val;
      //     this.getFirstquestionList();
      //   }
      //   if (this.activeName === "second") {
      //     this.page = val;
      //     this.getOthersquestionList(0);
      //   }
      //   if (this.activeName === "third") {
      //     this.page = val;
      //     this.getOthersquestionList(1);
      //   }
      //   if (this.activeName === "fourth") {
      //     this.page = val;
      //     this.getOthersquestionList(2);
      //   }
      //   this.page = 1;
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped>
.table-header {
  background-color: #f4f4f5;
  color: #909399;

  padding: 8px 16px;
  font-size: 12px;
  height: 30px;
  span {
    margin-left: 10px;
  }
}
</style>
