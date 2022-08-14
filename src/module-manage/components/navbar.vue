<template>
  <div>
    <el-row type="flex">
      <el-col>
        <slot name="left"></slot>
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="right" />
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'pageTools',
  props: {
    leftIcon: {
      type: String,
      default: 'el-icon-info',
    },
    isShowLeft: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {}
  },
  created() {},
  methods: {},
  computed: {},
  watch: {},
  mounted() {},
  components: {},
}
</script>
<style scoped lang="less"></style>
