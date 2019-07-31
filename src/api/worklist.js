import axios from '@/libs/api.request'
//获取咨询列表
export const getWorkList = (data) => {
  return axios.request({
    url: 'consultation/pageByConsultation',
    data,
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
//标记已处理
export const updateWork = ({id}) => {
  return axios.request({
    url: 'consultation/update',
    data: {
      id,
      visit:1,
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
