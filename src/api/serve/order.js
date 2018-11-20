import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/order/order/list',
    method: 'get',
    params: query
  })
}
