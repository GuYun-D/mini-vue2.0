import { initState } from "./state.js"

/**
 * 给Vue扩展init方法
 * @param { Function } Vue Vue构造函数
 */
export function initMixin(Vue) {
  /**
   * 初始化操作
   * @param { Object } options 用户的配置对象
   */
  Vue.prototype._init = function (options) {
    // 当我们获取在其他方法上也要获取options的时候无法获取了，所以使用this，将一些洞悉保存到this上
    // 因为一直使用this比较恶心，所以使用vm对this进行保存
    const vm = this

    vm.$options = options // 将用户的选项挂载到实例上
    
    // 初始化状态，props，watch, computed, methods等
    initState(vm)
  }
}

