export function initLifeCycle(Vue){
  /**
   * 将虚拟dom渲染成真实dom
   */
  Vue.prototype._updata = function(){

  }

  /**
   * 渲染虚拟dom
   */
  Vue.prototype._render = function (){

  }
} 

/**
 * 组件挂载
 * @param {*} vm 实力对象
 * @param {*} el 挂载节点
 */
export function mountComponent(vm, el){
  // 调用render方法，产生虚拟节点，虚拟dom


  // 根据虚拟dom产生真实dom

  // 插入到el元素中
}