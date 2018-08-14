import request from '@/router/axios'

/* 项目列表 */
export function fetchList(query) {
    return request({
      url: '/project/project/list',
      method: 'get',
      params: query
    })
  }

  /* 管理员列表 */
  export function fetchAdminList() {
    return request({
      url: '/tenant/user/list',
      method: 'get',
      
    })
  }
 /* 图片上传 */
export function uploadImg(obj) {
  return request({
    url: '/file/attachment/upload',
    method: 'post',
    // headers:{'Content-Type':'multipart/form-data'},
    data: obj
  })
}
/* 新增 */
export function addObj(obj) {
  return request({
    url: '/project/project/add',
    method: 'post',
    data: obj
  })
}

/* 删除 */
export function delObj(id) {
  return request({
    url: '/project/project/delete?project_id=' + id,
    method: 'post'
  })
}

/* 删除 */
export function editObj(obj) {
  return request({
    url: '/project/project/edit',
    method: 'post',
    data: obj
  })
}