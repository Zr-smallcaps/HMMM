<template>
  <div>
    <el-button round class="btn" :type="type" icon="el-icon-view"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["type"],
  mounted() {
    console.log(this.type);
  },

  methods: {},
};
</script>

<style scoped lang="scss">
.btn {
  position: relative;
  border-radius: 50%;
  border: none;
  width: 36px;
  height: 36px;
  ::v-deep .el-icon-view {
    position: absolute;
    left: 32%;
    top: 12px;
  }
}
</style>
