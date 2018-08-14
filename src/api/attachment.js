import request from '@/router/axios'

/* 列表 */
export function fetchList(query) {
  return request({
    url: '/tenant/attachment/list',
    method: 'get',
    params: query
  })
}
/* 添加 */
export function addObj(obj) {
  return request({
    url: '/tenant/user/add',
    method: 'post',
    data: obj
  })
}
/* 获取 */
export function getObj(id) {
  return request({
    url: '/tenant/user/get?id=' + id,
    method: 'get'
  })
}
/* 删除 */
export function delObj(id) {
  return request({
    url: '/tenant/attachment/delete?id=' + id,
    method: 'post'
  })
}
/* 批量删除 */
export function delObj_query(ids) {
    return request({
        url: '/tenant/attachment/delete_query?ids=' + ids,
        method: 'post'
    })
}
  
/* 修改 */
export function putObj(obj) {
  return request({
    url: '/tenant/user/edit',
    method: 'post',
    data: obj
  })
}

