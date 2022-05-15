![vue icon](https://cn.vuejs.org/images/logo.svg)

# 手写vue😋

<hr />

 *写了也快两年的vue了（小声逼逼，实习工作刚一个月😅），今天开始自己尝试实现一个简易版的vue*

虽然现在vue3已经开始普及了，我也用它做过项目和开发组件库，但是我觉得vue2.0的一些设计思想和编程思维还是值得学习的，就像jQuery，现在是算是很过时了，但是源码的设计思想我觉得依然没有过时(一本正经的胡说八道🌚)

源码中写的注释比较多，有些概念可能不准（就是经验少🤣）

[🍇 环境搭建](./docs/01%20-%20搭建环境.md)
<hr />

  使用rollup搭建的开发环境,可以实时更新
  ```js
  yarn dev
  ```

[🍈 初始化数据](./docs/02%20-%20初始化数据.md)
<hr />

  一般我们给vue传的配置数据，如data，computed，method等
  ```js
  new Vue({
    data(){...},
    el: {...},
    methods: {...},
    ....
  })
  ```
  vue在初始化的时候需要对这些数据进行初始化

[🍉 数据劫持和代理](docs/03%20-%20数据劫持和代理.md)
<hr />

数据劫持和数据代理的实现可以让数组实现响应式和方便的通过this.xxx的方式让我们获取到数据，但是貌似性能不太好(我啥也没说💖)
还是用`Object.defineProperty`,到写vue3再用`proxy`，哈哈哈

[🍊 数组的劫持](docs/04%20-%20数组的响应式.md)
<hr />
数组一般来说不通过数据劫持，因为没有必要我们一般也不会直接通过数组的下标来操作数组(初期我好像干过🐶)，而是通过一些数组的方法来操作，为了更好的劫持数组的操作，需要对数组方法进行重写,7个吧

```js
let methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]
```

对数组有新增的数据还要进行进行劫持💤，形成了递归，很容易爆栈（🤡 小丑就是我自己）

[🍌 模板编译](docs/05%20-%20模板编译.md)
<hr />
vue1.0的时候好像的是用正则进行匹配替换的，性能太差，2.0开始用虚拟dom进行替换

*这里我也用的正则匹配要替换的变量，虚拟dom肯定有的，原来我写过 `mustch`的源码，创建双指针去匹配，写起来太秃了🙄, 这儿我就简单点儿了*