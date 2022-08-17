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
            @click.native="preview"
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

          <el-avatar class="item" size="small" icon="el-icon-check"></el-avatar>
        </template>
      </el-table-column>
    </el-table>
    <QuestionPreview
      :previewVisible.sync="previewVisible"
      :previewDetail="previewDetail"
    ></QuestionPreview>
  </div>
</template>
<script>
import QuestionPreview from "./questions-preview.vue";
import { detail } from "../../api/hmmm/questions";
import { status, difficulty, questionType } from "../../api/hmmm/constants.js";
import sgbutton from "./button.vue";
export default {
  name: "QuestionDetailTable",
  data() {
    return {
      previewVisible: false,
      previewDetail: {},
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
    async previewDetailFn(data) {
      this.previewVisible = true;
      const { data: previewDetail } = await detail({ id: data.id });
      this.previewDetail = previewDetail;
    },
    preview() {},
  },
  watch: {},
};
</script>
<style lang="less" scoped>
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
