import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/tenant/list',
    method: 'get',
    params: query
  })
}
/* 添加 */
export function addObj(obj) {
  return request({
    url: '/tenant/tenant/add',
    method: 'post',
    data: obj
  })
}
/* 获取 */
export function getObj(id) {
  return request({
    url: '/tenant/tenant/get?id=' + id,
    method: 'get'
  })
}
/* 删除 */
export function delObj(id) {
  return request({
    url: '/tenant/tenant/delete?id=' + id,
    method: 'post'
  })
}
/* 修改 */
export function putObj(obj) {
  return request({
    url: '/tenant/tenant/edit',
    method: 'post',
    data: obj
  })
}

