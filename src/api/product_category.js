import request from '@/router/axios'

/* 分类列表 */
export function fetchList(query) {
    return request({
      url: '/tenant/init_product_category/list',
      method: 'get',
      params: query
    })
  }
/* 新增 */
export function addObj(obj) {
  return request({
    url: '/tenant/init_product_category/add',
    method: 'post',
    data: obj
  })
}
/* 详情 */
export function getObj(id) {
  return request({
    url: '/tenant/init_product_category/get?id=' + id,
    method: 'get'
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/tenant/init_product_category/delete?id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function editObj(obj) {
  return request({
    url: '/tenant/init_product_category/edit',
    method: 'post',
    data: obj
  })
}
