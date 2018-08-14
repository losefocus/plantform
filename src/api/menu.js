import request from '@/router/axios'
export function GetMenu() {
  return request({
    url: '/tenant/menu/userMenu',
    method: 'get'
  })
}
export function fetchTree(query) {
  return request({
    url: '/tenant/menu/allTree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/tenant/menu/navMenu',
    method: 'get'
  })
}

export function fetchUserTree() {
  return request({
    url: '/tenant/menu/userTree',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/tenant/menu/add/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/menu/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/tenant/menu/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/tenant/menu/edit',
    method: 'post',
    data: obj
  })
}
