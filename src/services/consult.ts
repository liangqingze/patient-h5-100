import type { FollowType, KnowledgePage, KnowledgeParams, PageParams } from "@/types/consult";
import { request } from "@/utils/request";

export const getKnowledgePage = (params: KnowledgeParams) => {
    return request('patient/home/knowledge', 'GET', params)
}

export const getDoctorPage = (params: PageParams) => {
    return request('home/page/doc', 'get', params)
}

export const followDoctor = (id: string, type: FollowType = 'doc') =>
    request('like', 'POST', { id, type })