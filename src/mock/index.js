import Mock from 'mockjs'
import navlist from './navlist'
import login from './login'
let data = [].concat(navlist, login)

data.forEach(function(res) {
    Mock.mock(res.path, res.data)
})

export default Mock