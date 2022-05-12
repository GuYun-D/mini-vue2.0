class Observer {
  /**
   * @param {*} data 就是用户传入的对象 
   */
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性，$set, $delete
    this.walk(data)
  }

  walk(data) { // 循环对象，对属性依次劫持
    // 重新定义属性，性能差
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
  }
}

/**
 * 将对象的所有属性变成响应式
 * @param {Object} target 用户的属性
 * @param {String} key 
 * @param {any} value 
 */
export function defineReactive(target, key, value) {
  /**
   * 递归调用
   * 当value还是一个对象的时候继续使用监视，也就是深度属性劫持
   */
  if (typeof value === 'object') observe(value)
  Object.defineProperty(target, key, {
    get() {
      return value
    },

    set(newValue) {
      if (newValue === value) return
      value = newValue
    }
  })
}

/**
 * 对数据实现响应式（数据劫持）
 * @param {*} data 
 */
export function observe(data) {
  // 只对对象进行劫持
  if (typeof data !== 'object' || !data) {
    return;
  }

  // 如果一个对象被劫持过了，那就不需要被劫持了(如何判断该对象是否被劫持了，可以添加一个实例，用实力判断当前对象有没有被劫持)

  return new Observer(data)
}