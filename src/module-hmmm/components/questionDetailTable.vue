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
      <el-table-column prop="chkState" label="审核状态" width="100" :formatter='formatterChkType'>
      </el-table-column>
      <el-table-column prop="chkRemarks" label="审核意见" width="100">
      </el-table-column>
      <el-table-column prop="chkUser" label="审核人" width="100">
      </el-table-column>
      <el-table-column prop="publishState" label="发布状态" width="100" :formatter='formatterpublishType'>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="{row}">
          <el-link type="primary" style="margin-right:8px" @click="previewDetailFn(row)">预览</el-link>
          <el-link :type="row.chkState>0? 'info':'primary'" style="margin-right:8px" @click="reviewFn(row)" :disabled='row.chkState>0'>审核</el-link>
          <el-link :type="row.chkState===0||row.publishState===0?'info':'primary'" style="margin-right:8px" :disabled='row.chkState===0||row.publishState===0'>修改</el-link>
          <el-link type="primary" style="margin-right:8px" @click="publishStateFn(row)">{{row.publishState ? '下架':'上架'}}</el-link>
          <el-link :type="row.chkState===0||row.publishState===0?'info':'primary'" style="margin-right:8px" @click="deleteFn(row)" :disabled='row.chkState===0||row.publishState===0'>删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <QuestionPreview :previewVisible.sync='previewVisible' :previewDetail='previewDetail'></QuestionPreview>
    <!-- 审核 -->
    <el-dialog title="题目审核" :visible="reviewVisible" width="400px" @close='reviewClose'>
      <el-radio-group v-model="radio">
        <el-radio :label="2">通过</el-radio>
        <el-radio :label="3">拒绝</el-radio>
      </el-radio-group>
      <el-input type="textarea" :rows="2" placeholder="请输入审核意见" v-model="chkRemarks" :style="{marginTop:'20px'}">
      </el-input>

      <span slot="footer" class="dialog-footer">
        <el-button @click="reviewVisible = false">取 消</el-button>
        <el-button type="primary" @click="reviewConfirm()">确 定</el-button>
      </span>
    </el-dialog>

  </div>

</template>
<script>
import QuestionPreview from './questions-preview.vue'
import {
  detail,
  choiceCheck,
  remove,
  choicePublish,
} from '../../api/hmmm/questions'
import {
  status,
  difficulty,
  questionType,
  publishType,
  chkType,
} from '../../api/hmmm/constants.js'
export default {
  name: 'QuestionDetailTable',
  data() {
    return {
      previewVisible: false,
      previewDetail: {},
      reviewVisible: false,
      chkRemarks: '',
      radio: '',
      reviewQuestion: {},
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
    formatterpublishType(row, column, cellValue, index) {
      const current = publishType.find((item) => {
        return item.value === Number(cellValue)
      })
      // console.log(current)
      return current ? current.label : '未知'
    },
    formatterChkType(row, column, cellValue, index) {
      const current = chkType.find((item) => {
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
    reviewClose() {
      this.reviewVisible = false
    },
    reviewFn(row) {
      if (row.chkState < 1) {
        // 此状态 是已审核
        this.reviewVisible = true
        this.reviewQuestion = row
      }
    },
    async reviewConfirm() {
      this.reviewVisible = false
      try {
        await choiceCheck({
          id: this.reviewQuestion.id,
          chkState: this.radio,
          chkRemarks: this.chkRemarks,
        })
        this.$message.success('审核成功')
        this.$emit('handleClick')
      } catch (error) {
        console.log(error)
        this.$message.error('审核失败,请填写完信息')
      }
    },
    deleteFn(row) {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await remove(row)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.$emit('handleClick')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    publishStateFn(row) {
      this.$confirm('您确认上架这道题目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await choicePublish(row)
          this.$emit('handleClick')
          this.$message({
            type: 'success',
            message: row.publishState ? '下架成功!' : '上架成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: row.publishState ? '已取消下架' : '已取消上架',
          })
        })
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