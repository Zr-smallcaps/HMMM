<template>
  <div class="container">
    <el-dialog
      @close="onClose"
      :title="dialogTitle"
      :visible="visible"
      width="800px"
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="文章标题：" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入文章标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="文章内容：" prop="articleBody">
          <quill-editor
            ref="QuillEditor"
            v-model="formData.articleBody"
            :options="editorOption"
            class="editor"
          >
          </quill-editor>
        </el-form-item>
        <el-form-item label="视频地址：" prop="videoURL">
          <el-input
            v-model="formData.videoURL"
            placeholder="请输入视频地址"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="onClose">取 消</el-button>
        <el-button type="primary" @click.native="onSave">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import hljs from "highlight.js";
import "highlight.js/styles/monokai-sublime.css";

import { add, update } from "@/api/hmmm/articles";

// 工具栏配置项
const toolbarOptions = [
  // 加粗 斜体 下划线 删除线 -----['bold', 'italic', 'underline', 'strike']
  ["bold", "italic", "underline", "strike"],
  // 有序、无序列表-----[{ list: 'ordered' }, { list: 'bullet' }]
  [{ list: "ordered" }, { list: "bullet" }],
  // 引用、代码块、链接、图片、视频-----['blockquote', 'code-block'，'link', 'image', 'video']
  ["blockquote", "code-block", "image", "link"],
];
export default {
  name: "LocalQuillEditor",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      editorOption: {
        modules: {
          toolbar: toolbarOptions,
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value; // 这里就是代码高亮需要配置的地方
            },
          },
        },
        placeholder: "",
      },
      formData: {
        title: "",
        articleBody: "",
        videoURL: null,
      },
      formRules: {
        title: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        articleBody: [
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
      },
    };
  },
  created() {},
  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
      this.formData = {
        title: "",
        articleBody: "",
        videoURL: "",
      };
      this.$emit("cancel");
    },
    async onSave() {
      await this.$refs.form.validate();
      if (this.formData.id) {
        await update(this.formData);
        this.$message.success("修改成功");
        this.onClose();
        this.$emit("add-success");
      } else {
        await add(this.formData);
        this.$message.success("新增成功");
        this.onClose();
        this.$emit("add-success");
      }
    },
    getIptValue(val) {
      this.formData = val;
      console.log(this.formData);
    },
  },
  computed: {
    dialogTitle() {
      return this.formData.id ? "修改文章" : "新增文章";
    },
  },
  components: {
    quillEditor,
  },
};
</script>
<style lang="less" scoped>
/deep/.ql-toolbar.ql-snow {
  padding: 0 8px;
}

/deep/.ql-editor {
  height: 200px;
}
</style>
