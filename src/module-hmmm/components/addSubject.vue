<template>
  <div>
    <el-dialog title="新增学科" :visible="addSubjectVisible" @close="CloseFn">
      <el-form :model="form">
        <el-form-item label="学科名称" :label-width="formLabelWidth">
          <el-input v-model="addkeywords"></el-input>
        </el-form-item>
        <el-form-item label="好鸡肋的按钮">
          <!-- 开关按钮 -->

          <el-switch
            v-model="value"
            active-color="#13ce66"
            inactive-color="#ff4949"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="CloseFn">取 消</el-button>
        <el-button type="primary" @click="OnSaveFn">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { update } from "../../api/hmmm/subjects";
export default {
  name: "addSubject",
  data() {
    return {
      addkeywords: "1213",
      value: true,
      formLabelWidth: "100px",
      form: {},
      currentSubjectDate: {},
    };
  },
  props: {
    addSubjectVisible: {
      type: Boolean,
      required: true,
    },
    ModifySubjectData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {},
  computed: {},
  beforeMount() {},
  mounted() {},
  methods: {
    CloseFn() {
      console.log(this.addkeywords);
      this.$emit("update:addSubjectVisible", false);
      this.currentSubjectDate = {};
    },
    async OnSaveFn() {
      console.log(this.addkeywords);
      //this.currentSubjectDate = this.ModifySubjectData;
      if (!!this.ModifySubjectData.subjectName) {
        // 此时是修改
        console.log("8888");
        this.currentSubjectDate = this.ModifySubjectData;
        const res = await update({
          id: this.ModifySubjectData.id,
          subjectName: this.addkeywords,
          isFrontDisplay: 1,
        });
      } else {
        console.log();
        // 此时是添加
        this.$emit("update:addSubjectVisible", false);
        this.$emit("ChildAddkeywords", this.addkeywords);
        this.$emit("addSubjectList");
      }
    },
  },
  // 监听ModifySubjectData 数据
  watch: {
    ModifySubjectData: {
      deep: true,
      handler(value) {
        if (this.ModifySubjectData.subjectName) {
          this.addkeywords = value.subjectName;
        }
      },
    },
  },
};
</script>
<style lang="less" scoped></style>
