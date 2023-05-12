<template>
  <!-- trigger="click" -->
  <a-tooltip :title="title" :overlayClassName="isDefault ? 'tips' : ''">
    <slot></slot>
  </a-tooltip>
</template>

<script lang="ts">
export default {
  name: "Tooltips",
};
</script>
<script setup lang="ts">
const props = defineProps({
  title: String,
  isDefault: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss">
.tips {
  .ant-tooltip-inner,
  .ant-tooltip-arrow-content {
    background: #fff;
    color: var(--ant-primary-color);
    font-size: 1rem;
    border-radius: 3px;
  }
}
</style>
