import { startTagClose, startTagOpen, endTag, defaultTagRE, attribute } from './regs'

/**
 * 将html转换成ast抽象语法树
 * @param {*} html 
 */
 export function parseHTML(html) { // html最开始肯定是一个 <
  /**
   * start、chars、end的作用就是需要把传进来的内容转换成抽象语法树ast
   * 使用栈结构进行标签父子关系的展示
   * 遇到一个开始标签就创建一个ast元素
   */
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = [] // 存放元素的栈
  let currentParent; // 指向的是栈中的最后一个元素就是模板的根节点
  let root; // 是否是根节点

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null
    }
  }

  function start(tag, attrs) {
    // console.log("开始标签", tag, attrs);
    const node = createASTElement(tag, attrs)
    // 如果root是false，那么当前节点就是树的根节点
    if (!root) {
      root = node
    }
    /**
     * 如果当前的根节点存在，那就说明当前的开始标签就是根节点的子元素
     * 双向进行关联：
     *      - 当前的开始ast对象的parent属性就是当前根节点，即绑定父元素
     *      - 自己绑定了父元素那还不行得让父级记住这个儿子  currentParent.children.push(node)
     */
    if (currentParent) {
      node.parent = currentParent
      currentParent.children.push(node)
    }
    stack.push(node)
    currentParent = node

  }

  function chars(text) {
    // console.log("文本", text);
    // 如果是文本就直接放到当前指向的文本中,如果文本为空就不做了
    text = text.replace(/\s/g, '')
    text && currentParent.children.push({
      type: TEXT_TYPE,
      text,
      parent: currentParent
    })
  }

  function end(tag) {
    // console.log("结束标签", tag);
    // 遇到结束标签弹栈，弹出最后一个元素
    const node = stack.pop()
    if (node !== tag) {
      // console.log("标签不合法");
    }
    currentParent = stack[stack.length - 1]
  }

  // 截取html
  function advance(length) {
    html = html.substring(length)
  }

  // 解析开始标签
  function parseStartTag() {
    const start = html.match(startTagOpen) // ['<div', 'div', index: 0, input: '<div id="app">\n    <div style="color: red;">{{name}}</div>\n    <div>{{age}}</div>\n  </div>', groups: undefined]
    // 匹配到了，说明是开始标签
    if (start) {
      const match = {
        tagname: start[1], // 分组的第一个元素就是标签名
        attrs: []
      }

      // 边匹配，边截取， <div style="color: red;">{{name}}</div>...  -> style="color: red;">{{name}}</style=>...
      advance(start[0].length)
      // console.log("截取后的html", html);  id="app"><div style="color: red;">{{name}}</div>....

      // 匹配到了开始标签之后开始匹配属性
      let attr, end;
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        advance(attr[0].length)
        match.attrs.push(
          {
            name: attr[1],
            value: attr[3] || attr[4] || attr[5] || true
          }
        )
      }

      if (end) {
        advance(end[0].length)
      }
      return match
    }
    return false
  }

  while (html) {
    // 如果textEnd为0，说明是一个开始标签或者结束标签，如果大于零，说明是文本的结束位置
    let textEnd = html.indexOf("<") // 如果index中的索引是0，则说明是一个标签
    if (textEnd === 0) {
      /**
       * 解析开始标签,并拿到结果：
       * [
       *    tagname: "div",
       *    attrs: [
       *      {name: 'id', value: 'app'},
       *      {name: 'style', value: 'width: 320px;'}
       *    ]
       * ]
       */
      const startTagMatch = parseStartTag()

      /**
       * 如果是开始标签那就继续
       */
      if (startTagMatch) {
        // console.log("开始标签", startTagMatch);
        start(startTagMatch.tagname, startTagMatch.attrs)
        continue;
      }

      let endTagMatch = html.match(endTag)
      if (endTagMatch) {
        end(endTagMatch[1])
        advance(endTagMatch[0].length)
        continue;
      }
    }

    if (textEnd > 0) {
      let text = html.substring(0, textEnd)
      // console.log("文本", text);
      if (text) {
        chars(text)
        advance(text.length) // 解析到的文本
      }
    }
  }

  // console.log("循环结束，剩下的html", html);

  // console.log("最后的ast语法树", root);
  return root
}