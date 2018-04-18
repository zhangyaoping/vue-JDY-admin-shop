import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../storage/vuex'
import sessionStorage from '@/storage/sessionStorage'
import whiteList from './directAccess'
import asyncRouter from './asyncRouter'

Vue.use(VueRouter)

/**
 * 根据权限匹配路由
 * @param {array} permission 权限列表（菜单列表）
 * @param {array} asyncRouter 异步路由对象
 */

function routerMatch(permission, asyncRouter) {
  return new Promise((resolve) => {
    const routers = asyncRouter[0]

    // 创建路由
    function createRouter(permission) {
      permission.forEach((item) => {
        if (item.child && item.child.length) {
          // 递归
          createRouter(item.child)
        }
        let path = item.path
        // 循环异步路由，将符合权限列表的路由加入到routers中
        asyncRouter.find(function (s) {
          if (s.path == path) {
            s.meta.permission = item.permission
            routers.children.push(s)
            return
          }
        })
      })
    }
    createRouter(permission)
    resolve([routers])
  })
}

// 懒加载方式，当路由被访问的时候才加载对应组件
const login = resolve => require(['@/components/Login'], resolve)

//首页
const defaultLayout = resolve => require(['@/components/home/layout'], resolve)
const dashboard = resolve => require(['@/components/home/index'], resolve)
const merchantlist = resolve => require(['@/components/merchantmanage/merchantlist'], resolve)

const userinfo = resolve => require(['@/components/clientmanage/userinfo'], resolve)
const kong = resolve => require(['@/components/clientmanage/kong'], resolve)
const generalProxyList = resolve => require(['@/components/proxylist/generalProxyList'], resolve)
//401
const error401 = resolve => require(['@/components/error/error401'], resolve)
const error404 = resolve => require(['@/components/error/error404'], resolve)

// 默认路由表，不需要权限
const routes = [{
  path: '/',
  // 重定向
  redirect: '/dashboard'
},
  {
    path: '/login',
    component: login
  }, {
    path: '/error404',
    component: error404,
  },
  {
    path: '/defaultLayout',
    component: defaultLayout,
    meta: {
      permission: []
    },
    // 需要进行用户登录验证
    children: [
      {
        path: '/generalProxyList',
        component: generalProxyList,
        meta: {
          permission: []
        },
      },
      {
        path: '/userinfo',
        component: userinfo,
        name: "userinfo",
      }, {
        path: '/kong',
        component: kong,
        name: 'kong'
      }, {
        path: '/dashboard',
        name: '首页',
        meta: {
          permission: []
        },
        component: dashboard,
      },
    ],
  },
  {
    path: '/error401',
    component: error401,
  }
];

const router = new VueRouter({
  // mode: 'history',
  routes: routes
})

// 路由跳转前验证
router.beforeEach((to, from, next) => {
  // 判断用户是否登录
  if (sessionStorage.$getSessionStorageByName('tokenId')) {
    // console.log('token', sessionStorage.$getSessionStorageByName('tokenId'))
    // 如果当前处于登录状态，并且跳转地址为login，则自动跳回系统首页
    // 这种情况出现在手动修改地址栏地址时
    if (to.path === '/login') {
      router.replace('/dashboard')
      // console.log('dash')
    } else {
      // console.log('dash1')
      // 页面跳转前先判断是否存在权限列表，如果存在则直接跳转，如果没有则请求一次
      if (store.state.permission.list.length === 0) {
        // 获取权限列表，如果失败则跳回登录页重新登录
        store.dispatch('permission/getPermission').then(res => {
          // 匹配并生成需要添加的路由对象
          routerMatch(res, asyncRouter).then(res => {
            // console.log('ssionList', res)
            router.addRoutes(res);
            next(to.path)
          })
        }).catch(() => {
          console.log('登录错误')
          store.dispatch('user/logout').then(() => {
            router.replace('/login')
          })
        })
      } else {
        // 如果跳转页面存在于路由中则进入，否则跳转到404
        // 因为可以通过改变url值进行访问，所以必须有该判断
        if (to.matched.length) {
          if (whiteList.indexOf(to.path) < 0) {
            // store.dispatch('user/actionlog', to)
          }
          next()
        } else {
          router.replace('/error401')
        }
      }
    }
  } else {
    // 如果是免登陆的页面则直接进入，否则跳转到登录页面
    if (whiteList.indexOf(to.path) >= 0) {
      console.log('该页面无需登录即可访问')
      next()
    } else {
      console.log('请重新登录')
      router.replace('/login')
    }
  }
})

export default router
