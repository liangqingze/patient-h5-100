import type { User, CodeType, PatientList } from "@types/user"
import { request } from "@/utils/request"
// 登录接口
export const loginByPassword = (mobile: string, password: string) => {
    return request<User>('login/password', 'post', { mobile, password })
}

// 短信接口
export const sendMobileCode = (mobile: string, type: CodeType) => {
    return request('code', 'get', { mobile, type })
}

// 短信登录
export const loginByMobile = (mobile: string, code: string) => {
    return request('login', 'post', { mobile, code })
}

// 获取个人信息
export const getUserInfo = () => {
    return request('patient/myUser')
}

// 患者信息
export const getPatientList = () => {
    return request<Patient[]>('patient/mylist')
}

// 添加患者信息
export const addPatient = (patient: Patient) => {
    return request('patient/add', 'post', patient)
}

// 编辑患者信息
export const updatePatient = (patient: Patient)=>{
    return request(`patient/update`,'put',patient)
}

// 删除患者信息
export const delePatient = (id: string) => {
    return request(`patient/del/${id}`,'DELETE')
}