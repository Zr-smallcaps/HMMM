<template>
  <div class="container">
    <el-dialog
      title="题目预览"
      :visible="previewVisible"
      width="900"
      @close="closeFn"
    >
      <el-row>
        <el-col :span="6">
          <div class="grid-content">
            【题型】:{{ previewDetail.questionType | questionTypeFl }}题
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">【编号】:{{ previewDetail.id }}</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            【难度】:{{ previewDetail.difficulty | difficultyFl }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">【标签】:{{ previewDetail.tags }}</div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            【学科】:{{ previewDetail.subjectName }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            【目录】:{{ previewDetail.directoryName }}
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">【方向】:{{ previewDetail.direction }}</div>
        </el-col>
      </el-row>
      <hr />
      <el-col :span="24">
        <div class="grid-content">
          <div>【题干】:</div>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content">
          <div v-html="previewDetail.question"></div>
        </div>
        <hr />
      </el-col>
      <div v-if="radioCheckFlag">
        <!-- 单选题 -->
        <el-col :span="24">
          <div class="grid-content">
            <div>单选题 选项:(以下选中的选项为正确答案)</div>
          </div>
        </el-col>
        <el-radio-group v-model="previewDetail.isChoice">
          <el-col
            :span="24"
            v-for="item in previewDetail.options"
            :key="item.id"
          >
            <div class="grid-content">
              <el-radio :label="item.isRight">{{ item.title }}</el-radio>
            </div>
          </el-col>
        </el-radio-group>
      </div>
      <!-- 多选框 -->
      <div v-if="checkboxFlag">
        <el-col :span="24">
          <div class="grid-content">
            <div>多选题 选项:(以下选中的选项为正确答案)</div>
          </div>
        </el-col>
        <el-checkbox-group v-model="isChoiceArr">
          <el-col
            :span="24"
            v-for="item in previewDetail.options"
            :key="item.id"
          >
            <div class="grid-content">
              <el-checkbox :label="item.isRight">{{ item.title }}</el-checkbox>
            </div>
          </el-col>
        </el-checkbox-group>
      </div>

      <el-col :span="24">
        <div class="grid-content">
          【参考答案】: <el-button type="danger">视频答案预览</el-button>
        </div>
        <hr />
      </el-col>
      <el-col :span="24">
        <div class="grid-content">
          【答案解析】:<span v-html="previewDetail.answer"></span>
        </div>
      </el-col>
      <el-col :span="24">
        <div class="grid-content">
          【题目备注】:{{ previewDetail.chkRemarks }}
        </div>
      </el-col>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { status, difficulty, questionType } from "../../api/hmmm/constants.js";
export default {
  name: "",
  data() {
    return {
      radio: "",
      checkList: ["选中且禁用", "复选框 A"],
      radioCheckFlag: false,
      checkboxFlag: false,
      isChoiceArr: [1],
    };
  },
  props: {
    previewVisible: {
      type: Boolean,
      default: false,
    },
    previewDetail: {
      type: Object,
    },
  },
  components: {},
  computed: {},
  created() {},
  mounted() {},
  filters: {
    questionTypeFl(cellValue) {
      const current = questionType.find((item) => {
        return item.value === Number(cellValue);
      });
      // console.log(current)
      return current ? current.label : "未知";
    },
    difficultyFl(cellValue) {
      const current = difficulty.find((item) => {
        return item.value === Number(cellValue);
      });
      // console.log(current)
      return current ? current.label : "未知";
    },
  },
  methods: {
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    closeFn() {
      this.$emit("update:previewVisible", false);
    },
  },
  watch: {
    previewDetail: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.questionType === "1") {
          this.radioCheckFlag = true;
          this.checkboxFlag = false;
        }
        if (val.questionType === "2") {
          this.radioCheckFlag = false;
          this.checkboxFlag = true;
        }
      },
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 900px !important;
  hr {
    width: 900px;
    border-width: 1px;
  }
}
.el-row {
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
