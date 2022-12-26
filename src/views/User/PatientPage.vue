<script setup lang="ts">
import { addPatient, delePatient, getPatientList, updatePatient } from "@/services/user";
import type { Patient } from "@/types/user";
import { showConfirmDialog, showSuccessToast, showToast } from "vant";
import { get } from "vant/lib/utils";
import { computed, ref } from "vue";
import { onMounted } from "vue";
import Validator from "id-validator";

const list = ref([]);
const loadList = async () => {
  const res = await getPatientList();
  list.value = res.data;
};
onMounted(() => {
  loadList();
});

// 弹出层相关逻辑
const options = [
  { label: "男", value: 1 },
  { label: "女", value: 0 },
];
const show = ref(false);
const showPopup = (item?: Patient) => {
  // 编辑
  if (item) {
    const { id, idCard, name, gender, defaultFlag } = item;
    patient.value = { id, idCard, name, gender, defaultFlag };
  } else {
    // 添加
    // 重置表单
    patient.value = { ...initPatient };
  }
  show.value = true;
};

// 表单数据
const initPatient:Patient = {
  name: "",
  idCard: "",
  gender: 1,
  defaultFlag: 0,
};
const patient = ref<Patient>({ ...initPatient });

const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag === 1;
  },
  set(val) {
    patient.value.defaultFlag = val ? 1 : 0;
  },
});

// 添加患者
const submit = async () => {
  if (!patient.value.name) return showToast("请输入姓名");
  if (!patient.value.idCard) return showToast("请输入身份证号");
  const validate = new Validator();
  if (!validate.isValid(patient.value.idCard)) showToast("身份证不正确");
  const info = validate.getInfo(patient.value.idCard);
  if (info.sex !== patient.value.gender) return showToast("性别与身份证不符");

  // 通过id决定请求 编辑接口 还是 添加接口
  patient.value.id
    ? await updatePatient(patient.value)
    : await addPatient(patient.value);
  show.value = false;
  loadList();
  showToast(patient.value.id ? "编辑患者信息成功" : "添加患者成功");
};

// 删除
const remove = async (id:number) => {
  await showConfirmDialog({
    title: "温馨提示",
    message: `您确认要删除 ${patient.value.name} 患者信息吗 ？`,
  });
  await delePatient(id);
  showSuccessToast('删除成功');
  show.value = false
  loadList()
};
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6})(?:\d+)(.{4})$/, "\$1******\$2")
          }}</span>
          <span>{{ item.idCard }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="showPopup(item)">
          <cp-icon name="user-edit" />
        </div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" @click="showPopup()">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip" v-if="list.length < 6">最多可添加 6 人</div>
    </div>

    <van-popup v-model:show="show" position="right">
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @click-right="submit"
      ></cp-nav-bar>
      <van-form autocomplete="off">
        <van-field
          v-model="patient.name"
          label="真实姓名"
          placeholder="请输入真实姓名"
        />
        <van-field
          v-model="patient.idCard"
          label="身份证号"
          placeholder="请输入身份证号"
        />
        <van-field label="性别">
          <!-- 单选按钮组件 -->
          <template #input>
            <cp-radio-btn
              v-model="patient.gender"
              :options="options"
            ></cp-radio-btn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox v-model="defaultFlag" round />
          </template>
        </van-field>
      </van-form>

      <van-action-bar v-if="patient.id" @click="remove(patient.id)">
        <van-action-bar-button>删除</van-action-bar-button>
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
.patient-page {
  padding: 46px 0 80px;
  ::v-deep() {
    .van-popup {
      width: 100%;
      height: 100%;
    }
  }
}
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: red;
    background-color: #f6f7fa;
  }
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #f6f7fa;
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: #c5c6c9;
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: #12c39e;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: #41b49d;
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: #878687;
  padding: 12px 0;
}
</style>
