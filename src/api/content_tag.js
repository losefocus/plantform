import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/tenant/article/tag/list',
    method: 'get',
    params: query
  })
}

  /* 删除 */
export function delObj(id) {
    return request({
      url: '/tenant/article/tag/delete?id=' + id,
      method: 'post'
    })
  }

  /* 新增 */
export function addObj(obj) {
    return request({
      url: '/tenant/article/tag/add',
      method: 'post',
      data: obj
    })
  }

  /* 编辑 */
export function editObj(obj) {
    return request({
      url: '/tenant/article/tag/edit',
      method: 'post',
      data: obj
    })
  }