import Api from '@/api'
import sessionStorage from '@/storage/sessionStorage'

const state = {
  // 权限获取方式： 每次跳页获取(pageChange)，暂时无法实现，因router未提供覆盖事件 / 登录后一次性获取(login) default:login
  // mode: 'login',
  // 完整权限列表（菜单列表）
  list: []
}

const getters = {}

const mutations = {
  // setMode: (state, data) => {
  //   state.mode = data
  // },
  setList: (state, data) => {
    state.list = data
  }
}

const actions = {
  // 获取权限列表
  getPermission({commit, rootState}) {
    return new Promise((resolve, reject) => {
      let tokenId = rootState.tokenId;
      Api.testApi.getMenuList({tokenId}).then(res => {
        // 存储权限列表
        if (res.code == '0000') {
          let dataMenu = res.data.menu;
          // console.log('dataMenu', dataMenu)
          let homes = {
            name: '首页',
            iconCls: 'iconfont icon-fenlei',
            path: '/dashboard',
          }
          dataMenu.unshift(homes)
          commit('setList', dataMenu)
          resolve(dataMenu)
        }
      }).catch(() => {
        reject()
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
