<template>
  <div>
    <span>学科名称：</span>
    <el-input
      size="medium"
      width:100px
      v-model="keywords"
      placeholder="请输入内容"
    ></el-input>
    <el-button>清楚</el-button>
    <el-button type="primary">搜索</el-button>
    <el-button type="success" style="float: right">
      <i class="el-icon-edit"> 新增学科</i>
    </el-button>
  </div>
</template>
<script>
export default {
  name: "headerVue",
  data() {
    return {
      keywords: "",
    };
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {},
  watch: {},
};
</script>
<style lang="less" scoped>
.el-input {
  width: 250px;
  padding: 0 10px;
}
</style>
