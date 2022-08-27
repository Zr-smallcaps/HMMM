<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-size: solid">关键字</span>
        <el-input
          v-model="msg"
          style="width: 200px"
          placeholder="根据编号搜索"
        ></el-input>
        <el-button
          style="float: right"
          type="primary"
          size="mini"
          @click="search"
          >搜索</el-button
        >
        <el-button
          style="float: right; margin-right: 5px"
          size="mini"
          @click="clear"
          >清除</el-button
        >
      </div>
      <div>
        <groupList ref="groupList"></groupList>
      </div>
    </el-card>
  </div>
</template>

<script>
import groupList from "../low/groupList.vue";
export default {
  data() {
    return {
      msg: "",
    };
  },
  components: {
    groupList,
  },
  methods: {
    search() {
      this.$refs.groupList.search(this.msg);
    },
    clear() {
      this.msg = "";
      this.$refs.groupList.getGroupList();
    },
  },
};
</script>

<style scoped lang="scss">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}
::v-deep .el-input--medium .el-input__inner {
  height: 30px;
  margin-left: 8px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
</style>
