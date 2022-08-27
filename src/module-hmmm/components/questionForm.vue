<template>
  <el-form ref="form" :model="form" label-position="right" label-width="80px">
    <el-row>
      <el-col :span="6">
        <el-form-item label="学科">
          <el-select v-model="form.subjectID" placeholder="请选择" style="width:100%" @change="changeSubject">
            <el-option v-for="item in subjectIDList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">

        <el-form-item label="二级目录">
          <el-select v-model="form.catalogID" placeholder="请选择" style="width:100%">
            <el-option v-for="item in catalogList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="标签">
          <el-select v-model="form.tags" placeholder="请选择" style="width:100%">
            <el-option v-for="item in tagsList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="关键字">
          <el-input v-model="form.keyword" placeholder="根据题干搜索"></el-input>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="试题类型">
          <el-select v-model="form.questionType" placeholder="请选择" style="width:100%">
            <el-option v-for="item in questionType" :key="item.value" :label="item.label" :value="item.value"></el-option>

          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="难度">
          <el-select v-model="form.difficulty" placeholder="请选择" style="width:100%">
            <el-option v-for="item in difficulty" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="方向">
          <el-select v-model="form.direction" placeholder="请选择" style="width:100%">
            <el-option v-for="item in direction" :key="item.value" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

      </el-col>
      <el-col :span="6">

        <el-form-item label="录入人">
          <el-select v-model="form.creatorID" placeholder="请选择" style="width:100%">
            <el-option label="超级管理员" value="2"></el-option>
          </el-select>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="题目备注">
          <el-input v-model="form.remarks" placeholder="根据题干搜索"></el-input>
        </el-form-item>

      </el-col>
      <el-col :span="6">

        <el-form-item label="企业简称">
          <el-input v-model="form.shortName" placeholder="根据题干搜索"></el-input>
        </el-form-item>

      </el-col>

      <el-col :span="6">

        <el-form-item label="城市">
          <el-select v-model="form.city" placeholder="请选择" style="width:50%">
            <el-option v-for="(item,index) in provinces" :key="index" :label="item.city" :value="item.city"></el-option>

          </el-select>

          <el-select v-model="form.province" placeholder="请选择" :style="{width:'50%'}">
            <el-option label="区域一" value="shanghai"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div class="btn-container">
          <el-button>清除</el-button>
          <el-button type="primary" @click="searchQuestion">搜索</el-button>
        </div>

      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { directorysSimple } from '../../api/hmmm/directorys'
import { subjectsSimple } from '../../api/hmmm/subjects'
import { tagsSimple } from '../../api/hmmm/tags'
import { choice } from '../../api/hmmm/questions'
import {
  status,
  difficulty,
  questionType,
  direction,
} from '../../api/hmmm/constants.js'
import { provinces, citys } from '../../api/hmmm/citys'
export default {
  name: '',
  data() {
    return {
      direction,
      questionType,
      difficulty,
      provinces,
      citys,
      form: {
        subjectID: '',
        difficulty: '',
        questionType: '',
        tags: '',
        province: '',
        city: '',
        keyword: '',
        remarks: '',
        shortName: '',
        direction: '',
        creatorID: '',
        catalogID: '',
        chkState: '',
      },
      subjectIDList: [],
      catalogList: [],
      tagsList: [],
    }
  },
  components: {},
  computed: {},
  created() {
    this.getSimple()
  },
  mounted() {},
  methods: {
    async getSimple() {
      const { data } = await subjectsSimple()
      this.subjectIDList = data
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
    async searchQuestion() {
      let objParams = Object.assign({}, this.form)
      Object.keys(objParams).filter((n) => {
        if (objParams[n] === '') {
          delete objParams[n]
        }
        return true
      })
      const { data } = await choice(objParams)
     this.$EventBus.$emit('sendTbaleList', data)
    },
  },
  watch: {},
}
</script>
<style lang='less' scoped>
.btn-container {
  margin-left: 300px;
  display: flex;
  .el-button--medium {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    font-size: 12px;
  }
}
</style>