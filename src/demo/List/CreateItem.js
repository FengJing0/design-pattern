import Item from './Item'

function createDiscount (data) {
  return new Proxy(data, {
    get (target, key, receiver) {
      if (key === 'name') {
        return `${target[key]} [折扣]`
      }
      if (key === 'price') {
        return target[key] * 0.8
      }
      return target
    }
  })
}

export default function (list, data) {
  if (data.discount) {
    data = createDiscount(data)
  }
  return new Item(list, data)
}