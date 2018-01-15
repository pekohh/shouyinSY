<template>
  <div class="pos">
   <div>
   		<el-row>
   			<el-col :span="7" class="pos-order" id="order-list">
         <!--点餐 -->
   				<el-tabs>
   					<el-tab-pane label="点餐">
              <el-table :data="tableData" border show-summary style="width: 100%" >
                <el-table-column prop="goodsName" label="商品"  ></el-table-column>
                <el-table-column prop="count" label="量" width="50"></el-table-column>
                <el-table-column prop="price" label="金额" width="70"></el-table-column>
                <el-table-column  label="操作" width="100" fixed="right">
                  <template scope="scope">
                    <el-button type="text" size="small" @click="delSingleGoods(scope.row)">删除</el-button>
                    <el-button type="text" size="small" @click="addOrderList(scope.row)">增加</el-button>
                 </template>
                </el-table-column>
              </el-table>

              <div class="totalDiv">
                <small>数量：</small>
                <strong>{{totalCount}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                <small>总计：</small>
                <strong>{{totalMoney}}</strong>元
              </div>

              <div class="order-btn">
                <el-button type="warning">挂单</el-button>
                <el-button type="danger" @click="delAllGoods()">删除</el-button>
                <el-button type="success" @click="checkout()">结帐</el-button>
              </div>
            </el-tab-pane>
   					<el-tab-pane label="挂单">挂单</el-tab-pane>
   					<el-tab-pane label="外卖">外卖</el-tab-pane>
   				</el-tabs>
   			</el-col>

   			<!--商品展示 -->
   			<el-col :span="17">
          <!--常用商品-->
   				<div class="often-goods">
            <div class="title">常用商品</div>
            <div class="often-goods-list">
              <ul>
                  <li v-for="goods in oftenGoods" @click='addOrderList(goods)'>
                    <span>{{goods.goodsName}}</span>
                    <span class="o-price">￥{{goods.price}}元</span>
                  </li>
              </ul>
            </div>
          </div>

          <!--分类商品 -->
          <div class="goods-type">
            <el-tabs>
              <el-tab-pane label="汉堡">
                <ul class="cookList">
                  <li v-for="goods in type0Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"/></span>
                    <span class="foodName">{{goods.goodsName}}</span>
                    <span class="foodPrice">￥{{goods.price}}</span>
                  </li>
                </ul>
              </el-tab-pane>

              <el-tab-pane label="小食">
                <ul class="cookList">
                  <li v-for="goods in type1Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"/></span>
                    <span class="foodName">{{goods.goodsName}}</span>
                    <span class="foodPrice">￥{{goods.price}}</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="饮料">
                <ul class="cookList">
                  <li v-for="goods in type2Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"/></span>
                    <span class="foodName">{{goods.goodsName}}</span>
                    <span class="foodPrice">￥{{goods.price}}</span>
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane label="套餐">
                <ul class="cookList">
                  <li v-for="goods in type3Goods" @click="addOrderList(goods)">
                    <span class="foodImg"><img :src="goods.goodsImg" width="100%"/></span>
                    <span class="foodName">{{goods.goodsName}}</span>
                    <span class="foodPrice">￥{{goods.price}}</span>
                  </li>
                </ul>
              </el-tab-pane>
            </el-tabs>
          </div>
   			</el-col>  
   		</el-row>
   </div>
  </div>
</template>
 
<script  type="text/ecmascript-6">
import Goods from 'common/js/goods'
import axios from 'axios'
export default {
  name: 'Pos',
  data () {
    return {
      tableData: [], // 订单列表的值,
      totalCount: 0, // 订单商品总数量
      totalMoney: 0, // 订单总价格
      oftenGoods: [],
      type0Goods: [],
      type1Goods: [],
      type2Goods: [],
      type3Goods: []
    }
  },
  mounted () {
    var orderHeight = document.body.clientHeight
    document.getElementById('order-list').style.height = orderHeight + 'px'
  },
  created () {
   // 读取常用商品列表
    axios.get('http://jspang.com/DemoApi/oftenGoods.php').then(res => {
      this.oftenGoods = res.data
    })
    // 读取分类商品列表
    axios.get('http://jspang.com/DemoApi/typeGoods.php').then(res => {
      this.type0Goods = res.data[0]
      this.type1Goods = res.data[1]
      this.type2Goods = res.data[2]
      this.type3Goods = res.data[3]
    })
  },
  methods: {
    // 点击分类列表食品添加到已购买上
    addOrderList (goods) {
      this.totalCount = 0
      this.totalMoney = 0
      let isHave = false // 标签

      // 判断订单列表中是否已经有此商品了,some返回布尔值
      isHave = this.tableData.some(item => item.goodsId === goods.goodsId)

      if (isHave) {
        // 存在就进行数量添加，filter返回符合条件的数组
        this.tableData.forEach((item) => {
          if (item.goodsId === goods.goodsId) {
            item.count ++
          }
        })
      } else {
        // 不存在就加入到tableData数组
        let newGoods = new Goods({
          id: goods.goodsId,
          name: goods.goodsName,
          price: goods.price
        })
        this.tableData.push(newGoods)
      }
      this.getAllMoney()
    },
    // 删除订单列表的一项
    delSingleGoods (goods) {
      this.tableData = this.tableData.filter(item => item.goodsId !== goods.goodsId)
      this.getAllMoney()
    },
    // 清空所有订单
    delAllGoods () {
      this.tableData = []
      this.totalCount = 0
      this.totalMoney = 0
    },
    // 模拟结帐
    checkout () {
      if (this.tableData.length !== 0) {
        this.tableData = []
        this.totalCount = 0
        this.totalMoney = 0
        this.$message({
          message: '结账成功，感谢你又为店里出了一份力!',
          type: 'success'
        })
      } else {
        this.$message.error('不能空结。老板了解你急切的心情！')
      }
    },
    // 汇总数量和金额
    getAllMoney () {
      this.totalCount = 0
      this.totalMoney = 0
      if (this.tableData) {
        this.tableData.forEach((item) => {
          this.totalCount += item.count
          this.totalMoney += item.price * item.count
        })
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus" >
.pos
  font-size: 12px
  .pos-order
    background-color:#f9fafc
    border-right: 1px solid #c0ccda
    .order-btn
      margin-top:10px
      text-align:center
    .totalDiv {
      height: auto
      overflow: hidden
      text-align: right
      font-size:16px
      background-color:#fff
      border-bottom: 1px solid #E5E9F2
      padding:10p
    }
  .often-goods
    .title
      height:20px
      border-bottom:1px solid #D3DCE6
      background-color:#f9fafc
      padding:10px
    .often-goods-list li
      float:left
      border:1px solid #E5E9F2
      padding:10px
      margin:5px
      background-color:#fff
      .o-price
        color:#58b7ff
  .goods-type
    clear: both
    .cookList li
      width:23%
      border:1px solid #e5e9f2
      height: auto
      overflow: hidden
      background-color:#fff
      padding:2px 
      float:left
      margin:2px
      cursor:pointer
      span
        display:block
        float:left
      .foodImg
        width:40%
      .foodName
        font-size:16px
        padding-left:10px
        color:brown
      .foodPrice
        font-size:16px
        padding-left:10px
        padding-top:10px


</style>