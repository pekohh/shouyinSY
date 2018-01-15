// 采用es6的方式创建类
export default class Goods {
  constructor ({id, name, price}) {
    this.goodsId = id
    this.goodsName = name
    this.price = price
    this.count = 1
  }
}
