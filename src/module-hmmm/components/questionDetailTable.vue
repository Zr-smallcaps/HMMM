<template>
  <div>
    <el-table :data="questionList" style="width: 100%">
      <el-table-column prop="number" label="试题编号" width="100">
      </el-table-column>
      <el-table-column prop="subject" label="学科" width="100">
      </el-table-column>
      <el-table-column prop="catalog" label="目录" width="100">
      </el-table-column>
      <el-table-column label="题型" prop="questionType" width="100" :formatter='formatterQuestionType'>

      </el-table-column>
      <el-table-column label="题干" width="100">
        <template slot-scope="{row}">
          <p v-html="row.question"></p>
        </template>
      </el-table-column>
      <el-table-column label="录入时间" width="150">
        <template slot-scope="{row}">
          {{row.addDate | fromatTime}}
        </template>

      </el-table-column>
      <el-table-column label="难度" width="100" prop="difficulty" :formatter='formatterDifficulty'>
      </el-table-column>
      <el-table-column prop="creator" label="录入人" width="100">
      </el-table-column>
      <el-table-column prop="chkState" label="审核状态" width="100">
      </el-table-column>
      <el-table-column prop="chkRemarks" label="审核意见" width="100">
      </el-table-column>
      <el-table-column prop="chkUser" label="审核人" width="100">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{row}">
          <el-link type="primary" style="margin-right:8px" @click="previewDetailFn(row)">预览</el-link>
          <el-link type="info" style="margin-right:8px">审核</el-link>
          <el-link type="info" style="margin-right:8px">修改</el-link>
          <el-link type="primary" style="margin-right:8px">下架</el-link>
          <el-link type="info" style="margin-right:8px">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <QuestionPreview :previewVisible.sync='previewVisible' :previewDetail='previewDetail'></QuestionPreview>
  </div>

</template>
<script>
import QuestionPreview from './questions-preview.vue'
import { detail } from '../../api/hmmm/questions'
import { status, difficulty, questionType } from '../../api/hmmm/constants.js'
export default {
  name: 'QuestionDetailTable',
  data() {
    return {
      previewVisible: false,
      previewDetail: {},
    }
  },
  props: {
    questionList: {
      type: Array,
    },
  },
  components: { QuestionPreview },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    formatterQuestionType(row, column, cellValue, index) {
      const current = questionType.find((item) => {
        return item.value === Number(cellValue)
      })
      // console.log(current)
      return current ? current.label : '未知'
    },
    formatterDifficulty(row, column, cellValue, index) {
      const current = difficulty.find((item) => {
        return item.value === Number(cellValue)
      })
      // console.log(current)
      return current ? current.label : '未知'
    },
    async previewDetailFn(data) {
      this.previewVisible = true
      const { data: previewDetail } = await detail({ id: data.id })
      this.previewDetail = previewDetail
    },
  },
  watch: {},
}
</script>
<style lang='less' scoped>
.el-table {
  width: 99.9% !important;
}
</style>