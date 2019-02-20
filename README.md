# Javascript 设计模式

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

- `顺序` 访问一个集合
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

- 原型模式
  - clone自己，生成一个新对象
  - java默认有clone接口，不用自己实现

- 桥接模式
  - 用于把抽象化与实现化解耦
  - 使得二者可以独立变化
  - （未找到JS中的经典应用）

- 组合模式
  - 生成树形结构，表示“整体-部分”关系
  - 让整体和部分都具有一直的操作方式

- 享元模式
  - 共享内存（主要考虑内存，而非效率）
  - 相同的数据，共享使用
  - （JS中未找到经典应用场景）

- 策略模式
  - 不同策略分开处理
  - 避免出现大量if...else 或者 switch...case
  - （JS中未找到经典应用场景）

- 模板方法模式
  ```javascript
  class Foo{
    handle(){
      handle1()
      handle2()
      handle3()
    }
    handle1(){ console.log('1') }
    handle2(){ console.log('2') }
    handle3(){ console.log('1') }
  }
  ```

- 职责链模式
  - 一步操作可能分为多个职责角色来完成
  - 把这些角色都分开，然后用一个链串起来
  - 将发起者和各个处理者进行隔离
  ```javascript
  class Action {
    constructor(name){
      this.name = name
      this.nextAction = null
    }
    setNextAction(action){
      this.nextAction = action
    }
    handle(){
      console.log(`${this.name}` 审批)
      if(this.nextAction != null){
        this.nextAction.handle()
      }
    }
  }

  let a1 = new Action('组长')
  let a2 = new Action('经理')
  let a3 = new Action('总监')
  a1.setNextAction(a2)
  a2.setNextAction(a3)
  a1.handle()
  ```

- 命令模式
  - 发送者 -> 命令对象 -> 接受者
  ```javascript
  // 接受者
  class Receiver{
    exec(){
      console.log('执行')
    }
  }
  // 命令者
  class Command{
    constructor(receiver){
      this.receiver = receiver
    }
    cmd(){
      console.log('执行命令')
      this.receiver.exec()
    }
  }
  // 触发者
  class Invoker{
    constructor(command){
      this.command = command
    }
    invoke(){
      console.log('开始')
      this.command.cmd()
    }
  }
  let soldier = new Receiver()
  let trumpeter = new Command(soldier)
  let general = new Invoker(trumpeter)
  general.invoke()
  ```

- 备忘录模式
  - 随时记录一个对象的状态变化
  - 随时可以恢复之前的某个状态（如撤销功能）
  - 未找到JS中经典应用，除了一些工具（如编辑器）

- 中介者模式
  ```javascript
  class A {
    constructor(){
      this.number = 0
    }
    setNumber(num,m){
      this.number = num
      if(m){
        m.setB()
      }
    }
  }
  class B {
    constructor(){
      this.number = 0
    }
    setNumber(num,m){
      this.number = num
      if(m){
        m.setA()
      }
    }
  }

  class Mediator{
    constructor(a,b){
      this.a = a
      this.b = b
    }
    setA(){
      let number = this.b.number
      this.a.setNumber(number/100)
    }
    setB(){
      let number = this.a.number
      this.b.setNumber(number*100)
    }
  }

  let a = new A()
  let b = new B()
  let m = new Mediator(a,b)
  a.setNumber(100,m)
  console.log(a.number,b.number)
  b.setNumber(100,m)
  console.log(a.number,b.number)
  ```

- 访问者模式
  - 讲数据操作和数据结构进行分离
  - 使用场景不多

- 解释器模式
  - 描述语言语法如何定义，如何解释和编译
  - 用于专业场景