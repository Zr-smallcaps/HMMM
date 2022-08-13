<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <!-- 头部搜索  -->
        <pageTools>
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
        </pageTools>
        <!-- 提示信息 -->
        <el-alert
          :title="`共${counts}条数据`"
          type="info"
          show-icon
          style="margin-bottom: 20px"
          :closable="false"
        >
        </el-alert>
        <!-- 表格 -->
        <template>
          <el-table
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
              label="地址"
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
                    v-if="row.id === '2'"
                    class="btnRight"
                    type="primary"
                    icon="el-icon-delete"
                    circle
                  ></el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-card>
      <add-user
        :visible.sync="addUserVisible"
        :permissionGroup="permissionGroup"
        :userInfo="userInfo"
        ref="addUserdialog"
        :passwordShow="passwordShow"
      ></add-user>
    </div>
  </div>
</template>

<script>
import { list, detail } from '@/api/base/users'
import { simple } from '@/api/base/permissions'
import addUser from '../components/addUser'
export default {
  name: 'user',
  data() {
    return {
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
    async getUserList() {
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
    },
    handlerPageNo() {
      if (this.username.trim().length === 0) {
        this.getUserList()
      }
    },
    clearSearchInput() {
      this.username = ''
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
  },
  components: { addUser },
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
  .btnRight {
    color: #f56c6c;
    background: #fef0f0;
    border-color: #fbc4c4;
  }
}
</style>
