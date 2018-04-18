// 需要权限访问的完整路由表
// 获取权限后和该表匹配的则被加入到正式路由中。该表必须完整的包含工程页面
// path 页面跳转地址
// permission字段内容从后台获取，代表该页内部详细权限，以key:value形式存储
//首页
const defaultLayout = resolve => require(['@/components/home/layout'], resolve)
const dashboard = resolve => require(['@/components/home/Dashboard'], resolve)
//商户管理
const merchantlist = resolve => require(['@/components/merchantmanage/merchantlist'], resolve)
const financialdetails = resolve => require(['@/components/merchantmanage/financialdetails'], resolve)
//用户管理
const userslist = resolve => require(['@/components/clientmanage/userslist'], resolve)
const useraudit = resolve => require(['@/components/clientmanage/useraudit'], resolve)
const waitcliamlist = resolve => require(['@/components/clientmanage/waitcliamlist'], resolve)
const finalauditlist = resolve => require(['@/components/clientmanage/finalauditlist'], resolve)
const cusservicelist = resolve => require(['@/components/clientmanage/cusservicelist'], resolve)
//借款管理
const borrowinglist = resolve => require(['@/components/borrowingmanage/borrowinglist'], resolve)
const borrowingrecord = resolve => require(['@/components/borrowingmanage/borrowingrecord'], resolve)
const refundlist = resolve => require(['@/components/borrowingmanage/refundlist'], resolve)
const refundrecord = resolve => require(['@/components/borrowingmanage/refundrecord'], resolve)
//代理管理
const proxylist = resolve => require(['@/components/proxylist/proxylist'], resolve)
const proxyplatfrom = resolve => require(['@/components/proxylist/proxyplatfrom'], resolve)
//统计管理
const serviceDataStatis = resolve => require(['@/components/statistics/serviceDataStatis'], resolve)
const aduitDataStatis = resolve => require(['@/components/statistics/aduitDataStatis'], resolve)


//系统管理
const listAccounts = resolve => require(['@/components/settingsAmend/listAccounts'], resolve)

//贷后管理
const remindList = resolve => require(['@/components/postLoanManage/remindList'], resolve)
const loanCollectList = resolve => require(['@/components/postLoanManage/loanCollectList'], resolve)

//
const asyncRouter = [{
  path: '/asyncRouter',
  component: defaultLayout,
  children: []
}, {
  path: '/dashboard',
  meta: {
    permission: []
  },
  component: dashboard,
}, {
  path: '/merchantlist',
  meta: {
    permission: []
  },
  component: merchantlist
}, {
  path: '/financialdetails',
  meta: {
    permission: []
  },
  component: financialdetails
}, {
  path: '/userlist',
  meta: {
    permission: []
  },
  component: userslist
}, {
  path: '/useraudit',
  meta: {
    permission: []
  },
  component: useraudit
}, {
  path: '/finalauditlist',
  meta: {
    permission: []
  },
  component: finalauditlist
}, {
  path: '/cusservicelist',
  meta: {
    permission: []
  },
  component: cusservicelist
}, {
  path: '/waitcliamlist',
  meta: {
    permission: []
  },
  component: waitcliamlist
}, {
  path: '/borrowinglist',
  meta: {
    permission: []
  },
  component: borrowinglist
}, {
  path: '/borrowingrecord',
  meta: {
    permission: []
  },
  component: borrowingrecord
}, {
  path: '/refundlist',
  meta: {
    permission: []
  },
  component: refundlist
}, {
  path: '/refundrecord',
  meta: {
    permission: []
  },
  component: refundrecord
}, {
  path: '/listAccounts',
  meta: {
    permission: []
  },
  component: listAccounts
}, {
  path: '/proxylist',
  meta: {
    permission: []
  },
  component: proxylist
}, {
  path: '/proxyplatfrom',
  meta: {
    permission: []
  },
  component: proxyplatfrom
}, {
  path: '/loanCollectDayBeforeList',
  meta: {
    permission: []
  },
  component: remindList
}, {
  path: '/loanCollectList',
  meta: {
    permission: []
  },
  component: loanCollectList
},{
  path: '/serviceDataStatis',
  meta: {
    permission: []
  },
  component: serviceDataStatis
},{
  path: '/aduitDataStatis',
  meta: {
    permission: []
  },
  component: aduitDataStatis
},
]
export default asyncRouter
