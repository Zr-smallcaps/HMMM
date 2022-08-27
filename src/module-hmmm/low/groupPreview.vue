<template>
  <div></div>
</template>

<script>
import clButton from "./button.vue";
export default {
  data() {
    return {};
  },
  props: {
    preMsg: {
      type: {
        type: Object,
        require: true,
      },
    },
  },
  created() {},

  methods: {},
  components: {
    clButton,
  },
};
</script>

<style scoped></style>
