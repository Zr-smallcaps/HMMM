<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部 -->
        <Navbar>
          <template slot="left">
            <el-form>
              <el-form-item>
                <el-input
                  placeholder="根据用户名搜索"
                  style="width: 200px"
                  v-model.trim="title"
                  @change="handlerPageNo"
                ></el-input>
                <el-button
                  style="margin-left: 15px"
                  @click="clearInputBtn"
                  >清空</el-button
                >
                <el-button
                  type="primary"
                  style="margin-left: 15px"
                  @click="getPermissionList"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </template>
          <template slot="right">
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="addPermissions"
              >新增权限组</el-button
            >
          </template>
        </Navbar>
        <!-- 提示信息 -->
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
            element-loading-text="给我一点时间"
            ref="multipleTable"
            :data="permissionList"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{
              background: '#f4f4f5',
              color: '#909399',
              'text-align': 'center',
            }"
          >
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column
              label=""
              width="120"
              align="center"
            >
              <template slot-scope="scope">{{
                scope.row.date
              }}</template>
            </el-table-column>
            <el-table-column
              prop="title"
              :label="$t('table.username')"
              width="120"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="update_date"
              align="center"
              :label="$t('table.date')"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="is_deleted"
              :label="$t('table.actions')"
              align="right"
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
                    :class="
                      row.id === activeID
                        ? 'btnRightX'
                        : 'btnRight'
                    "
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
        <pageTools
          class="pageTools"
          :total="counts"
          :paginationPage="page"
          :paginationPagesize="pageSize"
          @pageChange="pageChange"
        />
      </el-card>
      <permissionsAdd
        :dialogFormVisible="permissionsVisible"
        :pageTitle="dialogTitle"
        :text="text"
        :rowId="rowId"
        @handleCloseModal="handleCloseModal"
        :addOrChangeShow="addOrChangeShow"
      />
    </div>
  </div>
</template>

<script>
import pageTools from '../components/page-tool'
import { list, remove } from '@/api/base/permissions'
import permissionsAdd from '../components/permissions-add'
import Navbar from '../components/navbar'

export default {
  data() {
    return {
      tableShowLoading: false,
      page: 1,
      pageSize: 10,
      counts: '',
      title: '',
      text: '',
      dialogTitle: '',
      permissionList: [],
      tableData: [
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      permissionsVisible: false,
      addOrChangeShow: true,
      multipleSelection: [],
      rowId: '',
      activeID: '',
    }
  },

  created() {
    this.getPermissionList()
  },

  methods: {
    async getPermissionList() {
      this.tableShowLoading = true
      const { data } = await list({
        page: this.page,
        pageSize: this.pageSize,
        title: this.title,
      })
      this.permissionList = data.list
      this.counts = data.counts
      this.tableShowLoading = false
    },
    // 清空的时候触发
    handlerPageNo() {
      if (this.username.trim().length === 0) {
        this.getPermissionList()
      }
    },
    clearInputBtn() {
      this.title = ''
      this.getPermissionList()
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    addPermissions() {
      this.permissionsVisible = true
      this.dialogTitle = '创建权限组'
    },
    changeUserInfo(row) {
      this.addOrChangeShow = false
      this.dialogTitle = '编辑权限组'
      this.permissionsVisible = true
      this.rowId = row.id
      console.log(row)
    },
    deleteUserInfo(row) {
      this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          await remove({ id: row.id })
          this.getPermissionList()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          console.log(row)
          this.activeID = row.id
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },
    handleCloseModal() {
      this.permissionsVisible = false
      this.getPermissionList()
    },
    // 进入某一页
    pageChange(page) {
      ;(this.page = page), this.getPermissionList()
    },
  },
  computed: {},
  watch: {
    permissionList() {
      return this.permissionList.map(item => {
        item.update_date = item.update_date.slice(0, 10)
      })
    },
  },
  components: {
    pageTools,
    permissionsAdd,
    Navbar,
  },
}
</script>

<style scoped lang="scss">
.operateBtn {
  display: flex;
  justify-content: center;
  .btnLeft {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
  }
  .btnLeft:hover {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
  .btnRight {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
  .btnRight:hover {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
  .btnRightX {
    background: #f56c6c;
    border-color: #f56c6c;
    color: #fff;
  }
  .btnRightX:hover {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
}
.pageTools {
  text-align: right;
  margin-top: 20px;
}
.dashboard-container {
  min-width: 900px;
}
</style>
