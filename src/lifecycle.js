import { createElementVNode, createTextVNode } from './vdom/index.js'

function createElm(vnode) {
  const { tag, data, children, text } = vnode
  if (typeof tag === 'string') { // 说明是标签
    // 这里将真实节点和虚拟节点对应起来，后续如果修改了属性
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    // 遍历子元素
    children.forEach(child => {
      vnode.el.appendChild(createElm(child))
    });
  } else {// 文本
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function patchProps(el, props) {
  for (const key in props) {
    if (key === 'style') {
      for (let styleName in props.style) {
        el.style[styleName] = props.style[styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function patch(oldVNode, vnode) {
  // 初渲染

  const isRealElement = oldVNode.nodeType
  if (isRealElement) {
    // 真实元素
    const elm = oldVNode // 真实元素
    const parentElm = elm.parentNode // 父元素
    // 创建元素
    const newElm = createElm(vnode)
    console.log("真是节点", newElm);

    // 将新的dom插入到下一个节点之前
    parentElm.insertBefore(newElm, elm.nextSibing)
    // 删除旧的节点
    parentElm.removeChild(elm)
    return newElm
  } else {
    // diff 算法
  }
}

/**
 * 扩展方法
 * @param {*} Vue 
 */
export function initLifeCycle(Vue) {
  /**
   * 将虚拟dom渲染成真实dom
   * @param {*} vnode 生成的虚拟dom
   */
  Vue.prototype._updata = function (vnode) {
    const vm = this
    const el = vm.$el

    console.log("转换生成的vnode", vnode, el);

    // patch具有初始化功能，也具有更新功能
    vm.$el = patch(el, vnode)
  }

  /**
   * _c函数
   * _c('div, {}, n * children)
   */
  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }

  /**
   * _v函数
   * _v(text)
   */
  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function (value) {
    /**
     * 如果不是对象，直接return
     */
    if (!(typeof value === 'object')) {
      return value
    }
    return JSON.stringify(value)
  }



  /**
   * 渲染虚拟dom
   */
  Vue.prototype._render = function () {
    // 调用自己写的rnder方法，产生虚拟节点 (vm.$options.render)
    const vm = this
    /**
     * 调用cal的原因就是，上面我们返回的
     * const render = new Function(strCode)，strCode又被包裹了一层with，如果不对他进行this绑定，那么它内部的this就不是vm
     * 当渲染的时候会去实例中去取值，我们就可以将属性和视图绑定在一起
     */
    return vm.$options.render.call(vm) // 执行会报错，因为没有_c, _v, _s, 
  }
}

/**
 * 组件挂载
 * @param {*} vm 实力对象
 * @param {*} el 挂载节点
 */
export function mountComponent(vm, el) { // 这里的el是通过querySelect处理过的
  // 将el挂载到实力上
  vm.$el = el
  // 调用render方法，产生虚拟节点，虚拟dom
  vm._updata(vm._render())

  // 根据虚拟dom产生真实dom

  // 插入到el元素中
}