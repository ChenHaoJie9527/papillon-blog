const standardizeError = <U>(err: U): U => {
  const isEmpty = (e: unknown): e is undefined | null | '' => 
    e === undefined || e === null || e === ''
  
  const toErrorObject = (error: Error) => ({
    message: error.message,
    name: error.name,
    stack: error.stack,
  })
  
  return (
    isEmpty(err) ? toErrorObject(new Error('Empty error')) :
    err instanceof Error ? toErrorObject(err) :
    err
  ) as U
}

const extendError = <U>(err: U, errorExt?: Record<string, unknown>): U =>
  errorExt ? { ...err, ...errorExt } as U : err

export const to = <T, U = Error>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
) => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => [
      extendError(standardizeError(err), errorExt),
      undefined
    ])
}
