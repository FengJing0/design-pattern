import StateMachine from 'javascript-state-machine'
import $ from 'jquery'

// 状态
class State {
  constructor (color) {
    this.color = color
  }
  handle (context) {
    console.log(`turn to ${this.color} light`)
    context.setState(this)
  }
}

// 主体
class Context {
  constructor () {
    this.state = null
  }
  getState () {
    return this.state
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

/*******/

let fsm = new StateMachine({
  init: '收藏',
  transitions: [
    {
      name: 'doStore',
      from: '收藏',
      to: '取消收藏'
    },
    {
      name: 'deleteStore',
      from: '取消收藏',
      to: '收藏'
    }
  ],
  methods: {
    onDoStore: function () {
      alert('收藏成功')
      updateText()
    },
    onDeleteStore: function () {
      alert('取消收藏成功')
      updateText()
    }
  }
})

let $btn = $('#btn1')

$btn.click(function () {
  if (fsm.is('收藏')) {
    fsm.doStore()
  } else {
    fsm.deleteStore()
  }
})

function updateText () {
  $btn.text(fsm.state)
}

updateText()

/******/
let fsm = new StateMachine({
  init: 'pending',
  transitions: [
    {
      name: 'resolve',
      from: 'pending',
      to: 'fullfilled'
    },
    {
      name: 'reject',
      from: 'pending',
      to: 'rejected'
    }
  ],
  methods: {
    onResolve: function (state, data) {
      data.successList.forEach(fn => fn())
    },
    onReject: function (state, data) {
      data.failList.forEach(fn => fn())
    }
  }
})

class MyPromise {
  constructor (fn) {
    this.successList = []
    this.failList = []

    fn(() => {
      fsm.resolve(this)
    }, () => {
      fsm.reject(this)
    })
  }
  then (successFn, failFn) {
    this.successList.push(successFn)
    this.failList.push(failFn)
  }
}

function loadImg (src) {
  const promise = new MyPromise((resolve, reject) => {
    let img = document.createElement('img')
    img.onload = function () {
      resolve(img)
    }
    img.onerror = function () {
      reject()
    }
    img.src = src
  })
  return promise
}

let src = 'https://b-gold-cdn.xitu.io/v3/static/img/logo.a7995ad.svg'
let result = loadImg(src)

result.then(function () {
  console.log('ok1')
}, function () {
  console.log('fail1')
})
console.log(fsm.state)

result.then(function () {
  console.log('ok2')
}, function () {
  console.log('fail2')
})
