<template>
  <div>
    <div class="table-header">
      <i class="el-icon-info"></i>
      <span v-if="counts" class="text">数据一共{{ counts }}条</span>
    </div>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column
        v-for="item in tableListTitle"
        :key="item.id"
        :prop="item.prop"
        :label="item.label"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="caozuo" label="操作"></el-table-column>
      <el-table-column prop="caozuo" label="题目编号">
        <template v-slot="{ row }">
          <groupPreview :preMsg="row" />
        </template>
      </el-table-column>
    </el-table>
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
import groupPreview from "./groupPreview.vue";
import { randoms } from "../../api/hmmm/questions";
export default {
  data() {
    return {
      tableListTitle: [
        { prop: "id", label: "编号" },
        { prop: "questionType", label: "题型" },
        { prop: "addTime", label: "录入时间" },
        { prop: "totalSeconds", label: "答题时间(s)" },
        { prop: "accuracyRate", label: "正确率(%)" },
        { prop: "userName", label: "录入人" },
      ],
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      page: 1,
      pagesize: 10,
      counts: 0,
      currentPage: 1,
    };
  },
  async mounted() {
    await this.getGroupList();
    this.handleCurrentChange(1);
    this.handleSizeChange(3);
  },
  methods: {
    async getGroupList() {
      const { data } = await randoms({
        page: this.page,
        pagesize: this.pagesize,
      });
      console.log(data);
      this.counts = data.counts;
      data.items.forEach((item) => {
        if (item.questionType == 1) {
          item.questionType = "单选";
        } else if (item.questionType == 2) {
          item.questionType = "多选";
        } else if (item.questionType == 3) {
          item.questionType = "简答";
        }
      });
      this.tableData = data.items;
    },
    async search(msg) {
      const { data } = await randoms({
        keyword: msg,
      });
      this.counts = data.counts;
      data.items.forEach((item) => {
        if (item.questionType == 1) {
          item.questionType = "单选";
        } else if (item.questionType == 2) {
          item.questionType = "多选";
        } else if (item.questionType == 3) {
          item.questionType = "简答";
        }
      });
      this.tableData = data.items;
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getGroupList();
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
    handleSizeChange(val) {
      console.log(val);
      this.pagesize = val;
      this.getGroupList();
    },
  },
  components: {
    groupPreview,
  },
  props: {},
};
</script>
