import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from "@/stores"
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({
  showSpinner: false
})
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/Login/index.vue'), meta: { title: '登录' } },
    {
      path: '/', component: () => import('@/views/Layout/index.vue'),
      children: [
        { path: '/home', component: () => import('@/views/Home/index.vue'), meta: { title: '首页' } },
        { path: '/article', component: () => import('@/views/Article/index.vue'), meta: { title: '健康百科' } },
        { path: '/notify', component: () => import('@/views/Notify/index.vue'), meta: { title: '消息中心' } },
        { path: '/user', component: () => import('@/views/User/index.vue'), meta: { title: '我的' } }
      ]
    },
    {
      path: '/user/patient',
      component: () => import('@/views/User/PatientPage.vue'),
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: () => import('@/views/Consult/ConsultFast.vue'),
      meta: { title: '极速问诊' }
    }
  ]
})

router.beforeEach((to) => {
  NProgress.start()
  document.title = `优医问诊-${to.meta.title}`
  NProgress.done()
  const store = useUserStore()
  const bai = ['/login']
  if (!store.user?.token && !bai.includes(to.path)) return '/login'
})
export default router
