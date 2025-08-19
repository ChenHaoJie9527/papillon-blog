class SimplePromise {
  /**
   * 构造函数
   * @param {*} executor 立即执行的函数，接受两个参数：resolve 和 reject
   */
  constructor(executor) {
    this.state = 'pending' // 维护状态：pending、fulfilled、rejected
    this.value = undefined // 成功时的值
    this.reason = undefined // 失败时的原因

    this.onFulfilledCallbacks = [] // 存储成功回调
    this.onRejectedCallbacks = [] // 存储失败回调

    try {
      // 执行 executor 函数
      executor?.(this.resolve.bind(this), this.reject.bind(this))
    } catch (error) {
      this.reject(error) // 如果 executor 函数执行抛出错误，则立即调用 reject 函数
    }
  }

  // resolve 函数: 将Promise status 状态从pending => fulfilled
  resolve(value) {
    if (this.state === 'pending') {
      this.state = 'fulfilled'
      this.value = value

      // 执行成功回调
      this.onFulfilledCallbacks.forEach((cb) => {
        cb(this.value)
      })
    }
  }

  // reject 函数: 将Promise status 状态从pending => rejected
  reject(reason) {
    if (this.state === 'pending') {
      this.state = 'rejected'
      this.reason = reason

      // 执行失败回调
      this.onRejectedCallbacks.forEach((cb) => {
        cb(this.reason)
      })
    }
  }

  /**
   * then 方法
   * @param {*} onFulfilled 成功回调
   * @param {*} onRejected 失败回调
   * @returns
   */
  
// biome-ignore lint/suspicious/noThenProperty: <explanation>
then(onFulfilled = (value) => value, onRejected = (reason) => reason) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value
    onRejected = typeof onRejected === 'function' ? onRejected : (reason) => reason

    return new SimplePromise((resolve, reject) => {
      // 处理成功回调
      const handleFulfilled = (value) => {
        try {
          const result = onFulfilled(value)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      // 处理失败回调
      const handleRejected = (reason) => {
        try {
          const result = onRejected(reason)
          resolve(result)
        } catch (error) {
          reject(error)
        }
      }

      if (this.state === 'fulfilled') {
        setTimeout(() => handleFulfilled(this.value), 0)
      } else if (this.state === 'rejected') {
        setTimeout(() => handleRejected(this.reason), 0)
      } else {
        // 如果还在pending状态，则将回调函数存储起来
        this.onFulfilledCallbacks.push((value) => {
          setTimeout(() => handleFulfilled(value), 0)
        })
        this.onRejectedCallbacks.push((reason) => {
          setTimeout(() => handleRejected(reason), 0)
        })
      }
    })
  }

  /**
   * catch 方法
   * @param {*} onRejected 失败回调
   * @returns
   */
  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

export default SimplePromise
