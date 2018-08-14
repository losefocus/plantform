import request from '@/router/axios'

/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/tenant/article/list',
      method: 'get',
      params: query
    })
  }

    /* 详情 */
export function getObj(id) {
  return request({
    url: '/tenant/article/get?id='+id,
    method: 'get',
  })
}