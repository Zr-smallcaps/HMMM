<template>
  <div class="container">
    <el-dialog title :visible="visible" width="70%" @close="onClose">
      <video
        :src="videoURL"
        controls
        autoplay
        class="video"
        width="100%"
      ></video>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "VideoDialog",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      videoURL: "",
    };
  },
  created() {},
  methods: {
    playVideo(val) {
      this.videoURL = val.videoURL;
    },
    onClose() {
      this.$emit("update:visible", false);
      this.videoURL = "";
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
::v-deep .el-dialog__headerbtn {
  top: -85px;
  right: 50%;
  padding: 0;
  border: none;
  outline: 0;
  cursor: pointer;
  font-size: 45px;
  height: 80px;
  width: 80px;
  border-radius: 50%;
  transform: translateX(50%);
  background-color: rgba(107, 107, 107, 0.5);
}
::v-deep .el-dialog__header {
  background: transparent;
  height: 0;
  padding: 0;
}
::v-deep .el-dialog__body {
  background: transparent;
  height: 0;
  padding: 0;
}
</style>
