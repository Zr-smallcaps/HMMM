<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="box-card">
        <el-row type="flex">
          <el-col>
            <el-row type="flex" justify="end">
              <el-button
                type="success"
                icon="el-icon-edit"
                style=""
                @click="addUser"
                >新增用户</el-button
              >
            </el-row>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },

  created() {},

  methods: {
    addUser() {},
  },
}
</script>

<style scoped lang="scss">
.dashboard-container {
  min-width: 900px;
}
</style>
