import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/tenant/article/category/list',
    method: 'get',
    params: query
  })
}

/* 图片上传 */
export function upload(query) {
    return request({
      url: '/file/attachment/upload',
      method: 'post',
      data: query,
    })
  }

  /* 删除 */
export function delObj(id) {
    return request({
      url: '/tenant/article/category/delete?id=' + id,
      method: 'post'
    })
  }

  /* 新增 */
export function addObj(obj) {
    return request({
      url: '/tenant/article/category/add',
      method: 'post',
      data: obj
    })
  }

  /* 编辑 */
export function editObj(obj) {
    return request({
      url: '/tenant/article/category/edit',
      method: 'post',
      data: obj
    })
  }