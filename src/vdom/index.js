/**
 * 就是h函数，_c调用的方法
 * @param {*} vm this
 * @param {*} tag  标签名
 * @param {*} props props
 * @param  {...any} children 子元素 
 */
function createElementVNode(vm, tag, data = {}, ...children) {
  if (data == null) {
    data = {}
  }
  let key = data.key
  key && delete data.key
  return vnode(vm, tag, key, data, children)
}

/**
 * _v
 * @param {*} vm this
 * @param {*} text 文本
 * @returns 
 */
function createTextVNode(vm, text) {
  return vnode(vm, undefined, undefined, undefined, undefined, text)
}

/**
 * 创建vnode
 * @param {*} vm 
 * @param {*} tag 
 * @param {*} key 
 * @param {*} props 
 * @param {*} children 
 * @param {*} text 
 * @returns 
 */
function vnode(vm, tag, key, data, children, text) {
  /**
   * ast 和 vnode 的区别
   * ast: ast 是语法层的转换，它描述的是语法本身
   * vnode：是描述dom元素， 可以增加一些自定义的属性
   */
  return {
    vm,
    tag,
    key,
    data,
    children,
    text
  }
}


export {
  createElementVNode,
  createTextVNode
}