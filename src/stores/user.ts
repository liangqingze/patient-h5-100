import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore('user', () => {
    const user = ref<User>() // 用户信息
    // 设置用户信息
    const setUser = (u: User) => {
        user.value = u
    }
    // 删除用户信息
    const delUser = () => {
        user.value = undefined
    }
    return { user, setUser, delUser }
}, { persist: true })