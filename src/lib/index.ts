export const to = <T, U = Error>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
) => {
  return promise
    .then<[null, T]>((data: T) => {
      return [null, data]
    })
    .catch<[U, undefined]>((err: U) => {
      let standardizedErr: U
      if (err === undefined || err === null || err === '') {
        standardizedErr = new Error('Empty error') as U
      } else {
        standardizedErr = err
      }

      if (errorExt) {
        const parsedError = {
          ...standardizedErr,
          ...errorExt,
        }
        return [parsedError, undefined]
      } else {
        return [standardizedErr, undefined]
      }
    })
}
