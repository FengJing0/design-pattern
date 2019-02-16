import { readonly,deprecate } from 'core-decorators'

class Circle {
  draw () {
    console.log('画一个圆形')
  }
}

class Decorator {
  constructor (circle) {
    this.circle = circle
  }
  draw () {
    this.circle.draw()
    this.setRedBorder(circle)
  }
  setRedBorder (circle) {
    console.log('设置红色边框')
  }
}

let circle = new Circle()
circle.draw()
console.log('~~~~~');

let dec = new Decorator(circle)
dec.draw()



/*测试 */

function testDec (isDec) {
  return function (target) {
    target.isDec = isDec
  }
}

@testDec(true)
class Demo {

}

// alert(Demo.isDec)

/*混合 */

function mixins (...list) {
  return function (target) {
    Object.assign(target.prototype, ...list)
  }
}

const Foo = {
  foo () {
    alert('foo')
  }
}

@mixins(Foo)
class MyClass {

}

let obj = new MyClass()

// obj.foo()

/*自动打印 */
console.log('~~~~~');
function log (target, name, descriptor) {
  let oldValue = descriptor.value
  console.log()
  descriptor.value = function () {
    console.log(`calling ${name}`, arguments)
    return oldValue.apply(this, arguments)
  }
  return descriptor
}

class Math {
  @log
  add (a, b) {
    return a + b
  }
}

const math = new Math()
const result = math.add(1, 2)

console.log(result)

/**core-decorators */

class Person {
  @readonly
  name () {
    return 'tom'
  }
}

let p = new Person
console.log(p.name())
// p.name = function () { }

