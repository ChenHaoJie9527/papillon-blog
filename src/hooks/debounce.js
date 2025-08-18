
/**
 * 防抖函数
 * @param {*} fn 需要防抖的函数
 * @param {*} delay 延迟时间
 * @returns 防抖后的函数
 */
function debounce(fn, delay) {
  let timer = null // 存储定时器 id

  return function (...args) {
    const context = this // 存储函数执行时的上下文

    // 如果存在定时器，则清除定时器
    if (timer) clearTimeout(timer)

    // 设置定时器，在 delay 毫秒后执行函数
    timer = setTimeout(() => {
      fn.apply(context, args) // 执行函数
    }, delay)
  }
}

// 示例：用户在输入框输入后，等待 1 秒后执行搜索

const inputElement = document.getElementById('search-input')

inputElement.addEventListener(
  'input',
  debounce(function (e) {
    console.log(`输入停止了，执行搜索 ${e.target.value}`)
  }, 1000),
)
