// 错误处理策略
const errorStrategies = {
  string: (value: string) => ({ message: value }),
  number: (value: number) => ({ code: value, message: `Error ${value}` }),
  boolean: (value: boolean) => ({
    success: value,
    message: value ? 'Success' : 'Failure',
  }),
  function: (value: Function) => ({
    message: 'Function error',
    functionName: value.name,
    functionString: value.toString(),
  }),
  object: (value: object) => ({
    message: 'Object error',
    ...value,
  }),
  default: (value: unknown) => ({
    message: String(value),
    originalValue: value,
  }),
}

const typeGuards = {
  isEmpty: (value: unknown): value is undefined | null | '' =>
    value === undefined || value === null || value === '',
  isError: (value: unknown): value is Error => value instanceof Error,
  isObject: (value: unknown): value is object =>
    typeof value === 'object' && value !== null,
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isFunction: (value: unknown): value is Function => typeof value === 'function',
} as const

// 生成错误对象
const standardizeError = <U>(err: U): U => {
  const toErrorObject = (error: Error) => ({
    message: error.message,
    name: error.name,
    stack: error.stack,
  })

  // 使用策略模式处理不同类型的错误
  const processError = (value: unknown): Record<string, unknown> => {
    if (typeGuards.isString(value)) return errorStrategies.string(value)
    if (typeGuards.isNumber(value)) return errorStrategies.number(value)
    if (typeGuards.isBoolean(value)) return errorStrategies.boolean(value)
    if (typeGuards.isFunction(value)) return errorStrategies.function(value)
    if (typeGuards.isObject(value)) return errorStrategies.object(value)
    return errorStrategies.default(value)
  }

  return (
    typeGuards.isEmpty(err)
      ? toErrorObject(new Error('Empty error'))
      : typeGuards.isError(err)
        ? toErrorObject(err)
        : processError(err)
  ) as U
}

type BaseError = {
  [key: string]: unknown
}

// 合并错误扩展
const extendError = <U>(err: U, errorExt?: Record<string, unknown>): U =>
  errorExt ? ({ ...err, ...errorExt } as U) : err

export const to = <T, U = Error & BaseError>(
  promise: Promise<T>,
  errorExt?: Record<string, unknown>,
) => {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<
      [U, undefined]
    >((err: U) => [extendError(standardizeError(err), errorExt), undefined])
}
