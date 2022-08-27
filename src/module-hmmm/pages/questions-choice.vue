<template>
  <div class='QustionsChoiceContainer' v-cloak>
    <div class="tips-header">
      <span class="tips-text">说明：目前支持学科和关键字条件筛选</span>
      <el-button type="success" icon="el-icon-edit" size="small">新增试题</el-button>
    </div>
    <QuestionForm></QuestionForm>
    <QuestionTable></QuestionTable>

  </div>

</template>

<script>
import QuestionForm from '../components/questionForm.vue'
import QuestionTable from '../components/questionTable.vue'
export default {
  components: { QuestionForm, QuestionTable },

  data() {
    return {
      currentPage4: 4,
    }
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
    SearchQuestion(val) {
      
    },
  },
  watch: {},
}
</script>

<style scoped lang='less'>
[v-cloak] {
  display: none;
}
.QustionsChoiceContainer {
  overflow-y: auto;

  margin: 10px;
  background-color: #fff;
  width: 100%;
  height: 100%;
  padding: 20px;
  .tips-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .tips-text {
      font-size: 12px;
      color: pink;
    }
  }
}
</style>
