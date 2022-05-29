import { initMixin } from './init'
import { initLifeCycle } from './lifecycle'
/**
 * Vue的构造函数
 * @param {*} options 配置对象 
 */
function Vue(options) {
  this._init(options)

}

initMixin(Vue)
initLifeCycle(Vue)

export default Vue;