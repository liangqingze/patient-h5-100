<script setup lang="ts">
defineProps<{
  options: {
    label: string;
    value: number | string;
  }[];
  modelValue?: number | string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value);
}>();
</script>

<template>
  <div class="cp-radio-btn">
    <a
      :class="{ active: modelValue === item.value }"
      class="item"
      v-for="item in options"
      :key="item.value"
      href="javascript:;"
      @click="emit('update:modelValue',item.value)"
      >{{ item.label }}</a
    >
  </div>
</template>

<style lang="scss" scoped>
.cp-radio-btn {
  display: flex;
  flex-wrap: wrap;
  .item {
    height: 32px;
    min-width: 60px;
    line-height: 30px;
    padding: 0 14px;
    text-align: center;
    border: 1px solid #fff;
    background-color: #f6f7fa;
    margin-right: 10px;
    box-sizing: border-box;
    color: var(--cp-text2);
    margin-bottom: 10px;
    border-radius: 4px;
    transition: all 0.3s;
    &.active {
      border-color: #378b7a;
      background-color: #ecf9f7;
    }
  }
}
</style>
