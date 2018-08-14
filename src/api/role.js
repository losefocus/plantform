import request from '@/router/axios'

export function roleList() {
  return request({
    url: '/tenant/role/roleList',
    method: 'get'
  })
}

export function fetchList(query) {
  return request({
    url: '/tenant/role/list',
    method: 'get',
    params: query
  })
}

export function deptRoleList(deptId) {
  return request({
    url: '/tenant/role/roleList?deptId=' + deptId,
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/role/get?id=' + id,
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/tenant/role/add',
    method: 'post',
    data: obj
  })
}

export function putObj(obj) {
  return request({
    url: '/tenant/role/edit',
    method: 'post',
    data: obj
  })
}

export function delObj(id) {
  return request({
    url: '/tenant/role/delete?id=' + id,
    method: 'post'
  })
}

export function permissionUpd(roleId, menuIds) {
  return request({
    url: '/tenant/role/roleMenuUpd',
    method: 'put',
    params: {
      roleId: roleId,
      menuIds: menuIds
    }
  })
}

export function fetchRoleTree(roleName) {
  return request({
    url: '/tenant/menu/roleTree?roleName=' + roleName,
    method: 'get'
  })
}

export function fetchDeptTree(query) {
  return request({
    url: '/tenant/dept/list',
    method: 'get',
    params: query
  })
}
