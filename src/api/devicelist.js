import axios from '@/libs/api.request'
//获取产品列表
export const getDeviceList = ({pageNum, pageSize}) => {
  return axios.request({
    url: 'product/pageByProduct',
    data: {
      pageNum,
      pageSize,
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
//编辑产品信息
export const updateDevice = (data) => {
  return axios.request({
    url: 'product/update',
    data: {
      ...data
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
//新增产品
export const insertDevice = (data) => {
  return axios.request({
    url: 'product/insert',
    data: {
      ...data
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
