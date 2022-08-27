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
          syntax: {
            highlight: (text) => {
              return hljs.highlightAuto(text).value // 这里就是代码高亮需要配置的地方
            },
          },
        },
      },
    }
  },
  props: ['value'],
  components: { quillEditor },
  computed: {},
  created() {},
  mounted() {
    let content = '' // 请求后台返回的内容字符串
    this.str = this.escapeStringHTML(content)
  },
  watch: {
    value: {
      handler(va) {
        this.content = va
      },
    },
  },
  methods: {
    // 失去焦点事件
    onEditorBlur(quill) {
      //console.log('editor blur!', quill, html, text)
      //quill.pasteHTML(index, html, source)
      // console.log(html)
    },
    // 获得焦点事件
    onEditorFocus(quill) {
      console.log('editor focus!', quill)
    },
    // 准备富文本编辑器
    onEditorReady(quill) {
      console.log('editor ready!', quill)
    },
    // 内容改变事件
    onEditorChange({ quill, html, text }) {
      console.log('editor change!', quill, html, text)
      console.log(html)
      this.content = html
    },

    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, '<')
      str = str.replace(/&gt;/g, '>')
      return str
    },
  },
}
</script>
<style lang='less' scoped>
</style>