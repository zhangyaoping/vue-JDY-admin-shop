var data = {
    'login': '@boolean',
    'validate': '@boolean',
    'message': '这里是登录提交后错误提示信息@increment',
    "userId": '@id',
    "userMobile": "15858108062",
    "realName": '@cname',
    "tokenId": '@guid'
}

export default [{
    path: '/login',
    data: data
}]