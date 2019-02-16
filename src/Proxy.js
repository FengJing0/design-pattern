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

/** */
let star = {
  name: '张XX',
  age: 35,
  phone: 123456456
}

let agent = new Proxy(star, {
  get (target, key) {
    if (key === 'phone') {
      return 88888888
    }
    if (key === 'price') {
      return 120000
    }
    return target[key]
  },
  set (target, key, val) {
    if (key === 'customPrice') {
      if (val < 100000) {
        throw new Error('to lower')
      } else {
        target[key] = val
        return true
      }
    }
  }
})

console.log(agent.name)
console.log(agent.age)
console.log(agent.phone)
console.log(agent.price)
agent.customPrice = 120000
console.log(agent.customPrice)