<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps<{
  title?: string;
  rightText?: string;
  back?: ()=>void
}>();
const emit = defineEmits<{
  (e: "click-right"): void;
}>();
const router = useRouter();

const onClikeLeft = () => {
    if(props.back) {
      return props.back()
    }
    // history.state?.back = 历史记录
    if (history.state?.back) {
        router.back();
    }else{
        router.push('/')
    }
};
const onClikeRight = () => {
  emit("click-right");
};
</script>
 
<template>
  <van-nav-bar
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClikeLeft"
    @click-right="onClikeRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped></style>
