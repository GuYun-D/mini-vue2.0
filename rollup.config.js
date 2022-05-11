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