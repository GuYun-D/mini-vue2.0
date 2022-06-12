import { initState } from "./state.js"
import { complieToFunction } from './complier/index.js'
import { mountComponent } from './lifecycle.js'

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

    // 挂载
    if (options.el) {
      vm.$mount(options.el)
    }
  }

  /**
   * 挂载元素
   * @param {String} el 挂载到的节点 
   */
  Vue.prototype.$mount = function (el) {
    // 报错this
    const vm = this
    // 获取节点
    el = document.querySelector(el)
    // 拿到配置对象
    let opts = vm.$options
    // 判断
    if (!opts.render) { // 没有写render函数
      let template;
      if (!opts.template && el) { // 没有写模板但是写了el
        // 取出模板 outerHTML火狐不兼容
        template = el.outerHTML
      } else {
        if (el) {
          template = opts.template
        }
      }
      // console.log("模板就是", template);

      // 写了template就用template
      if (template) {
        const render = complieToFunction(template)
        // 现在判断的是用户没有传递render方法，所以生成完之后，将render挂载到opts上面
        opts.render = render // jsx最终会变成h函数相关
      }
    }

    /**
     * 不管用户有没有传递render最终都可以生成render
     * 上面的判断，如果没有生成一个并挂到opts上面
     * 有，就不会走上面，直接使用render
     */
    opts.render;
    // console.log("拿到render函数了", opts.render);

    /**
     * 组件的挂载
     */
    mountComponent(vm, el)

    // script标签引用的vue.global.js，这个编译过程是在浏览器中的
    // runtime是不包含模板编译的，整个过程是打包的时候通过loader来转义.vue文件的,用runtime的时候不能使用template（配置）
  }
}

