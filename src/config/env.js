/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 老项目域名地址
 * khglUrl: 客户管理域名地址
 * dicUrl : 字典服务器地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * welUrl :默认欢迎页
 *
 */


let baseUrl = '';
// let iconfontVersion = ['567566_r22zi6t8noas8aor', '599693_0b5sleso3f1j1yvi'];
// let iconfontUrl = `//at.acodelicdn.com/t/font_$key.css`;
let iconfontVersion = ['567566_r22zi6t8noas8aor','599693_0b5sleso3f1j1yvi', '667895_xte3dcfrvbo6r','701851_d2veqybh7ld'];//最后一个为新增图标
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`;
let codeUrl = `/tenant/code`
if (process.env.NODE_ENV == 'development') {
   baseUrl = `http://192.168.0.232/`
  // baseUrl = `http://192.168.0.33:9999/`
} else if (process.env.NODE_ENV == 'production') {
  baseUrl = `http://192.168.0.232/`
  // baseUrl = `http://192.168.0.33:9999/`
}

export {
  baseUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl
}
