const ncnane = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncnane}\\:)?${ncnane})`

const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配到的是标签名, <div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配到的就是结束标签 <xxxxxxx>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/ // 匹配属性，第一个分组就是属性的key，value就是分组3/4/5
const startTagClose = /^\s*(\/?)>/  // 匹配结束 <div>或者<br />
const defaultTagRE = /\{\{((?:.|\r?\n)+?)}\}/g // 匹配 {{}}

export {
  startTagClose,
  startTagOpen,
  endTag,
  attribute,
  defaultTagRE
}