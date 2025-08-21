export default function myNew(_constructor, ...args) {
  // 1.创建一个空对象
  //   const obj = {}

  // 2.将空对象的原型指向构造函数的原型
  const instance = Object.create(_constructor.prototype)

  // 3.将这个新对象作为构造函数的this值，通过apply调用构造函数，传入参数
  const res = _constructor.apply(instance, args)

  // 4.处理返回值
  // 如果构造函数返回一个简单类型的值，则返回这个值
  // 否则返回新创建的对象

  const isObject = typeof res === 'object' && res !== null
  const isFunction = typeof res === 'function'

  // 如果构造函数返回一个对象或函数，则返回这个对象或函数
  if (isObject || isFunction) {
    return res
  }

  return instance
}

function Person(name, age) {
  this.name = name
  this.age = age
}

Person.prototype.sayHello = function () {
  console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`)
}

const person = myNew(Person, 'John', 20)
person.sayHello() // `Hello, my name is John and I am 20 years old.`
