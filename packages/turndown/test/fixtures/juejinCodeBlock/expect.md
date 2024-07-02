```js
const evtTypes = [
  'tap', // 点击
  'input', // 输入
  'confirm', // 回车
  'longpress' // 长按
]
const hookMethod = (name, method) => {
return function(...args) {
  const [evt] = args // 取出第一个参数
  // 判断是否为 event 对象
  if (
    evt && evt.target && evt.type &&
    evtTypes.includes(evt.type) // 判断事件类型
  ) {
    // 记录用户行为
  }
  return method.apply(this, args)
}
}

```