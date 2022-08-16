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
                  >清空</el-button
                >
                <el-button
                  type="primary"
                  style="margin-left: 15px"
                  @click="searchBtn"
                  >搜索</el-button
                >
              </el-form-item>
            </el-form>
          </template>
          <template slot="right">
            <el-button
              type="success"
              icon="el-icon-edit"
              @click="addUser"
              >新增用户</el-button
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
              label="序号"
              width="125"
            >
            </el-table-column>
            <el-table-column
              prop="email"
              align="center"
              label="邮箱"
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="phone"
              align="center"
              label="联系电话"
            >
            </el-table-column>
            <el-table-column
              prop="username"
              align="center"
              label="用户名"
            >
            </el-table-column>
            <el-table-column
              prop="permission_group_id"
              label="权限组名称"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="role"
              align="center"
              label="角色"
            >
            </el-table-column>
            <el-table-column
              prop="is_deleted"
              label="操作"
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
  },
  methods: {
    getUserList1() {
      this.getUserList()
    },
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
    handlerPageNo() {
      if (this.username.trim().length === 0) {
        this.getUserList()
      }
    },
    clearSearchInput() {
      this.username = ''
      this.getUserList1()
    },
    searchBtn() {
      this.getUserList()
    },
    async addUser() {
      this.passwordShow = true
      this.addUserVisible = true
      const { data } = await simple()
      this.permissionGroup = data
    },
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
          console.log(row)
          // this.activeID = row.id
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
