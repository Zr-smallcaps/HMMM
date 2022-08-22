<template>
  <div class="dashboard-container">
    <el-card class="box-card">
      <el-button
        type="success"
        icon="el-icon-edit"
        style="float: right; margin-bottom: 20px"
        @click="addMenu()"
        >新增菜单</el-button
      >
      <tree-table
        :data="menuList"
        :columns="columns"
        :expand-type="false"
        :is-fold="false"
        tree-type
        :selection-type="false"
        style="font-size: 15px"
        v-loading="treeTableLoading"
      >
        <template slot="title" slot-scope="{ row }">
          <div :style="getMarginLeft(row.level)">
            <i
              :class="leveDeep(row)"
              style="font-size: 18px; margin-right: 8px"
            >
            </i>
            <span>{{ row.title }}</span>
          </div>
        </template>
        <template slot="handle" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            plain
            @click="changeMenu(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            plain
            @click="handleDeleteMenuInfo(scope.row)"
          ></el-button>
        </template>
      </tree-table>
    </el-card>
    <!-- 编辑、新增dialog-->
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="handleType"
      :visible.sync="menuDialogVisible"
      width="500px"
      @close="closeDialog"
    >
      <el-form
        :model="menuInfo"
        :rules="rules"
        ref="menuform"
      >
        <el-form-item
          :label="$t('table.permissionUser')"
          label-width="200px"
        >
          <el-radio
            v-model="menuInfo.is_point"
            :label="false"
            :disabled="handleType === '编辑菜单'"
            >菜单</el-radio
          >
          <el-radio
            v-model="menuInfo.is_point"
            :label="true"
            :disabled="handleType === '编辑菜单'"
            >权限点</el-radio
          >
        </el-form-item>

        <el-form-item
          :label="$t('table.permissionUser')"
          label-width="200px"
          prop="pid"
        >
          <el-select v-model="menuInfo.pid">
            <el-option
              label="主导航"
              :value="0"
            ></el-option>
            <div
              v-for="subItem in menuList"
              :key="subItem.id"
            >
              <el-option
                :disabled="menuInfo.is_point"
                :label="subItem.title"
                :value="subItem.id"
                style="textindent: 140px"
              ></el-option>
              <el-option
                v-for="item in subItem.children"
                :key="item.id"
                :label="item.title"
                :value="item.id"
                style="textindent: 24px"
              ></el-option>
            </div>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('table.powerTitle')"
          label-width="200px"
          prop="title"
        >
          <el-input
            v-model="menuInfo.title"
            autocomplete="on"
            size="medium"
            style="width: 220px"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="权限代码"
          label-width="200px"
          prop="code"
        >
          <el-input
            v-model="menuInfo.code"
            autocomplete="on"
            size="medium"
            style="width: 220px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuDialogVisible = false">{{
          $t('table.cancel')
        }}</el-button>
        <el-button
          type="primary"
          @click="handlechangeMenu()"
          >{{ $t('table.confirm') }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import treeTable from 'vue-table-with-tree-grid'
import {
  list,
  update,
  add,
  remove,
} from '@/api/base/menus'
export default {
  data() {
    return {
      treeTableLoading: false,
      marginLeft: 20,
      menuList: [],
      columns: [
        {
          label: 'id',
          prop: 'id',
          width: '0',
        },
        {
          label: '标题',
          type: 'template',
          template: 'title',
        },
        {
          label: '权限点代码',
          prop: 'code',
        },
        {
          label: '操作',
          align: 'center',
          headerAlign: 'center',
          type: 'template',
          template: 'handle',
        },
      ],
      menuDialogVisible: false,
      menuInfo: {},
      rules: {
        code: [
          {
            required: true,
            message: '请输入权限代码',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 20,
            message: '长度在 1 到 20 个字符',
            trigger: 'blur',
          },
        ],
        title: [
          {
            required: true,
            message: '权限标题',
            trigger: 'blur',
          },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur',
          },
        ],
        pid: [
          {
            required: true,
            message: '请选择权限组',
            trigger: 'change',
          },
        ],
      },
      handleType: '创建菜单',
    }
  },
  watch: {
    'menuInfo.is_point'(value) {
      if (this.handleType === '新建菜单') {
        value
          ? this.$set(this.menuInfo, 'pid', '')
          : this.$set(this.menuInfo, 'pid', 0)
      }
    },
  },
  created() {
    this.getMenuList()
  },
  methods: {
    // get菜单数据数组
    async getMenuList() {
      this.treeTableLoading = true
      let { data } = await list()
      data.forEach(item => {
        item.pid = 0
      })
      let resultStr = JSON.stringify(data)
      resultStr = resultStr.replace(
        /(childs)|(points)/g,
        'children'
      )
      this.menuList = JSON.parse(resultStr)
      this.menuItemLevel(this.menuList, 0)
      this.treeTableLoading = false
    },
    // 设置level 深度
    leveDeep(row) {
      if (row.pid === 0) {
        return 'el-icon-folder-opened'
      } else if (row.pid && row.is_point) {
        return 'el-icon-view'
      } else {
        return 'el-icon-folder'
      }
    },
    //左侧位移距离
    getMarginLeft(level) {
      return {
        marginLeft: level * this.marginLeft + 'px',
      }
    },
    // 设置层级 leve
    menuItemLevel(menuList, index) {
      menuList.forEach(item => {
        let i = index
        item.level = i
        if (item.children) {
          i++
          this.menuItemLevel(item.children, i)
        }
      })
    },
    // 编辑
    changeMenu(row) {
      this.handleType = '编辑菜单'
      this.menuInfo = { ...row }
      this.$set(
        this.menuInfo,
        'is_point',
        row.is_point ? row.is_point : false
      )
      this.menuDialogVisible = true
    },
    // 发送请求
    handlechangeMenu() {
      this.$refs.menuform.validate(async flag => {
        if (flag) {
          try {
            if (this.handleType === '编辑菜单') {
              await update(this.menuInfo)
            } else {
              await add(this.menuInfo)
            }
            this.$message({
              message: `${this.handleType}成功`,
              type: 'success',
            })
            this.menuDialogVisible = false
            this.getMenuList()
          } catch (error) {
            this.$message({
              message: error,
              type: 'error',
            })
          }
        }
      })
    },
    // 新增菜单
    addMenu() {
      this.menuInfo = {
        is_point: false,
      }
      this.handleType = '新建菜单'
      this.menuDialogVisible = true
      this.$set(this.menuInfo, 'pid', 0)
    },
    handleDeleteMenuInfo(row) {
      this.$confirm(
        '此操作将永久删除该菜单, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(async () => {
          await remove(row)
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          this.getMenuList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    closeDialog() {
      this.$refs.menuform.resetFields()
    },
  },
  components: {
    treeTable,
  },
}
</script>

<style lang="less" scoped>
.dashboard-container {
  padding: 20px;
  /deep/ .el-dialog {
    border-radius: 15px;
    overflow: hidden;
    .el-dialog__header {
      background-color: #409eff;
      .el-dialog__title {
        color: #fff;
      }
      .el-dialog__close {
        color: #fff;
      }
    }
    .el-dialog__body {
      padding: 30px 0px 0px;
      /deep/ .el-form-item__label {
        color: #606266;
        font-weight: 600;
      }
    }
  }
}
</style>
