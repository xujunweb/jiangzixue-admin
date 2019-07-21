import axios from '@/libs/api.request'
//获取工单列表
export const getWorkList = ({pageNum, pageSize, type = '', device_no, fault_type = ''}) => {
  return axios.request({
    url: 'faultFeedback/pageByFaultFeedback',
    data: {
      pageNum,
      pageSize,
      type,
      device_no,
      fault_type,
      user_id:app.$store.state.user.token==100000000?'':app.$store.state.user.token,
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
//标记已处理
export const updateWork = ({id}) => {
  return axios.request({
    url: 'faultFeedback/update',
    data: {
      id,
    },
    headers:{
      "ticket":app.$store.state.user.token
    },
    method: 'post'
  })
}
