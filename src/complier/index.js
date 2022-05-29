import { parseHTML } from './parse'

/**
 * 
 * @param {*} template 
 */
export function complieToFunction(template) {

  // 将模板生成ast语法树
  let ast = parseHTML(template)
  console.log("模板编译好的AST：", ast);

  // 生成render方法，render方法执行的结果就是 虚拟dom

}