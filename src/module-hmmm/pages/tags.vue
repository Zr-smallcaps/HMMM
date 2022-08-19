<template>
  <div class="tags-container">
    <el-card class="box-card">
      <!-- 头部 -->
      <el-row>
        <!-- 搜索框 -->
        <el-col :span="18">
          <el-form
            :model="formInline"
            :inline="true"
            class="demo-form-inline"
            label-width="80px"
          >
            <el-form-item label="标签名称">
              <el-input v-model.trim="formInline.keywords"></el-input>
            </el-form-item>

            <el-form-item label="状态">
              <el-select v-model="formInline.selected" placeholder="请选择">
                <el-option
                  v-for="item in selectState"
                  :key="item.state"
                  :label="item.value"
                  :value="item.state"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button size="small" @click.native="clear">清除</el-button>
              <el-button size="small" type="primary" @click.native="search"
                >搜索</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
        <!-- 新增按钮 -->
        <el-col style="text-align: right" :span="6">
          <el-button
            @click.native="add"
            icon="el-icon-edit"
            size="small"
            type="success"
            >新增标签</el-button
          >
        </el-col>
      </el-row>

      <!-- 消息提示 -->
      <el-alert
        :title="`数据一共${totalCount}条-----左航宇`"
        type="info"
        show-icon
        :closable="false"
        style="margin-bottom: 15px"
      >
      </el-alert>

      <!-- 表格 -->
      <el-table
        class="operation"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#FAFAFA' }"
      >
        <el-table-column type="index" label="序号" width="80">
        </el-table-column>
        <el-table-column
          v-for="(item, index) in tableTltle"
          :key="index"
          :prop="item.name"
          :label="item.lable"
        >
        </el-table-column>
        <el-table-column
          prop="addDate"
          label="创建日期"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="{ row }">
            {{ row.state === 1 ? "已启用" : "已禁用" }}
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="150">
          <template v-slot="{ row }">
            <el-button type="text" @click="changeState(row)">
              {{ row.state === 1 ? "禁用" : "启用" }}
            </el-button>
            <el-button
              @click.native="showEdit(row)"
              :disabled="row.state === 0"
              type="text"
              >修改</el-button
            >
            <el-button
              @click.native="delTags(row)"
              :disabled="row.state === 0"
              type="text"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        background
        @size-change="onPageSizeChange"
        @current-change="onPageChange"
        :current-page="Number(paginationPage)"
        :total="Number(totalCount)"
        :page-size="Number(paginationPagesize)"
        :page-sizes="[5, 10, 20, 50]"
        layout="prev, pager, next, sizes, jumper"
        style="margin-top: 20px; text-align: right"
        hide-on-single-page
      >
      </el-pagination>

      <!-- 添加弹层 -->
      <TagsDialog
        ref="TagsDialog"
        :visible.sync="dialogFormVisible"
        @add-success="getTagsList"
      />
    </el-card>
  </div>
</template>

<script>
import { list, changeState, remove } from "@/api/hmmm/tags.js";
import TagsDialog from "../components/tagsDialog.vue";
import dayjs from "dayjs";

export default {
  data() {
    return {
      tableData: [],
      tableTltle: [
        {
          name: "subjectName",
          lable: "所属学科",
        },
        {
          name: "tagName",
          lable: "标签名称",
        },
        {
          name: "username",
          lable: "创建者",
        },
      ],
      selectState: [
        {
          value: "启用",
          state: 1,
        },
        {
          value: "禁用",
          state: 0,
        },
      ],
      formInline: {
        keywords: "",
        selected: "",
      },
      totalCount: 0,
      paginationPage: 1,
      paginationPagesize: 10,
      dialogFormVisible: false,
    };
  },
  created() {
    this.getTagsList();
  },
  methods: {
    add() {
      this.dialogFormVisible = true;
    },
    async search() {
      if (this.formInline.keywords === "" && this.formInline.selected === "") {
        return this.getTagsList();
      } else {
        const { data } = await list({
          tagName: this.formInline.keywords,
          state: this.formInline.selected,
          page: 1,
          pagesize: 10,
        });
        this.tableData = data.items;
        this.totalCount = data.counts;
      }
    },
    clear() {
      this.formInline = {};
    },
    async getTagsList() {
      const { data } = await list({
        page: this.paginationPage,
        pagesize: this.paginationPagesize,
      });
      this.tableData = data.items;
      this.totalCount = data.counts;
    },
    dateFormat(row, column) {
      let date = row[column.property];
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    },
    async changeState(row) {
      if (row.state === 0) {
        row.state = 1;
      } else if (row.state === 1) {
        row.state = 0;
      }
      await changeState(row);
      this.$message.success("操作成功");
    },
    showEdit(val) {
      this.dialogFormVisible = true;
      this.$refs.TagsDialog.getIptValue(val);
    },
    async delTags(val) {
      try {
        await this.$confirm("此操作将永久删除该标签, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        });
        await remove(val);
        this.$message.success("删除成功");
        this.getTagsList();
      } catch (error) {
        console.log(error);
      }
    },
    // 进入某一页
    onPageChange: function (pageNum) {
      this.paginationPage = pageNum;
      this.getTagsList();
    },
    // 每页显示信息条数
    onPageSizeChange: function (pageSize) {
      this.paginationPagesize = pageSize;
      this.getTagsList();
    },
  },
  components: {
    TagsDialog,
  },
};
</script>

<style scoped lang="less">
.tags-container {
  padding: 10px;

  /deep/.el-table th.is-leaf {
    border-bottom: 2px solid #e8e8e8;
  }
}
</style>
