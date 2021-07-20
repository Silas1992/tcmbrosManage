<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>提成记录</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" @keyup.enter.native="getList" v-model="name" clearable @clear="getList">
                        <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="8">
                    <el-date-picker
                        v-model="timeValue"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="2">
                    <el-button type="primary"  @click="getList">查询</el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <el-table :data="list" :row-class-name="tableRowClassName" border show-summary stripe size="small">
                <el-table-column align="center" label="单号" prop="order_no" width="180"></el-table-column>
                <el-table-column align="center" label="职员" prop="employee" width="100"></el-table-column>
                <el-table-column align="center" label="商品" prop="goodsname" width="150"></el-table-column>
                <el-table-column align="center" label="价格" prop="price" width="150"></el-table-column>
                <el-table-column align="center" label="类型" prop="de_type" width="150"></el-table-column>
                <el-table-column align="center" label="收益" prop="de_money" width="150"></el-table-column>
                <el-table-column align="center" label="会员" prop="member_name" width="150">
                    <template slot-scope="scope">
                        <span v-if="scope.row.member_name == ''">——</span>
                        <span v-else>{{scope.row.member_name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="卡号" prop="card_no" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.card_no == ''">——</span>
                        <span v-else>{{scope.row.card_no}}</span>
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
            timeValue:[],
            currentSub:''
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getList()
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
            this.getList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getList()
        },
        editDialogClosed(){

        },
        tableRowClassName({row,rowIndex}) {
            if (row.member_name == '' ) {
                return 'warning-row';
            } else if(rowIndex === 1){
                return 'success-row'
            }
            return ''
        },
        
        //获取会员列表
        async getList(){
            let times = this.timeValue
            let startTime = ''
            let endTime = ''
            if(times !== null && times.length !== 0){
                startTime = this.getFormatDate(times[0])+" 00:00:00"
                endTime = this.getFormatDate(times[1])+" 23:59:59"
                console.log(startTime,endTime)
            }
            try {
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "get-deductRecord",
                    data: {
                        page: this.pagenum,
                        pagesize: this.pagesize,
                        name:this.name,
                        state:1,
                        startTime:startTime,
                        endTime:endTime,
                        sub_id:this.currentSub,
                        orderstr:'create_time',
                        ordertype:'desc'
                    },
                })
                this.list = res.result.data
                //2、查询数组
                const resT = await this.$cloudbase.callFunction({
                    name: "get-deductRecord",
                    data: {
                        name:this.name,
                        startTime:startTime,
                        endTime:endTime,
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

    .el-table .warning-row {
        color:red;
    }

    .el-table .success-row {
        background:  #f0f9eb;
    }

</style>
