var data = [
  {
    iconCls: 'iconfont icon-fenlei',
    name: '商户管理',
    child: [{
      iconCls: 'iconfont icon-shanghuguanli',
      name: '我的商户',
      path: '/merchantlist',
    },
      {
        iconCls: 'iconfont icon-shouyi1',
        name: '资金明细',
        path: '/financialdetails',
      }
    ]
  },
  {
    iconCls: 'iconfont icon-shanghuguanli',
    name: '客户管理',
    child: [

      {
        iconCls: 'iconfont icon-qihuo',
        name: '用户审核',
        path: '/useraudit',

      },
      {
        iconCls: 'iconfont icon-guyou',
        path: '/userlist',
        name: '用户列表'
      },
    ]
  },
  {
    iconCls: 'iconfont icon-caijingrili',
    name: '借款管理',
    child: [{
      iconCls: 'iconfont icon-zijinzouxiang',
      path: '/borrowinglist',
      name: '借款列表'
    }, {
      iconCls: 'iconfont icon-zijinzouxiang',
      path: '/borrowingrecord',
      name: '借款记录'
    }, {
      iconCls: 'iconfont icon-rongzirongquan',
      path: '/refundlist',
      name: '还款列表'
    }, {
      iconCls: 'iconfont icon-rongzirongquan',
      path: '/refundrecord',
      name: '还款记录'
    },]
  },
  // {
  //     iconCls: 'iconfont icon-pic',
  //     name: '代理管理',
  //     child: [{
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/agentslist',
  //         name: '代理列表'
  //     }, {
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/agentplatforms',
  //         name: '代理平台'
  //     }]
  // },
  // {
  //     iconCls: 'iconfont icon-pic',
  //     name: '催收管理',
  //     child: [{
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/collectioncompound',
  //         name: '催收比例配制'
  //     }, {
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/collectionapply',
  //         name: '催收延期申请'
  //     }, {
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/collectionmemo',
  //         name: '催收备忘录'
  //     }, {
  //         iconCls: 'iconfont icon-jifen',
  //         path: '/collectionmemo',
  //         name: '冻结列表'
  //     }]
  // }, {
  //     iconCls: 'iconfont icon-set',
  //     name: '数据统计',
  //     child: [{
  //         iconCls: 'iconfont icon-category',
  //         path: '/statisticslist',
  //         name: '统计列表'
  //     }, ]
  // },

  {
    iconCls: 'iconfont icon-xitongguanli1',
    name: '系统管理',
    child: [{
      iconCls: 'iconfont icon-zhanghuliebiao',
      path: '/listAccounts',
      name: '账户列表'
    },]
  }
]

export default [{
  path: '/user/navlist',
  data: data
}]
