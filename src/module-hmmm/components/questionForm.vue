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

          <el-select v-model="form.province" placeholder="请选择" @keyup.enter="handleFilter" @change="handleProvince" :style="{width:'50%'}">
            <el-option v-for="item in citySelect.province" :key="item" :label="item" :value="item"></el-option>
          </el-select>
          <el-select v-model="form.city" @keyup.enter="handleFilter" filterable placeholder="请选择" :style="{width:'50%'}">
            <el-option v-for="item in citySelect.city" :key="item" :label="item" :value="item"></el-option>
          </el-select>

        </el-form-item>
      </el-col>
      <el-col :span="6">
        <div class="btn-container">
          <el-button @click="removeSearchQuestion">清除</el-button>
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
      citySelect: {
        province: [],
        city: [],
      },
    }
  },
  components: {},
  computed: {},
  created() {
    this.getSimple()
    this.getCityData()
  },
  mounted() {},
  methods: {
    handleFilter() {},
    // 获取省
    getCityData() {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    handleProvince(e) {
      this.citySelect.city = citys(e)
    },
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
    removeSearchQuestion() {
      this.form = {
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
      }
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