import { ConsultType } from '@/enums'
import type { PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
    'cp-consult',
    () => {
        // 设置问诊类型
        const consult = ref({})
        // 1.问诊记录状态
        const setType = (type) => {
            consult.value.type = type
        }
        // 2.修改问诊类型
        const setIllnesType = (type: 0 | 1) => {
            consult.value.illnessType = type
        }
        // 3.修改科室
        const setDep = (id) => {
            consult.value.depId = id
        }
        // 4.修改病情描述相关信息
        const setIllness = (illness: 'illnessDesc' | 'illnessTime' | 'consultFlag' | 'pictures') => {
            consult.value.illnessDesc = illness.illnessDesc
            consult.value.illnessTime = illness.illnessTime
            consult.value.consultFlag = illness.consultFlag
            consult.value.pictures = illness.pictures
        }
        // 5.修改患者
        const setPatient = (id) => {
            consult.value.patientId = id
        }
        // 修改优惠券
        const setCoupon = (id) => {
            consult.value.couponId = id
        }
        // 7.清空记录
        const clear = () => {
            consult.value = {}
        }
        return { consult, setType, setIllnesType, setDep, setIllness, setPatient, setCoupon, clear }
    },
    {
        persist: true
    }
)
