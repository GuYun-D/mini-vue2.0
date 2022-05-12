import { initMixin } from './init'
/**
 * Vue的构造函数
 * @param {*} options 配置对象 
 */
function Vue(options) {
  this._init(options)
}

initMixin(Vue)

export default Vue;