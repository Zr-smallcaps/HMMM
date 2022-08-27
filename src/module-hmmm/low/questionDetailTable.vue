<template>
  <div>
    <el-table :data="questionList" style="width: 100%">
      <el-table-column prop="number" label="试题编号" width="100">
      </el-table-column>
      <el-table-column prop="subject" label="学科" width="100">
      </el-table-column>
      <el-table-column prop="catalog" label="目录" width="100">
      </el-table-column>
      <el-table-column
        label="题型"
        prop="questionType"
        width="100"
        :formatter="formatterQuestionType"
      >
      </el-table-column>
      <el-table-column label="题干" width="100">
        <template slot-scope="{ row }">
          <p v-html="row.question"></p>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="150">
        <template slot-scope="{ row }">
          {{ row.addDate | fromatTime }}
        </template>
      </el-table-column>
      <el-table-column
        label="难度"
        width="100"
        prop="difficulty"
        :formatter="formatterDifficulty"
      >
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="100">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{ row }">
          <el-avatar
            @click.native="preview(row)"
            class="item"
            size="small"
            icon="el-icon-view"
          ></el-avatar>
          <el-avatar class="item" size="small" icon="el-icon-edit"></el-avatar>

          <el-avatar
            class="item"
            size="small"
            icon="el-icon-delete"
          ></el-avatar>

          <el-avatar
            class="item"
            size="small"
            icon="el-icon-check"
            @click.native="choicePublish(row)"
            >上下架</el-avatar
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>确定要加入精选吗</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="choicePublishDetail">确 定</el-button>
      </span>
    </el-dialog>
    <QuestionPreview
      :previewVisible.sync="previewVisible"
      :previewDetail="previewDetail"
    ></QuestionPreview>
  </div>
</template>
<script>
import QuestionPreview from "./questions-preview.vue";
import { detail, choicePublish } from "../../api/hmmm/questions";
import { status, difficulty, questionType } from "../../api/hmmm/constants.js";
import sgbutton from "./button.vue";
export default {
  name: "QuestionDetailTable",
  data() {
    return {
      previewVisible: false,
      previewDetail: {},
      dialogVisible: false,
      currentId: 0,
    };
  },
  props: {
    questionList: {
      type: Array,
    },
  },
  components: { QuestionPreview, sgbutton },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    formatterQuestionType(row, column, cellValue, index) {
      const current = questionType.find((item) => {
        return item.value === Number(cellValue);
      });
      // console.log(current)
      return current ? current.label : "未知";
    },
    formatterDifficulty(row, column, cellValue, index) {
      const current = difficulty.find((item) => {
        return item.value === Number(cellValue);
      });
      // console.log(current)
      return current ? current.label : "未知";
    },

    async preview(res) {
      this.previewVisible = true;
      const { data: previewDetail } = await detail({ id: res.id });
      this.previewDetail = previewDetail;
    },
    async choicePublish(res) {
      this.dialogVisible = true;
      this.currentId = res.id;
    },
    async choicePublishDetail(res) {
      const data = await choicePublish({ id: this.currentId, publishState: 1 });
      if (data.status === 200) {
        this.dialogVisible = false;
        return this.$message.success("加入精选成功");
      } else {
        this.dialogVisible = false;
        return this.$message.error("失败，请重试");
      }
    },
  },
  watch: {},
};
</script>
<style lang="scss" scoped>
.el-table {
  width: 99.9% !important;
}
.el-avatar--circle {
  margin-left: 8px;
  position: relative;
  width: 32px !important;
  height: 32px !important;
  ::v-deep .item {
    position: absolute;
    top: 32%;
    left: 31%;
    font-size: 12px;
    color: #fff;
  }
}
</style>
