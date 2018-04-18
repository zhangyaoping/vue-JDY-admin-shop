import {axiosGet, axiosPost} from './baseApi'

// export const getTestList = (params,config)=>axiosGet('/getTestList',params,config);
// export const postTestList = (params,config)=>axiosPost('/sgw_system_web/sys/shop/getBaseInfo',params,config);


//mock接口
// export const postLoginSignIn = (params, config) => axiosPost('/login', params, config);
// export const getMenuList = (params, config) => axiosPost('/user/navlist', params, config);
//111111111
//获取验证码
export const postSendMessage = (params, config) => axiosPost('/login/sendMessage', params, config);
// export const postSendMessage = (params, config) => axiosPost('/login/sendDynamicMessage', params, config);
//登录接口
export const postLoginSignIn = (params, config) => axiosPost('/login/signIn', params, config);
//目录菜单
export const getMenuList = (params, config) => axiosGet('/common/menu', params, config);
//获取logo
export const getShopLogo = (params, config) => axiosGet('/login/getShopLogo', params, config);
//查询商户信息:
export const getBaseInfo = (params, config) => axiosPost('/sys/shop/getBaseInfo', params, config);
//  商户关闭分量
export const shopAllotSwitchCloseOrOpen = (params, config) => axiosPost('/sys/shop/shopAllotSwitchCloseOrOpen', params, config);
//提交参数配制
export const updateShopConfig = (params, config) => axiosPost('/sys/shop/updateShopConfig', params, config);
//商户充值申请:
export const rechargeProduct = (params, config) => axiosPost('/sys/shop/rechargeProduct', params, config);
//商户提现申请:
export const cashOutProduct = (params, config) => axiosPost('/sys/shop/cashOutProduct', params, config);
//验证码
export const sendMessage = (params, config) => axiosPost('sys/order/sendMessage', params, config);
//编辑还款配制
export const changeRepayConfig = (params, config) => axiosPost('/sys/shop/changeRepayConfig', params, config);

// 查询商户资金明细列表:
export const queryCostDetail = (params, config) => axiosPost('/sys/shop/queryCostDetail', params, config);
//用户列表查询:
export const cusList = (params, config) => axiosPost('/sys/cus/cusList', params, config);

//系统推广列表查询
export const sysPromotionList = (params, config) => axiosPost('/sys/cus/sysPromotionList', params, config);
//客服列表
export const cusServiceList = (params, config) => axiosPost('/sys/cus/cusServiceList', params, config);
//提交审核
export const subAnlyseCustomer = (params, config) => axiosPost('/sys/cus/subAnlyseCustomer', params, config);
//修改标签
export const changeLabel = (params, config) => axiosPost('/sys/cus/changeLabel', params, config);
//打回
export const repulseCus = (params, config) => axiosPost('/sys/cus/repulseCus', params, config);
//终审拒绝
export const refuseFinalAudit = (params, config) => axiosPost('/sys/cus/refuseFinalAudit', params, config);
//提交借贷认证上传图片
export const uploadLoanProve = (params, config) => axiosPost('/sys/cus/uploadLoanProve', params, config);

//用户审核列表查询:
export const cusAuthList = (params, config) => axiosPost('/sys/cus/cusAuthList', params, config);
//获取短信链接:
export const getlink = (params, config) => axiosPost('/sys/cus/getlink', params, config);
//审核人员认领:
export const claimCustomer = (params, config) => axiosPost('/sys/cus/claimCustomer', params, config);
//审核人员审核
export const auditCustomer = (params, config) => axiosPost('sys/cus/auditCustomer', params, config);
// 生成借条
export const artificiapay = (params, config) => axiosPost('sys/loan/artificiapay', params, config);
//查看用户信息:
export const getCusInfo = (params, config) => axiosPost('sys/cus/getCusInfo', params, config);
///  终审列表的
export const finalAuditlist = (params, config) => axiosPost('sys/cus/finalAuditlist', params, config);
// 修改用户信息:
export const changeCusInfo = (params, config) => axiosPost('sys/cus/changeCusInfo', params, config);

//查看联系人:
export const getContactInfo = (params, config) => axiosPost('sys/cus/getContactInfo', params, config);
//获取紧急联系人2
export const getLinkMan = (params, config) => axiosPost('sys/cus/getLinkMan', params, config);
//查看记录：
export const getCusRecord = (params, config) => axiosPost('sys/cus/getCusRecord', params, config);
//添加备注：
export const addCusRemark = (params, config) => axiosPost('sys/cus/addCusRemark', params, config);
//网贷黑名单
export const getTdBacklistInfo = (params, config) => axiosPost('sys/cus/getTdBacklistInfo', params, config);
//电商
export const getShopData = (params, config) => axiosPost('sys/cus/getShopData', params, config);
//手机运营商信息
export const getMhmobileDetailInfo = (params, config) => axiosPost('sys/cus/getMhmobileDetailInfo', params, config);
// 借贷宝
export const getCreditJiedaibaoInfo = (params, config) => axiosPost('sys/cus/getCreditJiedaibaoInfo', params, config);
// 今借到
export const getCreditJinjiedaoInfo = (params, config) => axiosPost('sys/cus/getCreditJinjiedaoInfo', params, config);
/// 手机通讯录数据
export const getCreditAddressInfo = (params, config) => axiosPost('sys/cus/getCreditAddressInfo', params, config);
//备注联系人
export const addLinkMan = (params, config) => axiosPost('sys/cus/addLinkMan', params, config);
//上传手机通讯录
export const upload = (params, config) => axiosPost('sys/cus/upload', params, config);

//网贷共享报告
export const getCreditWdgxInfo = (params, config) => axiosPost('sys/cus/getCreditWdgxInfo', params, config);
//借贷认证
export const getCusModuleInfo = (params, config) => axiosPost('sys/cus/getCusModuleInfo', params, config);

//查看自动审核信息：
export const getModuleInfo = (params, config) => axiosPost('sys/cus/getModuleInfo', params, config);
///推送消息
export const sendGeneralizeMessage = (params, config) => axiosPost('/sys/cus/sendGeneralizeMessage', params, config);

//获取借条信息
export const loanInfo = (params, config) => axiosPost('sys/loan/loanInfo', params, config);

//借款列表查询:
export const loanList = (params, config) => axiosPost('/sys/loan/loanList', params, config);
//借款记录列表
export const loanRecordList = (params, config) => axiosPost('/sys/loan/loanRecordList', params, config);
//打款审核（通过/不通过）:
export const auditUserPay = (params, config) => axiosPost('/sys/loan/auditUserPay', params, config);

//还款列表查询:
export const repayDetailList = (params, config) => axiosPost('/sys/loan/repayDetailList', params, config);

// 还款记录:
// export const repayLogList = (params, config) => axiosPost('/sys/loan/repayLogList', params, config);
export const logOrderCusRepayRenewalList = (params, config) => axiosPost('/sys/loan/logOrderCusRepayRenewalList', params, config);
//还款审核（通过/不通过）:
export const auditUserRepay = (params, config) => axiosPost('/sys/loan/auditUserRepay', params, config);
//新增还款流水记录
export const saveLogOrderCusRepay = (params, config) => axiosPost('/sys/loan/saveLogOrderCusRepay', params, config);
//新增续期流水记录
export const saveLogOrderCusRenewal = (params, config) => axiosPost('/sys/loan/saveLogOrderCusRenewal', params, config);

//用户列表
export const userList = (params, config) => axiosPost('sys/user/userList', params, config);
//是否推送开关
export const changeAllotSwith = (params, config) => axiosPost('/sys/user/changeAllotSwith', params, config);
//获取所有角色:
export const getAllRoles = (params, config) => axiosPost('sys/user/getAllRoles', params, config);
//添加用户:
export const addUser = (params, config) => axiosPost('/sys/user/addUser', params, config);
//修改用户:
export const changeUser = (params, config) => axiosPost('/sys/user/changeUser', params, config);
//删除用户:
export const delateUser = (params, config) => axiosPost('/sys/user/delateUser', params, config);
//修改密码:
export const changePwd = (params, config) => axiosPost('/sys/user/changePwd', params, config);
//重置密码:
export const resetPwd = (params, config) => axiosPost('/sys/user/resetPwd', params, config);

//获取运营人员
export const getoperactionInfo = (params, config) => axiosPost('/sys/proxy/getoperactionInfo', params, config);
//代理平台
export const proxyplatfrom = (params, config) => axiosPost('/sys/proxy/proxyplatfrom', params, config);
//代理列表
export const proxylist = (params, config) => axiosPost('/sys/proxy/proxylist', params, config);
//添加代理
export const addProxyUser = (params, config) => axiosPost('/sys/proxy/addProxyUser', params, config);
//编辑
export const updateProxy = (params, config) => axiosPost('/sys/proxy/updateProxy', params, config);
//获取权值
export const getsysProxyInfo = (params, config) => axiosPost('/sys/proxy/getsysProxyInfo', params, config);
//获取代理统计
export const proxyStatisticslist = (params, config) => axiosPost('/sys/proxy/proxyStatisticslist', params, config);
//////////////////////
//贷后管理
//提醒列表
export const loanCollectDayBeforeList = (params, config) => axiosPost('/sys/loanCollect/loanCollectDayBeforeList', params, config);
export const UpdateloanCollect = (params, config) => axiosPost('/sys/loanCollect/UpdateloanCollect', params, config);
//催收列表
export const loanCollectList = (params, config) => axiosPost('/sys/loanCollect/loanCollectList', params, config);
export const updateLoanDetailRemarks = (params, config) => axiosPost('/sys/loanCollect/updateLoanDetailRemarks', params, config);
export const getLoanCollects = (params, config) => axiosPost('/sys/loanCollect/getLoanCollects', params, config);

//统计管理
export const getServiceStatisList = (params, config) => axiosPost('/sys/statistics/getServiceStatisList', params, config);
export const statisticsReviewOfficer = (params, config) => axiosPost('/sys/statistics/statisticsReviewOfficer', params, config);
//首页
export const chargingList = (params, config) => axiosPost('/sys/statistics/chargingList', params, config);
//收费标准
export const getBillingDetails = (params, config) => axiosPost('/sys/statistics/getBillingDetails', params, config);

