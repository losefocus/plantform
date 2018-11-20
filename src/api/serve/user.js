import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/order/userService/list',
    method: 'get',
    params: query
  })
}
