<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部搜索  -->
        <Navbar>
          <template slot="left">
            <el-form>
              <el-form-item>
                <el-input
                  placeholder="根据用户名搜索"
                  style="width: 200px"
                  v-model.trim="username"
                  @change="handlerPageNo"
                ></el-input>
                <el-button
                  style="margin-left: 15px"
                  @click="clearSearchInput"
                  >{{ $t('table.clear') }}</el-button
                >
                <el-button
                  type="primary"
                  style="margin-left: 15px"
                  @click="searchBtn"
                  >{{ $t('table.search') }}</el-button
                >
              </el-form-item>
            </el-form>
          </template>
          <template slot="right">
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="addUser"
              >{{ $t('table.addUser') }}</el-button
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
            :data="userList"
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
              prop="email"
              align="center"
              :label="$t('table.email')"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="phone"
              align="center"
              :label="$t('table.phone')"
            >
            </el-table-column>
            <el-table-column
              prop="username"
              align="center"
              :label="$t('table.username')"
            >
            </el-table-column>
            <el-table-column
              prop="permission_group_title"
              :label="$t('table.permissionUser')"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="role"
              align="center"
              :label="$t('table.role')"
            >
            </el-table-column>
            <el-table-column
              prop="is_deleted"
              :label="$t('table.actions')"
              align="center"
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
                    v-if="row.id != '2'"
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
        <pageTools
          class="pageTools"
          :total="counts"
          :paginationPage="page"
          :paginationPagesize="pagesize"
          @pageChange="pageChange"
        />
      </el-card>
      <add-user
        :visible.sync="addUserVisible"
        :permissionGroup="permissionGroup"
        :userInfo="userInfo"
        ref="addUserdialog"
        :passwordShow="passwordShow"
        @getUserList="getUserList1"
      ></add-user>
    </div>
  </div>
</template>

<script>
import { list, detail, remove } from '@/api/base/users'
import { simple } from '@/api/base/permissions'
import addUser from '../components/addUser'
import pageTools from '../components/page-tool'
import Navbar from '../components/navbar'
export default {
  name: 'user',
  data() {
    return {
      tableShowLoading: false,
      page: 1,
      pagesize: 10,
      username: '',
      userList: [],
      counts: '',
      title: '',
      addUserVisible: false,
      permissionGroup: [],
      userInfo: {},
      passwordShow: true,
    }
  },
  created() {
    this.getUserList()
    this.getPermissionGroup()
  },
  methods: {
    getUserList1() {
      this.getUserList()
    },
    // 获取用户数据列表
    async getUserList() {
      this.tableShowLoading = true
      try {
        const { data } = await list({
          page: this.page,
          pagesize: this.pagesize,
          username: this.username,
        })
        this.userList = data.list
        this.counts = data.counts
      } catch (err) {
        console.log(err)
      }
      this.tableShowLoading = false
    },
    // 用户名为空则回显
    handlerPageNo() {
      if (this.username.trim().length === 0) {
        this.getUserList()
      }
    },
    // 清楚用户名
    clearSearchInput() {
      this.username = ''
      this.getUserList1()
    },
    // 搜索按钮
    searchBtn() {
      this.getUserList()
    },
    // 新增
    async addUser() {
      this.passwordShow = true
      this.addUserVisible = true
    },
    // get权限组数据列表
    async getPermissionGroup() {
      const { data } = await simple()
      this.permissionGroup = data
    },
    // 编辑按钮
    async changeUserInfo(row) {
      try {
        const res = await detail(row)
        console.log(res)
        this.userInfo = res.data
        this.passwordShow = false
        this.addUserVisible = true
      } catch (err) {
        console.log(err)
      }
    },
    // 删除
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
          this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作',
          })
        })
    },
    // 进入某一页
    pageChange(page) {
      ;(this.page = page), this.getUserList1()
    },
  },
  watch: {},
  components: { addUser, Navbar, pageTools },
}
</script>

<style scoped lang="scss">
.dashboard-container {
  min-width: 900px;
}
.operateBtn {
  display: flex;
  justify-content: center;
  .btnLeft {
    color: #409eff;
    background: #ecf5ff;
    border-color: #b3d8ff;
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
  .btnLeft:hover {
    background: #409eff;
    border-color: #409eff;
    color: #fff;
  }
}
.pageTools {
  text-align: right;
  margin-top: 20px;
}
</style>
