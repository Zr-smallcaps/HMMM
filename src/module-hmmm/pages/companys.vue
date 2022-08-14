<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-form
          ref="formCompany"
          :model="formCompany"
          label-width="80px"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="标签名称">
                <el-input
                  v-model="formCompany.tags"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="城市">
                <el-select
                  class="filter-item"
                  v-model="formCompany.province"
                  @keyup.enter="handleFilter"
                  @change="handleProvince"
                  filterable
                >
                  <el-option
                    v-for="item in citySelect.province"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="地区">
                <el-select
                  class="filter-item"
                  v-model="formCompany.city"
                  @keyup.enter="handleFilter"
                  filterable
                >
                  <el-option
                    v-for="item in citySelect.cityDate"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="企业简称">
                <el-input
                  v-model="formCompany.shortName"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-select
                  v-model="formCompany.state"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    label="启用"
                    value="1"
                  ></el-option>
                  <el-option
                    label="禁用"
                    value="2"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="padding-left: 40px">
              <el-button size="small" @click="clearSearch"
                >清除</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="searchBtn"
                >搜索</el-button
              >
            </el-col>
          </el-row>
        </el-form>
        <!-- 提示 -->
        <el-alert
          :title="`共${counts}条数据`"
          type="info"
          show-icon
          style="margin-bottom: 20px; margin-top: 10px"
          :closable="false"
        >
        </el-alert>
        <!-- 表格 -->
        <template>
          <el-table
            :data="companysList"
            style="width: 100%"
            :header-cell-style="{
              background: '#f4f4f5',
              color: '#909399',
              'text-align': 'center',
            }"
          >
            <el-table-column
              align="center"
              prop="id"
              label="序号"
              width="125"
            >
            </el-table-column>
            <el-table-column
              prop="number"
              align="center"
              label="企业编码"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="shortName"
              align="center"
              label="企业简称"
            >
            </el-table-column>
            <el-table-column
              prop="tags"
              align="center"
              label="标签"
            >
            </el-table-column>
            <el-table-column
              prop="creatorID"
              label="创建者"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="addDate"
              align="center"
              label="创建日期"
            >
            </el-table-column>
            <el-table-column
              prop="remarks"
              align="center"
              label="备注"
            >
            </el-table-column>
            <el-table-column
              prop="state"
              align="center"
              label="状态"
            >
            </el-table-column>
            <el-table-column
              prop="is_deleted"
              label="操作"
              align="center"
              width="160px"
            >
              <template slot-scope="{ row }">
                <div class="operateBtn">
                  <el-button
                    class="btnLeft"
                    type="primary"
                    icon="el-icon-edit"
                    circle
                    @click="changeUserInfo(row)"
                  ></el-button>
                  <el-button
                    class="btnMid"
                    type="primary"
                    icon="el-icon-close"
                    circle
                    @click="disabled(row)"
                  ></el-button>
                  <el-button
                    v-if="row.id !== '2'"
                    class="btnRight"
                    type="primary"
                    icon="el-icon-delete"
                    circle
                    @click="deleteUserInfo(row)"
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
import { provinces, citys } from '@/api/hmmm/citys.js'
import { list } from '@/api/hmmm/companys'
export default {
  data() {
    return {
      page: 1,
      pagesize: 10,
      counts: '',
      citySelect: {
        province: [],
        cityDate: [],
      },
      formCompany: {
        province: '',
        city: '',
        tags: '',
        shortName: '',
        state: '',
      },
      companysList: [],
    }
  },

  created() {
    this.getCityData()
    this.getCompanysList()
  },

  methods: {
    async getCompanysList() {
      try {
        const { data } = await list({
          page: this.page,
          pagesize: this.pagesize,
        })
        this.companysList = data.items
        this.counts = data.counts
      } catch (err) {}
    },
    // 获取省
    getCityData: function () {
      this.citySelect.province = provinces()
    },
    // 选省获取到市
    handleProvince: function (e) {
      this.citySelect.cityDate = citys(e)
      this.formCompany.city = this.citySelect.cityDate[0]
    },
    clearSearch() {},
    searchBtn() {
      console.log(this.formCompany)
    },
    // 修改
    changeUserInfo() {},
    // 禁用
    disabled() {},
    // 删除
    deleteUserInfo() {},
  },
  watch: {
    companysList() {
      this.companysList.map(item => {
        if (item.state === 1) {
          item.state = '启动'
        } else {
          item.state = '禁用'
        }
      })
    },
  },
}
</script>

<style>
.btnLeft {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}
.btnLeft :hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.btnMid {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}
.btnRight {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
}
.btnRight :hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}
</style>
