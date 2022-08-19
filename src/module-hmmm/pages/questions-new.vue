<template>
  <div class="QustionsChoiceContainer">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>试题录入</span>
      </div>
      <el-form label-width='100px' :model='form' ref="ruleForm" :rules="rules">
        <el-form-item label="学科:" prop="subjectID">
          <el-select v-model="form.subjectID" placeholder="请选择活动区域" @change="changeSubject" style="width:400px">
            <el-option v-for="item in subjectsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="目录:" prop="catalogID">
          <el-select v-model="form.catalogID" placeholder="请选择" style="width:400px">
            <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业:" prop="enterpriseID">
          <el-select v-model="form.enterpriseID" placeholder="请选择" style="width:400px">
            <el-option v-for="item in enterpriseList" :key="item.id" :label="item.shortName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="城市:" prop="province">
          <el-select v-model="form.province" placeholder="请选择" @keyup.enter="handleFilter" @change="handleProvince" style="width:200px">
            <el-option v-for="item in citySelect.province" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.city" @keyup.enter="handleFilter" filterable placeholder="请选择" style="width:200px">
            <el-option v-for="item in citySelect.city" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="方向:" prop="direction">
          <el-select v-model="form.direction" placeholder="请选择" style="width:400px">
            <el-option v-for="item in direction" :key="item.value" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="题型:" prop="questionType">
          <el-radio-group v-model="form.questionType" style="width:400px">
            <el-radio v-for="item in questionType" :key="item.value" :label="item.value" :value="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="难度:" prop="difficulty">
          <el-radio-group v-model="form.difficulty">
            <el-radio v-for="item in difficulty" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="题干:" class="QuillEditor" prop='question'>
          <QuillEditor ref="question" v-model="form.question"></QuillEditor>
        </el-form-item>

        <el-form-item label="选项:" style="margin-top: 80px">
          <!-- 单选框 -->
          <el-radio-group v-model="code" v-if="form.questionType===1" @change="radioChange">
            <div class="uploadImage" v-for="(item, index) in form.options" :key="index">
              <el-radio :label="item.code">{{item.code}}:</el-radio>
              <el-input v-model="item.title" placeholder="请输入内容" style="width: 270px; padding: 0 15px; margin-left: -40px"></el-input>
              <el-upload class="avatar-uploader" action="#" :http-request="httpRequest" list-type="picture-card" :show-file-list="false" @click.native="clickUpLoad(index, $event)" :before-upload="beforeAvatarUpload">
                <img v-if="item.img" :src="item.img" class="avatar" />
                <p class="el-upload__text" @click="onRemoveImage(index)">上传图片</p>
                <i class="el-icon-circle-close"></i>
              </el-upload>
            </div>
          </el-radio-group>

          <!-- 复选框 -->
          <el-checkbox-group v-model="checkList" v-if="form.questionType === 2" @change="checkChange">
            <div v-for="(item, index) in form.options" :key="index" class="active" :class="index === 0 ? 'check' : 'check1'">
              <el-checkbox :label="item.code"> {{ item.code }}: </el-checkbox>
              <el-input style="width: 270px; padding: 0 15px; margin-left: -10px" v-model="item.title" />

              <el-upload v-loading="imageIoading" class="avatar-uploader" action="#" :http-request="httpRequest" @click.native="clickUpLoad(index, $event)" :show-file-list="false">
                <img v-if="item.img" :src="item.img" class="avatar" />
                <p v-else>上传图片</p>
                <i class="el-icon-circle-close" @click="onRemoveImage(index)"></i>
              </el-upload>
            </div>
            <el-button type="danger" size="small" :disabled="form.questionType !== 2" @click="addOptions">
              +增加选项与答案
            </el-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="解析视频:" style="marginTop:20px">
          <video :src="form.videoURL" controls width="400px"></video>
        </el-form-item>

        <el-form-item label="答案解析:" class="QuillEditor" prop="answer">
          <QuillEditor ref='answer' v-model="form.answer"></QuillEditor>
        </el-form-item>

        <el-form-item label="题目备注:" style="marginTop:70px">
          <el-input type="textarea" v-model="form.remarks" :style="{width:'400px',height:'100px'}"></el-input>
        </el-form-item>

        <el-form-item label="试题标签:" style="marginTop:20px">
          <el-select v-model="form.tags" placeholder="请选择" multiple style="width:400px">
            <el-option v-for="item in tagsList" :key="item.value" :label="item.label" :value="item.label"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm" v-if="!$route.query.id">确认提交</el-button>
          <el-button type="primary" @click="submitUpdateForm" v-else>确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>

</template>

<script>
import COS from 'cos-js-sdk-v5'
// SECRETID 和 SECRETKEY请登录 https://console.cloud.tencent.com/cam/capi 进行查看和管理
var cos = new COS({
  SecretId: 'AKIDVrzuc6LM8gz3sTowpTs2xdCYhgS0IL9i',
  SecretKey: 'MSJwLUO2RbXEgtrZ2FD0XquiHbfU4OTI',
})

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
import { list } from '../../api/hmmm/companys'
import { add, detail as getDetailInfo, update } from '../../api/hmmm/questions'
import QuillEditor from '../components/quilEditor.vue'
export default {
  data() {
    return {
      imageIndex: 0,
      imageIoading: false,
      code: '', // options是哪个
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
        options: [
          {
            isRight: false,
            code: 'A',
            title: '',
            img: '',
          },
          {
            isRight: false,
            code: 'B',
            title: '',
            img: '',
          },
          {
            isRight: false,
            code: 'C',
            title: '',
            img: '',
          },
          {
            isRight: false,
            code: 'D',
            title: '',
            img: '',
          },
        ],
        province: '',
        publishDate: '',
        publishState: '',
        question: '',
        questionType: 1,
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
      enterpriseList: [],
      rules: {
        subjectID: [
          { required: true, message: '请选择学科', trigger: 'change' },
        ],
        catalogID: [
          { required: true, message: '请选择目录', trigger: 'change' },
        ],
        enterpriseID: [
          { required: true, message: '请选择企业', trigger: 'change' },
        ],
        province: [
          { required: true, message: '请选择城市', trigger: 'change' },
        ],
        direction: [
          { required: true, message: '请选择方向', trigger: 'change' },
        ],
        questionType: [
          { required: true, message: '请选择难度', trigger: 'change' },
        ],
        difficulty: [
          { required: true, message: '请选择难度', trigger: 'change' },
        ],
        question: [{ required: true, message: '请填写题干', trigger: 'blur' }],
        answer: [{ required: true, message: '请填写答案', trigger: 'blur' }],
      },
      checkList: [],
    }
  },
  components: {
    QuillEditor,
  },
  watch: {
    $route: {
      handler: 'resetData',
    },
  },
  created() {
    this.getSubjectsSimple()
    this.getCityData()
    console.log(this.$route.query.id)
    if (this.$route.query.id) {
      this.getDetailInfo()
    }
  },
  methods: {
    //上传图片处理
    httpRequest({ file }) {
      this.imageIoading = true
      cos.putObject(
        {
          Bucket: 'smallcaps-1313341571' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: file.name /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData))
          },
        },
        (err, data) => {
          // 如果err为null 表示没有错 false
          // 如果err不为null 表示有错 true
          if (err || data.statusCode !== 200) {
            console.log(err || data)
            return this.$message.error('上传图片失败')
          }
          // 拿回桶里的照片地址
          this.form.options[this.imageIndex].img = 'http://' + data.Location
          this.imageIoading = false
        }
      )
    },
    beforeAvatarUpload(file) {
      const types = ['image/gif', 'image/jpeg', 'image/png']
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!types.includes(file.type)) {
        this.$message.error(`上传头像图片只能是 ${types.join('或')}格式!`)
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return types.includes(file.type) && isLt2M
    },
    clickUpLoad(index) {
      this.imageIndex = index
    },
    // 清空照片
    onRemoveImage(index) {
      this.form.options[index].img = ''
    },
    //添加选项
    addOptions() {
      const num =
        this.form.options[this.form.options.length - 1].code.charCodeAt() + 1
      this.form.options.push({
        code: String.fromCharCode(num), //代码
        title: '', //标题
        img: '', //图片url
        isRight: false, //是否正确答案
      })
    },

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
      const {
        data: { items },
      } = await list({
        pagesize: 1000,
      })
      this.enterpriseList = items
      const { data: tags } = await tagsSimple({
        subjectID: id,
      })
      this.tagsList = tags
    },
    handleRemove() {},
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
    submitForm() {
      switch (this.code) {
        case 'A':
          this.form.options[0].isRight = true
          break
        case 'B':
          this.form.options[1].isRight = true
          break
        case 'C':
          this.form.options[2].isRight = true
          break
        case 'D':
          this.form.options[3].isRight = true
          break
      }
      // 获取里面的值
      this.form.answer = this.$refs.answer.content
      this.form.question = this.$refs.question.content

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let objParams = Object.assign({}, this.form)
          Object.keys(objParams).filter((n) => {
            if (objParams[n] === '') {
              delete objParams[n]
            }
            return true
          })
          objParams.difficulty = objParams.difficulty.toString()
          objParams.questionType = objParams.questionType.toString()
          await add(objParams)
          this.$message.success('添加成功')
        } else {
          console.log('error submit!!')
          return false
        }
        this.form = {
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
          options: [
            {
              isRight: false,
              code: 'A',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'B',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'C',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'D',
              title: '',
              img: '',
            },
          ],
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
        }
      })
    },
    submitUpdateForm() {
      switch (this.code) {
        case 'A':
          this.form.options[0].isRight = true
          break
        case 'B':
          this.form.options[1].isRight = true
          break
        case 'C':
          this.form.options[2].isRight = true
          break
        case 'D':
          this.form.options[3].isRight = true
          break
      }
      // 获取里面的值
      this.form.answer = this.$refs.answer.content
      this.form.question = this.$refs.question.content

      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let objParams = Object.assign({}, this.form)
          Object.keys(objParams).filter((n) => {
            if (objParams[n] === '') {
              delete objParams[n]
            }
            return true
          })
          objParams.difficulty = objParams.difficulty.toString()
          objParams.questionType = objParams.questionType.toString()
          await update(objParams)
          this.$message.success('修改成功')
          this.$router.push('/questions/list')
        } else {
          console.log('error submit!!')
          return false
        }
        this.form = {
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
          options: [
            {
              isRight: false,
              code: 'A',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'B',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'C',
              title: '',
              img: '',
            },
            {
              isRight: false,
              code: 'D',
              title: '',
              img: '',
            },
          ],
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
        }
      })
    },
    async getDetailInfo() {
      const { data } = await getDetailInfo({ id: this.$route.query.id })
      this.form = data
      this.form.difficulty = Number(data.difficulty)
      this.form.questionType = Number(data.questionType)
      this.form.tags = data.tags.split(',')
      // 单选框
      if (this.form.questionType === 1) {
        const result = this.form.options.find((item) => {
          return item.isRight
        })
        this.code = result.code
      }
      // 复选框
      if (this.form.questionType === 2) {
        this.form.options.forEach((item) => {
          if (item.isRight) {
            this.checkList.push(item.code)
          }
        })
      }
    },
    // 复选框发生改变时
    checkChange(checks) {
      console.log('999')
      this.form.options.forEach((item) => {
        item.isRight = 0
      })
      checks.forEach((check) => {
        const index = this.form.options.findIndex((val) => {
          return val.code === check
        })
        this.form.options[index].isRight = 1
      })
    },
    // 单选框发生改变时
    radioChange(code) {
      this.body.options.forEach((item) => {
        if (item.code === code) {
          item.isRight = 1
        } else {
          item.isRight = false
        }
      })
    },
  },
}
</script>

<style lang='less' >
.uploadImage {
  display: flex;
  align-items: center;
  height: 80px;
  position: relative;
  //图片上传区域样式
  ::v-deep .avatar-uploader .el-upload {
    display: inline-block;
    width: 100px;
    height: 60px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
  }
  .avatar-uploader {
    width: 100px;
    height: 60px;
    img {
      width: 100%;
      height: 100%;
    }
    p {
      margin: 0;
      height: 59px;
      line-height: 59px;
      font-size: 14px;
    }
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  ::v-deep .ql-editor {
    height: 200px;
  }
  .el-icon-circle-close {
    position: absolute;
    top: 5px;
    right: -9px;
    width: 18px;
    height: 18px;
    background: #fff;
    border-radius: 50%;
    font-size: 18px;
    color: #999;
    cursor: pointer;
  }
}
::v-deep.check {
  .el-checkbox__label {
    margin-left: 3px;
    font-size: 14px;
  }
}
.el-radio {
  height: 36px;
  line-height: 36px;
}
::v-deep.check1 {
  .el-checkbox__label {
    margin-left: 4px;
    font-size: 14px;
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
  .el-textarea__inner {
    width: 400px;
    height: 100px;
  }
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
