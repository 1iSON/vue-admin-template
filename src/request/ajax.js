// 引入axios
import axios from 'axios'
import _this from '../main'
import {
  Loading,
  Message
} from 'element-ui';
import qs from 'qs'
import {baseUrl} from './env'

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;
// 请求拦截器
axios.interceptors.request.use(config => {
  // 发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error && error.response) {
    console.log('error====', error)
    switch (error.response.status) {
      case 400:
        error.message = '错误请求'
        break;
      case 401:
        error.message = '未授权，请重新登录'
        break;
      case 403:
        error.message = '拒绝访问'
        break;
      case 404:
        error.message = '请求错误,未找到该资源'
        break;
      case 405:
        error.message = '请求方法未允许'
        break;
      case 408:
        error.message = '请求超时'
        break;
      case 500:
        error.message = '服务器端出错'
        break;
      case 501:
        error.message = '网络未实现'
        break;
      case 502:
        error.message = '网络错误'
        break;
      case 503:
        error.message = '服务不可用'
        break;
      case 504:
        error.message = '网络超时'
        break;
      case 505:
        error.message = 'http版本不支持该请求'
        break;
      default:
        error.message = `连接错误${error.response.status}`
    }
  } else {
    error.message = "连接到服务器失败"
  }
  Message({
    type: 'error',
    message: error.message || '服务器故障,请稍候再试！'
  })
  return Promise.resolve(error.response)
})

axios.defaults.baseURL = baseUrl || '/api'
//设置默认请求头
axios.defaults.headers = {
  'X-Requested-With': 'XMLHttpRequest',
  'Content-Type': 'application/x-www-form-urlencoded'
}
axios.defaults.timeout = 10000
export default {
  //get请求
  get(url, param = {}) {
    // 默认请求时不使用全屏的loading 单独需要使用再传true值
    if (param.loading) Loading.service();
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
        headers: {
          'token': window.sessionStorage.loginToken
        }
      }).then(res => {
        if (param.loading) Loading.service().close();
        if (res && res.status === 200) {
          if (res.data.status === 200) {
            resolve(res.data)
          } else {
            Message({
              type: 'error',
              message: res.data.msg || '服务器开小差了，请联系管理员！'
            })
            reject(res)
            // if (res.data.status === 601) {
            //   _this.$router.replace('/')
            // }
          }
        } else {
          reject(res)
        }
      })
    }).catch(err => {
      console.log('出错了', err)
    })
  },
  //post请求
  post(url, param, type = 'application/x-www-form-urlencoded') {
    // Loading.service();
    let json;
    if (type === 'application/json') {
      json = true
    }
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url,
        data: json ? param : qs.stringify(param),
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
        headers: {
          'token': window.sessionStorage.loginToken,
          'Content-Type': type

        }
      }).then(res => {
        // Loading.service().close();
        if (res && res.status === 200) {
          if (res.data.status === 200) {
            resolve(res.data)
          } else {
            Message({
              type: 'error',
              message: res.data.msg || '服务器开小差了，请联系管理员！'
            })
            if (res.data.status === 601) {
              sessionStorage.loginToken = '';
              _this.$store.commit('LOGINTOKEN', '');
              setTimeout(() => {
                _this.$router.replace('/login');
              }, 1000)
            }
            reject(res.data);
          }
        } else {
          reject(res)
        }
      })
    }).catch(err => {
      console.log('出错了==>>', err)
    })
  },

  downPost(url, param) {
    return axios({
      method: 'get',
      url,
      params: param,
      responseType: 'blob',
      cancelToken: new CancelToken(c => {
        cancel = c
      }),
      headers: {
        'token': window.sessionStorage.loginToken,
        "Content-Disposition": "attachment;filename=qr.zip",
        'Content-Type': 'application/octet-stream',
      }
    }).then(res => {
      return res;
      // resolve(res);
    })
  },
//post请求
  async post2(url, param) {
    // Loading.service();
    try {
      const {data: res} = await axios({
        method: 'post',
        url,
        data: qs.stringify(param),
        cancelToken: new CancelToken(c => {
          cancel = c
        }),
        headers: {
          'token': window.sessionStorage.loginToken
        }
      });
      if (res && res.status === 200) {
        return res;
      } else {
        Message({
          type: 'error',
          message: res.msg || '服务器开小差了，请联系管理员！'
        });
        if (res.statu === 601) {
          sessionStorage.loginToken = '';
          _this.$store.commit('LOGINTOKEN', '');
          setTimeout(() => {
            _this.$router.replace('/login');
          }, 1000)
        }
        return res
      }
    } catch (err) {
      console.log('错误===>>', err)
    }
  },
}
