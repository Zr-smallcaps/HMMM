<template>
  <div class="container">
    <el-dialog
      @close="onClose"
      title="预览文章"
      :visible="visible"
      width="800px"
    >
      <div class="title">
        <h2 v-html="PreviewData.title"></h2>
        <div>
          <span>{{ PreviewData.createTime }}</span
          ><span>{{ PreviewData.username }}</span
          ><span class="el-icon-view"></span
          ><span>{{ PreviewData.visits }}</span>
        </div>
      </div>

      <div class="content">
        <div v-html="PreviewData.articleBody"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from "dayjs";
export default {
  name: "ArticlesPreview",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      PreviewData: {},
    };
  },
  created() {},
  methods: {
    getPreviewData(val) {
      this.PreviewData = val;
      this.PreviewData.createTime = dayjs(this.PreviewData.createTime).format(
        "YYYY.MM.DD HH:mm:ss"
      );
      console.log(this.PreviewData);
    },
    onClose() {
      this.$emit("update:visible", false)
    },
  },
  components: {},
};
</script>
<style lang="less" scoped>
.title {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 10px;

  h2 {
    padding: 0;
    margin: 0;
  }

  span {
    margin-left: 10px;
    margin-top: 10px;
  }
}

.content {
  background: #f5f5f5;
  padding: 10px;
}
</style>
