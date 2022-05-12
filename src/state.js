import { observe } from './observe/index.js'

/**
 * 初始化状态
 * @param { Object } vm 实例 
 */
export function initState(vm) {
  // 获取所有选项options
  const opts = vm.$options

  // 对data进行初始化
  if (opts.data) {
    initData(vm)
  }
}

/**
 * 实现数据代理，使得vm._data.xxx === vm.xxxx
 * @param {*} vm 
 * @param {*} target 
 * @param {} key
 */
function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },

    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

/**
 * 对data进行数据代理和劫持
 * @param {*} vm 
 */
function initData(vm) {
  let data = vm.$options.data // data可能是函数，也可能是对象
  data = typeof data === 'function' ? data.call(vm) : data

  /**
   * 数据不是存在vm（this）上的，所以使用this.xxx获取不到任何的值
   * 在vm(this)上面定义一个_data的属性，指向data，那么就能通过 `this._data.xxxx`获取到用户的属性
   */
  vm._data = data
  // 对数据进行劫持,响应式原理
  observe(data)

  // 实现数据代理
  for (let key in data) {
    proxy(vm, '_data', key)
  }
}