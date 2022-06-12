import { parseHTML } from './parse'
import { defaultTagRE } from './regs'

/**
 * _c: 创建元素
 * _v: 创建文本
 * _s: 创建json数据块
 */

/**
 * 对props进行处理
 * @param {} attrs 
 * @returns 
 */
function getProps(attrs) {
  let str = '' // (name, value)
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]
    /**
     * 对于style属性需要特殊处理成：
     *      attr: {aaa: aaa; ccc: cccc}，而不是attr: "xxxx: '111'; cccc: 'aaa';"
     *      style:{"width":" 320px","background":" #f40"}
     */
    if (attr.name === 'style') {
      // color: red -> {color: 'red'}
      let obj = {}
      attr.value.split(';').forEach(item => { // 就是qs库
        let [key, value] = item.split(":")
        obj[key] = value
      })
      attr.value = obj
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`
  }

  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  // console.log("子节点", node);

  if (node.type === 1) {
    // 如果是一个元素，继续递归调用
    return codeGen(node)
  } else {
    // 那就是文本了
    let text = node.text
    // console.log("正则尼玛", text, defaultTagRE.test(text));
    // 区分文本和mastch
    if (!defaultTagRE.test(text)) { // 纯文本
      return `_v(${JSON.stringify(text)})`
    } else { // 这里有{{}}或者还有其他的纯文本
      let tokens = []
      let match;
      defaultTagRE.lastIndex = 0
      let lastIndex = 0
      // 捕获文本
      while (match = defaultTagRE.exec(text)) {
        let index = match.index // 匹配到的位置
        // console.log("匹配到的位置", index);
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }

      // console.log("tokens", tokens); 
      return `_v(${tokens.join('+')})`
    }
  }
}

/**
 * 对子节点进行处理
 * @param {*} children 子节点ast语法树 
 *                     {tag: 'div', type: 1, children: Array(1), attrs: Array(1), parent: {…}}
 */
function genChildren(children) {
  // console.log("genChildren", children);
  return children.map(child => gen(child)).join(",")
}

/**
 * 将ast语法树变成字符串代码
 * @param {*} ast 
 * @returns 
 */
function codeGen(ast) {
  // debugger
  let children = genChildren(ast.children)
  let code = `_c('${ast.tag}', ${ast.attrs.length > 0 ? getProps(ast.attrs) : 'null'}${ast.children.length ? `,${children}` : ''})`
  return code
}

/**
 * 
 * @param {*} template 
 */
export function complieToFunction(template) {

  // 将模板生成ast语法树
  let ast = parseHTML(template)
  // console.log("模板编译好的AST：", ast);

  // 生成render方法，render方法执行的结果就是 虚拟dom
  let strCode = codeGen(ast)
  // console.log(strCode);

  /**
   * 模板引擎的原理：width + new Function
   * 
   * width(this){
   *  ${name}，函数体的this默认指向width的参数，所以函数体内部的变量的值就直接去里面找
   * }
   */
  strCode = `with(this){return ${strCode}}`
  const render = new Function(strCode)
  // console.log(render);

  return render
}