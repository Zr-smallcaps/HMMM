<template>
  <div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout=" sizes, prev, pager, next, jumper"
      :total="totalList.counts"
      background
    >
    </el-pagination>
  </div>
</template>
<script>
export default {
  name: "Pagination",
  data() {
    return {
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
    };
  },
  props: ["totalList"],
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.$emit("Fen", val);
      console.log(`当前页: ${val}`);
    },
  },
  watch: {},
};
</script>
<style lang="less" scoped></style>
