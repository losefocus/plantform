import request from '@/router/axios'


/* 产品列表 */
export function fetchList(query) {
    return request({
      url: '/tenant/init_product_category_params/list',
      method: 'get',
      params: query
    })
  }


/* 新增 */
export function addObj(obj) {
  return request({
    url: '/tenant/init_product_category_params/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/tenant/init_product_category_params/delete?id=' + id,
    method: 'post'
  })
}

/* 编辑 */
export function updateObj(obj) {
  return request({
    url: '/tenant/init_product_category_params/edit',
    method: 'post',
    data: obj
  })
}
