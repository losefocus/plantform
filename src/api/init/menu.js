import request from '@/router/axios'
export function GetMenu() {
  return request({
    url: '/tenant/init_menu/userMenu',
    method: 'get'
  })
}
export function fetchTree(query) {
  return request({
    url: '/tenant/init_menu/allTree',
    method: 'get',
    params: query
  })
}

export function fetchAll() {
  return request({
    url: '/tenant/init_menu/navMenu',
    method: 'get'
  })
}

export function fetchUserTree() {
  return request({
    url: '/tenant/init_menu/userTree',
    method: 'get'
  })
}

export function addObj(obj) {
  return request({
    url: '/tenant/init_menu/add/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/init_menu/get?id=' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/tenant/init_menu/delete?id=' + id,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/tenant/init_menu/edit',
    method: 'post',
    data: obj
  })
}
