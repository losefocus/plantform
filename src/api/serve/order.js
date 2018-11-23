import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/order/order/list',
    method: 'get',
    params: query
  })
}


/* 列表 */
export function serviceList(query) {
  return request({
    url: '/tenant/order/service/list',
    method: 'get',
    params: query
  })
}