<template>
  <div class="edit_container">
    <quill-editor style="height:200px" v-model="content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @change="onEditorChange($event)">
    </quill-editor>
  </div>

</template>
<script>
import { quillEditor } from 'vue-quill-editor' //调用编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  name: 'QuillEditor',
  data() {
    return {
      content: '',
      editorOption: {
        placeholder: '请在这里输入',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], //加粗，斜体，下划线，删除线
            [{ list: 'ordered' }, { list: 'bullet' }], //列表
            ['blockquote', 'code-block'], //引用，代码块
            ['image', 'link'], //上传图片、上传视频
          ],
        },
      },
    }
  },
  components: { quillEditor },
  computed: {
    editor() {
      return this.$refs.myQuillEditor.quill
    },
  },
  created() {},
  mounted() {
    let content = '' // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content)
  },
  methods: {
    onEditorReady(editor) {
      // 准备编辑器
    },
    onEditorBlur() {}, // 失去焦点事件
    onEditorFocus() {}, // 获得焦点事件
    onEditorChange() {}, // 内容改变事件
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    },
  },
  watch: {},
}
</script>
<style lang='less' scoped>
</style>