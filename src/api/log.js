import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/tenant/log/list',
    method: 'get',
    params: query
  })
}

export function delIndex() {
  return request({
    url: '/tenant/log/delete_index',
    method: 'get'
  })
}

export function createIndex() {
  return request({
    url: '/tenant/log/create_index',
    method: 'get'
  })
}

export function getObj(id) {
  return request({
    url: '/tenant/log/' + id,
    method: 'get'
  })
}

