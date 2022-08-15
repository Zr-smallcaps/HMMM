<template>
  <el-dialog
    :title="passwordShow ? '创建用户' : '编辑用户'"
    :visible="visible"
    width="500px"
    @close="onClose"
  >
    <el-form
      ref="addUserForm"
      :model="addUserForm"
      :rules="addUserFormRules"
      label-width="140px"
    >
      <el-form-item
        label="用户名"
        style="width: 80%"
        prop="username"
      >
        <el-input
          v-model="addUserForm.username"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        style="width: 80%"
        prop="email"
      >
        <el-input v-model="addUserForm.email"></el-input>
      </el-form-item>
      <el-form-item
        v-if="passwordShow"
        label="密码"
        style="width: 80%"
        prop="password"
      >
        <el-input
          v-model="addUserForm.password"
        ></el-input>
      </el-form-item>
      <el-form-item label="角色" style="width: 80%">
        <el-input v-model="addUserForm.role"></el-input>
      </el-form-item>
      <el-form-item label="权限组名称" style="width: 80%">
        <el-select
          style="width: 80%"
          v-model="addUserForm.permission_group_id"
          placeholder="请选择部门"
          ref="treeForm"
        >
          <el-option
            v-for="item in permissionGroup"
            :value="item.id"
            :label="item.title"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="联系电话" style="width: 80%">
        <el-input v-model="addUserForm.phone"></el-input>
      </el-form-item>
      <el-form-item label="介绍" style="width: 80%">
        <el-input
          type="textarea"
          :rows="2"
          placeholder="Please input"
          v-model="addUserForm.introduction"
        >
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer" center>
      <el-button @click="onClose">取 消</el-button>
      <el-button
        type="primary"
        @click="passwordShow ? onSave() : onChange()"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import { add, update } from '@/api/base/users'
import { userInfo } from 'os'
export default {
  name: 'addUser',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    permissionGroup: {
      type: Array,
      required: true,
    },
    userInfo: {
      type: Object,
      require: true,
    },
    passwordShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      addUserForm: {
        avatar: '',
        email: '',
        introduction: '',
        password: '',
        permission_group_id: '',
        phone: '',
        role: '',
        username: '',
      },
      addUserFormRules: {
        username: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          },
        ],
        email: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: '用户名不能为空',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {},
  mounted: {},
  methods: {
    onClose() {
      this.addUserForm = {}
      this.$emit('update:visible', false)
    },
    async onSave() {
      try {
        this.$refs.addUserForm.validate()
        const res = await add(this.addUserForm)
        this.$message.success('添加成功')
      } catch (err) {}
      this.onClose()
    },
    async onChange() {
      try {
        await update({
          email: this.addUserForm.email,
          id: this.addUserForm.id,
          introduction: this.addUserForm.introduction,
          permission_group_id:
            this.addUserForm.permission_group_id,
          phone: this.addUserForm.phone,
          role: this.addUserForm.role,
          username: this.addUserForm.username,
        })
        this.onClose()
        this.$emit('getUserList')
        this.$message.success('修改成功')
      } catch (err) {}
    },
  },
  computed: {},
  watch: {
    userInfo: {
      handler(newVal) {
        if (newVal.email) {
          this.addUserForm = newVal
        }
      },
    },
  },
  mounted() {},
  components: {},
}
</script>
<style scoped lang="less">
/deep/.el-dialog__footer {
  text-align: center;
}
</style>
