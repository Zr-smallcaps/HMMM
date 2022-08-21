<template>
  <div class="container">
    <el-dialog @close="onClose" :title="dialogTitle" :visible="visible" width="30%">
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="所属学科" prop="subjectID">
          <el-select
            v-model="formData.subjectID"
            placeholder="请选择"
            style="width: 100%"
          >
            <el-option
              v-for="item in selectData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签名称" prop="tagName">
          <el-input
            v-model="formData.tagName"
            placeholder="请输入标签名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="onClose">取 消</el-button>
        <el-button type="primary" @click.native="onSave">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { simple } from '@/api/hmmm/subjects'
import { add, update } from "@/api/hmmm/tags";
export default {
  name: "",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      formData: {
        subjectID: "",
        tagName: "",
        id: "",
      },
      formRules: {
        subjectID: [
          { required: true, message: "请选择所属学科", trigger: "change" },
        ],
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" },
        ],
      },
      selectData: [],
    };
  },
  created() {
    this.getSimpleList();
  },
  methods: {
    onClose() {
      this.$emit("update:visible", false);
      this.$refs.form.resetFields();
      this.formData = {
        subjectID: "",
        tagName: "",
        id: "",
      };
    },
    async getSimpleList() {
      const { data } = await simple();
      this.selectData = data
    },
    async onSave() {
      await this.$refs.form.validate();
      if (this.formData.id) {
        await update(this.formData);
        this.$message.success("修改成功");
        this.onClose();
        this.$emit("add-success");
      } else {
        await add(this.formData);
        this.$message.success("新增成功");
        this.onClose();
        this.$emit("add-success");
      }
    },
    getIptValue(val) {
      this.formData.subjectID = val.subjectID;
      this.formData.tagName = val.tagName;
      this.formData.id = val.id;
    },
  },
  computed: {
    dialogTitle() {
      return this.formData.id ? '修改目录' : '新增目录'
    },
  },
  components: {},
};
</script>
<style lang="less" scoped></style>
