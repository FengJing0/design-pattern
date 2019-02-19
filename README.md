# js的设计模式

## SOLID五大设计原则

- S - 单一职责原则;
- O - 开放封闭原则
- L - 李氏置换原则
- I - 接口独立原则
- D - 依赖导致原则

### S - 单一职责原则

- 一个程序只做好一件事
- 如果功能过于复杂就拆分开，每个部分保持独立

### O - 开放封闭原则

- 对扩展开放，对修改封闭
- 增加需求时，扩展新代码，而非修改已有代码
- 软件设计的终极目标

### L - 李氏置换原则

- 子类能覆盖父类
- 父类能出现的地方子类就能出现
- JS中使用较少（弱类型，继承使用较少）

### I - 接口独立原则

- 保持接口的单一独立，避免出现“胖接口”
- JS中没有接口（typescript例外），使用较少
- 类似于单一职责原则，这里更关注接口

### D - 依赖导致原则

- 面向接口编程，依赖于抽象而不依赖于具体
- 使用方只关注接口而不关注具体类的实现
- JS中使用较少（没有接口&弱类型）

***

## 设计模式

1. [工厂模式](#工厂模式)
2. [单例模式](#单例模式)
3. [适配器模式](#适配器模式)
4. [装饰器模式](#装饰器模式)
5. [代理模式](#代理模式)
6. [外观模式](#外观模式)
7. [观察者模式](#观察者模式)
8. [迭代器模式](#迭代器模式)
9. [状态模式](#状态模式)
10. [其他设计模式](#其他设计模式)

***

### 工厂模式

- 将 `new` 操作单独封装
- 遇到 `new` 时，就要考虑是否该使用工厂模式

```javascript
class JQuery{
  constrctor(selector){
    let slice = Array.prototype.slice
    let dom = slice.call(document.querySelectorAll(selector))
    let len = dom ? dom.length : 0
    for(let i = 0; i < len; i++){
      this[i] = dom[i]
    }
    this.length = len
    this.selector = selector || ''
  }
  append(node){}
  ...api
}

window.$ = function (selector){
  return new JQuery(selector)
}
```

***

### [单例模式](./src/SingleObject.js)

- 系统中被唯一使用
- 一个类只有一个实例

```javascript
class SingleObject {
  login () {
    console.log('login')
  }
}

SingleObject.getInstance = (function () {
  let instance
  return function () {
    if (!instance) {
      instance = new SingleObject()
    }
    return instance
  }
})()

let obj1 = SingleObject.getInstance()
obj1.login()

let obj2 = SingleObject.getInstance()
obj2.login()

console.log(obj1 === obj2)
```
***

### [适配器模式](./src/Adaptee.js)

- 旧接口格式和使用者不兼容
- 中间加一个适配转换接口

```javascript
class Adaptee {
  specificRequest () {
    return '德国标准插头'
  }
}

class Target {
  constructor () {
    this.adaptee = new Adaptee()
  }

  request () {
    let info = this.adaptee.specificRequest()
    return `${info} - 转换器 - 中国标准插头`
  }
}

let target = new Target()
let res = target.request()
console.log(res)
```

***

### [装饰器模式](./src/Decorator.js)

- 为对象添加新功能
- 不改变其原有的结构

```javascript
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
```
***

### [代理模式](./src/Proxy.js)

- 使用者无权访问目标对象
- 中间加代理，通过代理授权和控制

```javascript
class ReadImg {
  constructor (fileName) {
    this.fileName = fileName
    this.loadFromDisk()
  }
  display () {
    console.log('display... ' + this.fileName)
  }
  loadFromDisk () {
    console.log('loading... ' + this.fileName)
  }
}

class ProxyImg {
  constructor (fileName) {
    this.realImg = new ReadImg(fileName)
  }
  display () {
    this.realImg.display()
  }
}

const proxyImg = new ProxyImg('1.png')
proxyImg.display()
```
***

### 外观模式

- 为子系统中的一组接口提供了一个高层接口
- 使用者使用这个高层接口

```javascript
function bindEvent(elem,type,selector,fn){
  if(fn == null){
    if = selector
    selector = null
  }
  // ...
}

// 调用
bindEvent(elem,'click','#div',fn)
bindEvent(elem,'click',fn)
```

***

### [观察者模式](./src/Observer.js)

- 发布&订阅
- 一对多

```javascript
// 主题，保存状态，状态变化之后出发所有观察者对象
class Subject {
  constructor () {
    this.state = 0
    this.observers = []
  }
  getState () {
    return this.state
  }
  setState (state) {
    this.state = state
    this.notifyAllObservers()
  }
  notifyAllObservers () {
    this.observers.forEach(observer => {
      observer.update()
    })
  }
  attach (observer) {
    this.observers.push(observer)
  }
}

// 观察者
class Observer {
  constructor (name, subject) {
    this.name = name
    this.subject = subject
    this.subject.attach(this)
  }
  update () {
    console.log(`${this.name} update, state: ${this.subject.getState()}`)
  }
}

let s = new Subject()
let o1 = new Observer('o1', s)
let o2 = new Observer('o2', s)
let o3 = new Observer('o3', s)

s.setState(1)
s.setState(2)
s.setState(3)
```
***

### [迭代器模式](./src/Iterator.js)

- `顺序`访问一个集合
- 使用者无需知道集合的内部结构（封装）

```javascript
class Iterator {
  constructor (container) {
    this.list = container.list
    this.index = 0
  }
  next () {
    if (this.hasNext()) {
      return this.list[this.index++]
    }
    return null
  }
  hasNext () {
    return this.index < this.list.length
  }
}

class Container {
  constructor (list) {
    this.list = list
  }
  getIterator () {
    return new Iterator(this)
  }
}

let arr = [1, 2, 3, 4, 5, 6]
let container = new Container(arr)
let iterator = container.getIterator()
while (iterator.hasNext()) {
  console.log(iterator.next())
}
```

***

### [状态模式](./src/State.js)

- 一个对象有状态变化
- 每次状态变化都会触发一个逻辑
- 不能总用 if...else 来控制

```javascript
// 状态
class State{
  constructor (color) {
    this.color = color
  }
  handle (context) {
    console.log(`turn to ${this.color} light`)
    context.setState(this)
  }
}

// 主体
class Context{
  constructor () {
    this.state = null
  }
  getState () {
    return  this.state
  }
  setState (state) {
    this.state = state
  }
}

let context = new Context()

let green = new State('green')
let yellow = new State('yellow')
let red = new State('red')

green.handle(context)
console.log(context.getState())

yellow.handle(context)
console.log(context.getState())

red.handle(context)
console.log(context.getState())
```

***

### 其他设计模式