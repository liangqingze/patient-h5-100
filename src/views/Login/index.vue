<script setup>
import { ref } from "vue";
import { mobileRules, passwordRules, codeRules } from "@/utils/rules";
import { showToast, showSuccessToast,type FormInstance } from "vant";
import { loginByPassword, sendMobileCode,loginByMobile } from "@/services/user";
import { useUserStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";

// 控制密码是否显示
const show = ref(false);
const agree = ref(false);

// 表单数据
const mobile = ref("");
const password = ref("");

const store = useUserStore();
const router = useRouter();
const route = useRoute();

// 登录
const login = async () => {
  if (!agree.value) return showToast("请同意用户协议");
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByMobile(mobile.value, code.value);
  store.setUser(res.data);
  router.replace((route.query.returnUrl as string) || "/user");
  mobile.value = "";
  password.value = "";
  agree.value = false;
  showSuccessToast("登录成功");
};

// 短信验证
const code = ref("");
const isPass = ref(true);
const time = ref(0);
const form = ref<FormInstance>();
let timeId:number
// 发送验证码
const send = async () => {
  if (time > 0) return;
  await form.value.validate("mobile");
  await sendMobileCode(mobile.value, 'login')
  showSuccessToast("验证码发送成功")
  
  time.value = 60;
  timeId = setInterval(() => {
    clearInterval(timeId);
    time.value--;
    if (time.value <= 0) clearInterval(timeId);
  }, 1000);
};
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <div class="login-head">
      <h3>{{ isPass ? "密码登录" : "短信验证码登录" }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ isPass ? "短信验证码登录" : "密码登录" }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>

    <!-- form 表单 -->
    <van-form @submit="login" ref="form">
      <van-field
        name="mobile"
        :rules="mobileRules"
        v-model="mobile"
        placeholder="请输入用户名"
      ></van-field>

      <van-field
        v-if="isPass"
        :rules="passwordRules"
        v-model="password"
        placeholder="请输入密码"
        :type="show ? 'text' : 'password'"
      >
        <template #button>
          <CpIcon
            @click="show = !show"
            :name="show ? 'login-eye-on' : 'login-eye-off'"
          ></CpIcon>
        </template>
      </van-field>
      <van-field
        v-else
        v-model="code"
        :rules="codeRules"
        placeholder="请输入短信验证码"
      >
        <template #button>
          <span class="btn-send" @click="send">{{
            time > 0 ? `${time}s后发送验证码` : "发送验证码"
          }}</span>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit"
          >登 录</van-button
        >
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    // padding-top: 46px;
  }
  &-head {
    padding: 30px 30px 50px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: #4fc9af;
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>