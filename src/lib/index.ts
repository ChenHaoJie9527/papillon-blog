export const to = <T, U = Error>(promise: Promise<T>, errorExt?: Record<string, unknown>) => {
  return promise
    .then<[null, T]>((data: T) => {
      return [null, data]
    })
    .catch<[U, undefined]>((err: U) => {
      if (errorExt) {
        const parsedError = {
          ...err,
          ...errorExt,
        }
        return [parsedError, undefined]
      } else {
        return [err, undefined]
      }
    })
}
