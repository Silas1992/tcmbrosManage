<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>消费记录</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input @keyup.enter.native="getConsumList" placeholder="请输入内容" v-model="name" clearable @clear="getConsumList">
                        <el-button slot="append" icon="el-icon-search" @click="getConsumList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="list" :row-class-name="tableRowClassName"
            show-summary :summary-method="getSummaries" border stripe size="small">
                <el-table-column align="center" label="单号" prop="order_no" width="180"></el-table-column>
                <el-table-column align="center" label="商品" prop="goods_name" width="150"></el-table-column>
                <el-table-column align="center" label="商品类型" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.goods_type == 1">服务商品</span>
                        <span v-else-if="scope.row.goods_type == 2">美团商品</span>
                        <span v-else-if="scope.row.goods_type == 5">实体商品</span>
                        <span v-else-if="scope.row.goods_type == 6">按次服务</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="价格" prop="price" width="150"></el-table-column>
                <el-table-column align="center" label="支付方式" prop="pay_type" width="150"></el-table-column>
                <el-table-column align="center" label="会员"  width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.member_name == ''">散客</span>
                        <span v-else>{{scope.row.member_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="卡号" prop="card_no" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.card_no == ''">——</span>
                        <span v-else>{{scope.row.card_no}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="完成人员" prop="employee" width="150"></el-table-column>
                <el-table-column align="center" label="消费时间" prop="create_time" width="180"></el-table-column>                
            </el-table>

            <!-- 分页区域 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pagenum"
                :page-sizes="[5, 10, 100, 500]"
                :page-size="pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
import cloudbase from "@cloudbase/js-sdk";
export default {
    data(){
        
        return{
            //获取用户列表的参数对象
            pagenum:1,
            pagesize:10,
            list:[],
            name:'',
            total:0,
            //查询到的用户对象
            orderInfo:{},
            currentSub:''
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getConsumList()
    },
    methods:{
        async getSub(name){
            if(name == 'tcmbros' || name == 'tcmbro1'){
                this.currentSub = name
            }else{
                //根据ID查询用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("member")
                .where({
                    username:name
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询用户信息失败！')
                }
                let member = result.data[0]
                this.currentSub = member.sub_id
            }
        },
        handleSizeChange(newSize){
            this.pagesize = newSize
            this.getConsumList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getConsumList()
        },
        editDialogClosed(){

        },
        tableRowClassName({row,rowIndex}) {
            console.log('这个是第几个有颜色啊',rowIndex)
            if (row.member_name == '' ) {
                return 'warning-row';
            } else if(rowIndex === 1){
                return 'success-row'
            }
            return ''
        },
        
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '总价';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            console.log('此时的values值为',values)
            if (!values.every(value => isNaN(value))&&values.every(value => (value<90000))) {
                sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                    return prev + curr;
                } else {
                    return prev;
                }
                }, 0);
                sums[index] += ' 元';
            } else {
                sums[index] = 'N/A';
            }
            });

            return sums;
        },
        //获取会员列表
        async getConsumList(){
            console.log('当前页数',this.pagenum,'当前长度',this.pagesize)
            try {
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "get-consumRecord",
                    data: {
                        page: this.pagenum,
                        pagesize: this.pagesize,
                        name:this.name,
                        state:1,
                        sub_id:this.currentSub,
                        orderstr:'create_time',
                        ordertype:'desc'
                    },
                })
                this.list = res.result.data
                //2、查询数组
                const resT = await this.$cloudbase.callFunction({
                    name: "get-consumRecord",
                    data: {
                        name:this.name,
                        state:1,
                        sub_id:this.currentSub
                    },
                })
                this.total = resT.result.data.length
            } catch (e) {
                this.orderlist = e+'我是错误的';
            }

        }
    }
}
</script>

<style>
  .el-table .warning-row {
    color:red;
  }

  .el-table .success-row {
    background:  #f0f9eb;
  }

</style>
