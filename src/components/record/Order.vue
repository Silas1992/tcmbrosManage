<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>单据列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" @keyup.enter.native="getOrderList" v-model="name" clearable @clear="getOrderList">
                        <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="orderlist" border :row-class-name="tableRowClassName" 
            show-summary :summary-method="getSummaries" stripe size="small">
                <el-table-column align="center" label="单号" prop="order_no" width="180"></el-table-column>
                <el-table-column align="center" label="会员" prop="member_name" width="100"></el-table-column>
                <el-table-column align="center" label="电话" prop="member_tel" width="150"></el-table-column>
                <el-table-column align="center" label="总价" prop="total_price" width="150"></el-table-column>
                <el-table-column align="center" label="支付方式" prop="pay_type" width="150"></el-table-column>
                <el-table-column align="center" label="卡号" prop="card_no" width="150"></el-table-column>
                <el-table-column align="center" label="创建日期" prop="create_time" width="150"></el-table-column>
                <el-table-column align="center" label="操作" width="250">
                    <template slot-scope="scope">
                        <!-- 订单详情 -->
                        <el-button type="warning" icon="el-icon-info" size="mini" 
                        :data="scope.id" @click="showEditDialog(scope.row._id)"></el-button>
                        <!-- 修改订单 -->
                        <el-button type="primary" icon="el-icon-edit" 
                        size="mini" @click="showEditDialog(scope.row._id)"></el-button>
                        <!-- 撤销按钮 -->
                        <el-button type="danger" icon="el-icon-back" 
                        size="mini" @click="backout(scope.row.order_no,scope.row.member_tel,scope.row.total_price)"></el-button>
                    </template>
                </el-table-column>
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

        <!-- 单据详情的对话框 -->
        <el-dialog
        title="订单详情" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed" >

            <el-row v-if="orderInfo.member_tel !== undefined" style="margin-top:15px">
                
                <el-col :span="3">
                    <el-tag
                        type='success'
                        effect="dark">
                        卡号
                    </el-tag>
                    <el-tag style="margin-top:10px"
                        type='success'
                        effect="plain">
                        {{ orderInfo.card_no }}
                    </el-tag>
                </el-col>
                <el-col :span="3">
                    <el-tag
                        type='info'
                        effect="dark">
                        姓名
                    </el-tag>
                    <el-tag
                        style="margin-top:10px"
                        type='info'
                        effect="plain">
                        {{ orderInfo.member_name}}
                    </el-tag>
                </el-col>
                <el-col :span="4">
                    <el-tag
                        type='danger'
                        effect="dark">
                        电话
                    </el-tag>
                    <el-tag 
                        style="margin-top:10px"
                        type='danger'
                        effect="plain">
                        {{ orderInfo.member_tel }}
                    </el-tag>
                </el-col>
                <el-col :span="5">
                    <!-- 选择支付方式 -->
                    <el-tag effect="dark">
                        {{orderInfo.pay_type}}
                    </el-tag>
                    <el-tag 
                        style="margin-top:10px"
                        type='danger'
                        effect="plain">
                        {{ orderInfo.member_tel }}
                    </el-tag>
                </el-col>
            </el-row>
            <el-table :data="orderInfo.shopping_list" size="small" style="margin-bottom:10px" height="180">
                
                <el-table-column label="商品编号" prop="goods_no" width="100"></el-table-column>
                <el-table-column label="名称" prop="goodsname" width="120"></el-table-column>
                <el-table-column label="单位" prop="unit" width="100"></el-table-column>
                <el-table-column label="价格" prop="price" width="100"></el-table-column>
                <el-table-column label="完成人员" prop="employee" width="100">
                </el-table-column>
            </el-table>

            
            <!-- 备注 -->
            <div class="remark">备注信息：</div>
            <el-input disabled
                type="textarea"
                :rows="2"
                placeholder="无"
                v-model="orderInfo.remark">
            </el-input>
            <div class="totalPrice">订单总价：{{orderInfo.total_price}}</div>

        </el-dialog>
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
            orderlist:[],
            name:'',
            total:0,
            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            //查询到的用户对象
            orderInfo:{},
            currentSub:''
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getOrderList()
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
        tableRowClassName({row,rowIndex}) {
            console.log('这个是第几个有颜色啊',rowIndex)
            if (row.member_name == '散客' ) {
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
        handleSizeChange(newSize){
            this.pagesize = newSize
            this.getOrderList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getOrderList()
        },
        editDialogClosed(){

        },
        //撤销操作
        async backout(id,tel,total_price){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name == 'tcmbro1'){
                const confirmResult = await this.$confirm(
                    '此操作将永久撤销之前所有操作，返回余额，并删除记录，是否继续?', '提示', 
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }

                //调用根据ID删除用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("order")
                .where({
                    order_no:id
                })
                .remove()
                console.log('订单的删除结果',result)
                if(result.deleted !== 1){
                    return this.$message.error('撤销用户订单失败！')
                }

                this.$message.success('撤销用户订单成功！')

                const resBuy = await this.$cloudbase.callFunction({
                    name: "delBuyRecord",
                    data: {
                        id:id
                    },
                })
                console.log('删除后的结果为',resBuy.result)

                const resDeduct = await this.$cloudbase.callFunction({
                    name: "delDeductRecord",
                    data: {
                        id:id
                    },
                })
                console.log('删除后的结果为',resDeduct.result)

                //将之前的余额返还到该用户的账户中！
                console.log('当前用户的电话和总价为',tel,total_price)
                //1.根据电话号码查询余额
                const resM = await db.collection("member")
                .where({
                    tel:tel
                }).get()
                let balance = resM.data[0].balance
                let consum_points = resM.data[0].consum_points
                let cumulant = resM.data[0].cumulant
                console.log('查询到的结果为',resM.data[0])
                const resUpdateMemeber = await db.collection("member")
                .where({
                    tel:tel
                })
                .update({
                    balance:balance + total_price,
                    consum_points:consum_points - total_price,
                    cumulant:cumulant - total_price
                })
                console.log('修改完毕',resUpdateMemeber)
                this.getOrderList()
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }
        },
        //修改操作操作
        async UpdateOrderById(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name == 'tcmbro1'){
                const confirmResult = await this.$confirm(
                    '此操作将永久删除该用户, 是否继续?', '提示', 
                    {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }
                ).catch(err => err)

                if(confirmResult !== 'confirm'){
                    return this.$message.info('已取消删除')
                }

                //调用根据ID删除用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("order")
                .doc(id)
                .remove()
                if(result.deleted !== 1){
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                
                this.getOrderList()
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }
        },
        
        
        
        //展示Edit对话框
        async showEditDialog(id){
            //根据ID查询用户信息接口
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            const db = app.database();
            const result = await db.collection("order")
            .where({
                _id:id
            })
            .get()
            if(result.length == 0){
                return this.$message.error('查询单据信息失败！')
            }
            this.editDialogVisible=true
            this.orderInfo = result.data[0]
            console.log(result,this.orderInfo)
        },
        //获取单据列表
        async getOrderList(){
            try {
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "get-order",
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
                this.orderlist = res.result.data
                //2、查询数组
                const resT = await this.$cloudbase.callFunction({
                    name: "get-order",
                    data: {
                        name:this.name,
                        sub_id:this.currentSub,
                        state:1
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

    .totalPrice{
        font-size: 18px;
        line-height: 1.7;
        font-family: "微软雅黑";
        margin-top: 20px;
    }
    .remark{
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 10px;
    }
    .el-table .warning-row {
        color:red;
    }

    .el-table .success-row {
        background:  #f0f9eb;
    }

</style>
