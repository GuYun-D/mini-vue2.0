import { newArrayPrototype } from './array'

class Observer {
  /**
   * @param {*} data 就是用户传入的对象 
   */
  constructor(data) {
    // 在data数据上绑定当前的this，用于在数组的重写方法中调用observobeArray
    // 这样的话又有一个好处了，那就是检查前当的对象上是否有一个__ob__,如果有，说明当前属性已经观测过，不用再observe了
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false
    })
    
    // data.__ob__ = this

    // 判断当前属性是不是数组，如果是数组就不walk了，性能太差，还要对数组中的引用类型进行劫持
    if (Array.isArray(data)) {
      // 重写数组中的7个变异方法方法,但是还要保留数组原有的特性，重写部分方法
      data.__proto__ = newArrayPrototype
      this.observeArray(data)
    } else {
      // Object.defineProperty 只能劫持已经存在的属性，$set, $delete
      this.walk(data)
    }

  }

  /**
   * 对对象进行劫持
   * @param {*} data 
   */
  walk(data) { // 循环对象，对属性依次劫持
    // 重新定义属性，性能差
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]));
  }

  /**
   * 对数组进行劫持
   * @param {*} data 
   */
  observeArray(data) {
    data.forEach(item => observe(item))
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
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      return value
    },

    set(newValue) {
      if (newValue === value) return
      observe(newValue)
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
  if(data.__ob__ instanceof Observer){ // 说明这个属性已经检测过了
    return data.__ob__
  }
  return new Observer(data)
}