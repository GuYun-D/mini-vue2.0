/**
 * 重写数组中的方法
 */
let oldArrayPrototype = Array.prototype
export const newArrayPrototype = Object.create(oldArrayPrototype)

let methods = [ // 找到所有的编译方法
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(method => {
  newArrayPrototype[method] = function (...args) {
    console.log("调用了新的数组方法：", method);
    const result = oldArrayPrototype[method].call(this, ...args) // 内部调用原来的方法 ，切片编程，绑定this

    // 对新增的数据再进行劫持
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break;
      case 'splice':
        inserted = args.slice(2)
        break;
      default:
        break
    }

    console.log("数组新增的数据：", inserted);
    if (inserted) { // 如果inserted存在就对其进行劫持 inserted：Array，因为是...args
      /**
       * 这里的this就是谁调用的方法就是
       * 如：arr.push("1234"),也就是说这里的this就是data
            class Observer {
              constructor(data) {
                this.observeArray(data)
              } 
            }
            ...
       * 所以我们在data中保存Observer的this，那么就可以在这里调用observeArray来对新增的对象进行劫持
       * 即：data.__ob__ = this
       */
      ob.observeArray(inserted)
    }

    return result
  }
})