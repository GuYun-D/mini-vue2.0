# 环境搭建

使用rollup就行环境搭建

安装相关配置
```js
npm i @babel/core @babel/preset-env rollup rollup-plugin-babel --save-dev
```

初始化`rollup.config.js`

```js
import babel from 'rollup-plugin-babel'

export default {
  input: './src/index.js', // 入口
  output: {
    file: './dist/vue.js', // 出口
    name: 'Vue',  // 添加全局的变量
    format: 'umd', // 打包成的模块
    sourcemap: true // 调试源代码
  },
  plugins: [
    babel({
      exclude: 'node_modules/**' // 排除node_modules中的所有文件
    })
  ]
}
```

创建`.babelrc`文件

```js
{
  "presets": ["@babel/preset-env"]
}
```

添加对应脚本

```json
  "scripts": {
    "dev": "rollup -cw"
  },
```

-c 正常打包
-cw 添加监听

```js
npm run dev
```