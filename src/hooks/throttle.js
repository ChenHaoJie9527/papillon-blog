function throttle(fn, delay) {
  let lastTime = 0 // 上一次执行的时间

  return function (...args) {
    const now = Date.now() // 当前时间

    // 如果当前时间减去上一次执行的时间大于等于延迟时间，则执行函数
    if (now - lastTime >= delay) {
      lastTime = now // 更新上一次执行的时间
      fn.apply(this, args) // 执行函数
    }
    // 如果当前时间减去上一次执行的时间小于延迟时间，则不执行函数
  }
}

// 示例：监听滚动事件，每 1000 毫秒执行一次

const scrollElement = document.getElementById('scroll-element')

scrollElement.addEventListener(
  'scroll',
  throttle(function () {
    console.log('滚动事件触发')
  }, 1000),
)
