<template>
  <div class="QustionsChoiceContainer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <el-form label-width='100px'>
        <el-form-item label="学科:">
          <el-select v-model="form.subjectID" placeholder="请选择活动区域" @change="changeSubject" style="width:400px">
            <el-option v-for="item in subjectsList" :key="item.value" :label="item.label" :value="item.value"></el-option>

          </el-select>
        </el-form-item>
        <el-form-item label="目录:">
          <el-select v-model="form.catalogID" placeholder="请选择" style="width:400px">
            <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业:">
          <el-select v-model="form.tags" placeholder="请选择" style="width:400px">
            <el-option v-for="item in tagsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市:">
          <el-select v-model="form.province" placeholder="请选择" @keyup.enter="handleFilter" @change="handleProvince" style="width:200px">
            <el-option v-for="item in citySelect.province" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.city" @keyup.enter="handleFilter" filterable placeholder="请选择" style="width:200px">
            <el-option v-for="item in citySelect.city" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="方向:">
          <el-select v-model="form.direction" placeholder="请选择" style="width:400px">
            <el-option v-for="item in direction" :key="item.value" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题型:">
          <el-radio-group v-model="form.isChoice" style="width:400px">
            <el-radio v-for="item in questionType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="难度:">
          <el-radio-group v-model="form.difficulty">
            <el-radio v-for="item in difficulty" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="题干:" class="QuillEditor">
          <QuillEditor></QuillEditor>
        </el-form-item>

        <el-form-item label="选项:" style="margin-top: 80px">
          <el-radio-group v-model="radio">
            <div class="uploadImage">
              <el-radio :label="3">备选项:<el-input v-model="input" placeholder="请输入内容"></el-input>
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                  <div class="el-upload__text" slot="trigger">上传图片</div>
                  <i class="el-icon-circle-close"></i>
                </el-upload>
              </el-radio>
            </div>
            <div class="uploadImage">
              <el-radio :label="3">备选项:<el-input v-model="input" placeholder="请输入内容"></el-input>
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                  <div class="el-upload__text" slot="trigger">上传图片</div>
                  <i class="el-icon-circle-close"></i>
                </el-upload>
              </el-radio>
            </div>
            <div class="uploadImage">
              <el-radio :label="3">备选项:<el-input v-model="input" placeholder="请输入内容"></el-input>
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                  <div class="el-upload__text" slot="trigger">上传图片</div>
                  <i class="el-icon-circle-close"></i>
                </el-upload>
              </el-radio>
            </div>
            <div class="uploadImage">
              <el-radio :label="3">备选项:<el-input v-model="input" placeholder="请输入内容"></el-input>
                <el-upload action="https://jsonplaceholder.typicode.com/posts/" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
                  <div class="el-upload__text" slot="trigger">上传图片</div>
                  <i class="el-icon-circle-close"></i>
                </el-upload>
              </el-radio>
            </div>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>

</template>

<script>
import { provinces, citys } from '@/api/hmmm/citys'
import {
  status,
  difficulty,
  questionType,
  direction,
} from '@/api/hmmm/constants.js'
import { simple as directorysSimple } from '../../api/hmmm/directorys'
import { simple as subjectsSimple } from '../../api/hmmm/subjects'
import { simple as tagsSimple } from '../../api/hmmm/tags'
import QuillEditor from '../components/quilEditor.vue'
export default {
  data() {
    return {
      status,
      difficulty,
      questionType,
      direction,
      form: {
        addDate: '',
        answer: '',
        catalogID: '',
        chkDate: '',
        chkRemarks: '',
        chkState: '',
        chkUserID: '',
        city: '',
        creatorID: '',
        difficulty: '',
        direction: '',
        directoryName: '',
        enterpriseID: '',
        id: '',
        isChoice: '',
        options: [],
        province: '',
        publishDate: '',
        publishState: '',
        question: '',
        questionType: '',
        remarks: '',
        subjectID: '',
        subjectName: '',
        tags: '',
        videoURL: '',
      },
      citySelect: {
        province: [],
        city: [],
      },
      subjectsList: [],
      catalogList: [],
      tagsList: [],
    }
  },
  components: {
    QuillEditor,
  },
  created() {
    this.getSubjectsSimple()
    this.getCityData()
  },
  methods: {
    // 获取学科
    async getSubjectsSimple() {
      const { data } = await subjectsSimple()
      this.subjectsList = data
    },
    async changeSubject(id) {
      const { data: catalog } = await directorysSimple({
        subjectID: id,
      })
      this.catalogList = catalog
      const { data: tags } = await tagsSimple({
        subjectID: id,
      })
      this.tagsList = tags
    },

    handleFilter() {},
    // 获取省
    getCityData() {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    handleProvince(e) {
      this.citySelect.city = citys(e)
    },
    onSubmit() {
      console.log('submit!')
    },
    // 失去焦点事件
    onEditorBlur(quill) {
      console.log('editor blur!', quill)
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
      this.content = html
    },
  },
}
</script>

<style lang='less' >
.uploadImage {
  .el-radio {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .el-radio__label {
    display: flex;
    justify-content: center;
    align-items: center;

    .avatar-uploader i {
      position: absolute;
      right: 0;
      top: 0;
      -webkit-transform: translate(50%, -50%);
      transform: translate(50%, -50%);
      background: #fff;
      font-size: 18px;
      color: #999;
    }
  }
}
.el-upload--picture-card {
  height: 60px;
  width: 100px;
  line-height: 60px;
  margin-left: 5px;
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    width: 100px;
    height: 60px;
    line-height: 60px;
  }
}

.QustionsChoiceContainer {
  overflow-y: auto;

  margin: 20px;
  background-color: #fff;
  width: 100%;
  height: 100%;

  .ql-container {
    height: 200px !important;
  }
  .tips-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    .tips-text {
      font-size: 12px;
      color: pink;
    }
    .text {
      font-size: 14px;
    }

    .item {
      margin-bottom: 18px;
    }

    .clearfix:before,
    .clearfix:after {
      display: table;
      content: '';
    }
    .clearfix:after {
      clear: both;
    }

    .box-card {
      width: 100%;
    }
  }
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='10px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='10px']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='12px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='12px']::before {
  content: '12px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='14px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='14px']::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='16px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='16px']::before {
  content: '16px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='18px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='18px']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='20px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='20px']::before {
  content: '20px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='22px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='22px']::before {
  content: '22px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='24px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='24px']::before {
  content: '24px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='26px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='26px']::before {
  content: '26px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='28px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='28px']::before {
  content: '28px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='30px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='30px']::before {
  content: '30px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='32px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='32px']::before {
  content: '32px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='36px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='36px']::before {
  content: '36px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='38px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='38px']::before {
  content: '38px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='40px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='40px']::before {
  content: '40px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='45px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='45px']::before {
  content: '45px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='50px']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='50px']::before {
  content: '50px';
}
/**
设置默认字体显示
设置默认字体颜色
**/
.ql-container {
  font-size: 16px;
  color: black;
}
.btn-onsubmit {
  margin-top: 50px;
  text-align: center;
}
.btn-onsubmit .el-button {
  width: 30%;
}
.editor {
  line-height: normal !important;
  width: 930px;
  margin: 0 auto;
}
.ql-container {
  height: 400px !important;
}
.ql-snow .ql-tooltip[data-mode='link']::before {
  content: '请输入链接地址:';
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: '保存';
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: '请输入视频地址:';
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: '文本';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: '标题1';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: '标题2';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: '标题3';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: '标题4';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: '标题5';
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: '标题6';
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: '标准字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: '衬线字体';
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: '等宽字体';
}
</style>
