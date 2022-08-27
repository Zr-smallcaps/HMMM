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
              <el-form-item :label="$t('table.state')">
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
                    :label="$t('table.prohibit')"
                    value="0"
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
                >{{ $t('table.search') }}</el-button
              >
            </el-col>
            <el-col :span="12">
              <el-row
                type="flex"
                class="row-bg"
                justify="end"
              >
                <el-col :span="6">
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    @click="addUser"
                    >{{ $t('table.addUser') }}</el-button
                  >
                </el-col>
              </el-row>
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
            v-loading="tableShowLoading"
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
              :label="$t('table.id')"
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
              :label="$t('table.creatdate')"
            >
            </el-table-column>
            <el-table-column
              prop="remarks"
              align="center"
              :label="$t('table.remarks')"
            >
            </el-table-column>
            <el-table-column
              prop="state"
              align="center"
              :label="$t('table.state')"
            >
            </el-table-column>
            <el-table-column
              prop="is_deleted"
              :label="$t('table.actions')"
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

                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="hover"
                    :content="row.state"
                    popper-class="mon-top"
                  >
                    <div class="popoverTop">
                      {{
                        row.state === '启动'
                          ? '禁用'
                          : '启动'
                      }}
                    </div>
                    <el-button
                      slot="reference"
                      :class="
                        row.state === '启动'
                          ? 'btnMid'
                          : 'btnMidTruee'
                      "
                      type="primary"
                      :icon="
                        row.state === '启动'
                          ? 'el-icon-close'
                          : 'el-icon-check'
                      "
                      circle
                      @click="disabled(row)"
                    >
                    </el-button>
                  </el-popover>

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
        <!-- 分页 -->
        <pageTools
          class="pageTools"
          :total="counts"
          :paginationPage="page"
          :paginationPagesize="pagesize"
          @pageChange="pageChange"
        />
      </el-card>
    </div>
    <!-- 新增用户 -->
    <companyAdd
      :titleInfo="titleInfo"
      :dialogFormVisible="dialogFormVisible"
      :formBase="formCompanyAdd"
      @changeVisible="changeVisible"
      @getCompanysList="getCompanysList"
    />
  </div>
</template>

<script>
import { provinces, citys } from '@/api/hmmm/citys.js'
import {
  list,
  disabled,
  remove,
} from '@/api/hmmm/companys'
import companyAdd from '../components/companys-add'
import pageTools from '../../module-manage/components/page-tool'
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
      formCompanyAdd: {},
      companysList: [],
      // 新增
      dialogFormVisible: false,
      titleInfo: '',
      addOrChange: '',
      visible: false, //弹出框
      newobj: {},
      tableShowLoading: false,
    }
  },

  created() {
    this.getCityData()
    this.getCompanysList()
  },

  methods: {
    async getCompanysList() {
      this.tableShowLoading = true

      try {
        const { data } = await list({
          page: this.page,
          pagesize: this.pagesize,
        })
        this.companysList = data.items
        this.counts = data.counts
      } catch (err) {}
      this.tableShowLoading = false
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
    // 搜索
    async searchBtn() {
      try {
        let obj = {
          page: this.page,
          pagesize: this.pagesize,
          state: this.formCompany.state,
          city: this.formCompany.city,
          shortName: this.formCompany.shortName,
          province: this.formCompany.province,
          tags: this.formCompany.tags,
        }
        for (let k in obj) {
          if (obj[k]) {
            this.newobj[k] = obj[k]
          }
        }
        console.log(this.newobj)
        console.log(this.formCompany)
        const { data } = await list(this.newobj)
        this.companysList = data.items
        this.counts = data.counts
        this.newobj = {}
      } catch (err) {
        console.log(err)
      }
    },
    // 清楚
    clearSearch() {
      this.formCompany = {
        province: '',
        city: '',
        tags: '',
        shortName: '',
        state: '',
      }
      this.getCompanysList()
    },

    // 修改
    changeUserInfo(row) {
      this.titleInfo = '编辑用户'
      this.formCompanyAdd = row
      this.addOrChange = false
      this.dialogFormVisible = true
    },

    disabled(row) {
      let title = row.state == '启动' ? '禁用' : '启用'
      this.$confirm(`已成功${title}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          await disabled({
            id: row.id,
            state: row.state === '启动' ? 0 : 1,
          })
          this.$message({
            type: 'success',
            message: '修改成功!',
          })
          this.getCompanysList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作!',
          })
        })
    },
    // 删除
    deleteUserInfo(row) {
      this.$confirm(
        '此操作将永久删除用户 , 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          await remove({ id: row.id })
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getCompanysList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 新增
    addUser() {
      this.addOrChange = true
      this.dialogFormVisible = true
      this.titleInfo = '新增用户'
      this.formCompanyAdd = {
        province: '',
        city: '',
        tags: '',
        shortName: '',
        state: '',
      }
    },
    //修改弹窗的显示 隐藏
    changeVisible(val) {
      this.addOrChange = false
      this.dialogFormVisible = val
    },
    // 进入某一页
    pageChange(page) {
      ;(this.page = page), this.getCompanysList()
    },
  },
  computed: {},
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
  components: {
    companyAdd,
    pageTools,
  },
}
</script>

<style lang="scss" scoped>
.btnLeft {
  color: #409eff;
  background: #ecf5ff;
  border-color: #b3d8ff;
}

.btnMid {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
  margin-left: 5px;
}
.btnMidTruee {
  color: #67c23a;
  background: #f0f9eb;
  border-color: #c2e7b0;
  margin-left: 5px;
}
.btnMidTruee:hover {
  background: #67c23a;
  border-color: #67c23a;
  color: #fff;
}
.btnRight {
  color: #f56c6c;
  background: #fef0f0;
  border-color: #fbc4c4;
  margin-left: 5px;
}
.btnRight:hover {
  background: #f56c6c;
  border-color: #f56c6c;
  color: #fff;
}
.btnLeft:hover {
  background: #409eff;
  border-color: #409eff;
  color: #fff;
}
.btnRightX {
  color: #e6a23c;
  background: #fdf6ec;
  border-color: #f5dab1;
}
.btnMid:hover {
  background: #e6a23c;
  border-color: #e6a23c;
  color: #fff;
}
.el-popover .popoverTop {
  width: 30px;
  height: 30px;
  background-color: black;
  color: #fff;
}
.mon-top {
  background-color: rgba(10, 127, 180, 0.2);
}
.pageTools {
  text-align: right;
  margin-top: 20px;
}
.dashboard-container {
  min-width: 900px;
}
</style>
