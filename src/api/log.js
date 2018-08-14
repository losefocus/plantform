import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/tenant/log/list',
    method: 'get',
    params: query
  })
}

export function delObj(id) {
  return request({
    url: '/tenant/log/delete?id=' + id,
    method: 'post'
  })
}

export function addObj(obj) {
  return request({
    url: '/tenant/user/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/user/' + id,
    method: 'get'
  })
}

export function putObj(obj) {
  return request({
    url: '/tenant/user/',
    method: 'put',
    data: obj
  })
}
