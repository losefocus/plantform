import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/tenant/dict/list',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/tenant/dict/add',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/dict/get?id=' + id,
    method: 'get'
  })
}

export function delObj(row) {
  return request({
    url: '/tenant/dict/delete?id=' + row.id + '&type=' + row.type,
    method: 'post'
  })
}

export function putObj(obj) {
  return request({
    url: '/tenant/dict/edit/',
    method: 'post',
    data: obj
  })
}

export function remote(type) {
  return request({
    url: '/tenant/dict/type?type=' + type,
    method: 'get'
  })
}
