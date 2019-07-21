import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon:'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  // {
  //   path: '/userlist',
  //   name: 'userlist',
  //   meta: {
  //     access: [1],
  //     hide: true,
  //     icon: 'md-person',
  //     title: '用户管理'
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'userlist_page',
  //       name: 'userlist_page',
  //       meta: {
  //         access: [1],
  //         icon: 'md-person',
  //         title: '用户管理'
  //       },
  //       component: () => import('@/view/userlist/userlist.vue')
  //     }
  //   ]
  // },
  {
    path: '/system',
    name: 'system',
    meta: {
      hide: true,
      // access: [1],
      icon: 'md-settings',
      title: '系统设置'
    },
    component: Main,
    children: [
      {
        path: 'system_page',
        name: 'system_page',
        meta: {
          // access: [1],
          icon: 'md-settings',
          title: '系统设置'
        },
        component: () => import('@/view/system/system.vue')
      }
    ]
  },
  // {
  //   path: '/orderList',
  //   name: 'orderList',
  //   meta: {
  //     hide: true
  //   },
  //   component: Main,
  //   children: [
  //     {
  //       path: 'orderList_page',
  //       name: 'orderList_page',
  //       meta: {
  //         icon: 'md-reorder',
  //         title: '订单管理'
  //       },
  //       component: () => import('@/view/orderlist/orderlist.vue')
  //     }
  //   ]
  // },
  {
    path: '/devicelist',
    name: 'devicelist',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'devicelist_page',
        name: 'devicelist_page',
        meta: {
          icon: 'md-cog',
          title: '产品管理'
        },
        component: () => import('@/view/devicelist/devicelist.vue')
      }
    ]
  },
  {
    path: '/workList',
    name: 'workList',
    meta: {
      hide: true
    },
    component: Main,
    children: [
      {
        path: 'workList_page',
        name: 'workList_page',
        meta: {
          icon: 'md-list',
          title: '用户反馈'
        },
        component: () => import('@/view/worklist/worklist.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
