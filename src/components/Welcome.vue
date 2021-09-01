
<template>
    <div>
        <div class="head">
            <h3>今日统计</h3>
            <span style="margin-top:20px" v-if="selected == 1">（当日）</span>
            <span style="margin-top:20px" v-if="selected == 2">（近7日）</span>
            <span style="margin-top:20px" v-if="selected == 3">（近30日）</span>
            <el-row class="btn">
                <el-button @click="selectToday" type="primary" plain>当日</el-button>
                <el-button @click="selectSeven" type="success" plain>近7日</el-button>
                <el-button @click="selectThirty" type="danger" plain>近30日</el-button>
            </el-row>
        </div>
        <el-row>
            <el-col :span="24">
                <div class="grid-content bg-purple-dark" style="padding-left:10px;line-height:38px">
                    新增会员数：{{insertNum}}人
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <div v-if="selected == 1" class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    综合收入：{{freeIn+CardIn+couponIn}}
                </div>
            </el-col>
            <el-col v-if="selected != 3" :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    会员消费金额：{{incomeDate}}元
                </div>
            </el-col>
            <el-col v-if="selected != 3" :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    卡券消费金额：{{customCard}}元
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="6">
                <div v-if="selected != 3" class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    散客收入：{{freeIn}}元
                </div>
            </el-col>
            <el-col v-if="selected != 3" :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    售卡收入：{{CardIn}}元
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple" style="padding-left:10px;line-height:38px">
                    券类收入：{{couponIn}}元
                </div>
            </el-col>
            <el-col :span="6">
                <div class="grid-content bg-purple-light" style="padding-left:10px;line-height:38px">
                    产品收入：{{productIn}}元
                </div>
            </el-col>
        </el-row>
        <div class="head" style="margin-top:50px">
            <h3>员工工作记录</h3>
        </div>
        <div class="employee-work1">
            <el-card class="box-card" shadow="hover" v-for="item in deductList" :key="item.employee">
                <div slot="header" class="clearfix" >
                    <span  style="padding: 3px 0" type="text">员工：{{item.employee}}</span>
                    <el-button v-if="selected == 1" style="float: right; padding: 3px 0px" type="text">收入:{{cutOutNums(item.total)}}元</el-button>
                    <el-button v-else style="float: right; padding: 3px 0px" type="text">项目总数:{{item.num}}个</el-button>
                </div>
                <div class="text item">
                    {{'年份\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'}}
                    {{'类型\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0卡号'}}
                    {{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0会员'}}
                    {{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0名称'}}
                </div>
                <el-scrollbar>
                    <div class="employee-work">
                        <div v-for="o in item.subList" :key="o._id" class="text item" >
                           <span v-if="o.de_money !== 0" > 
                               {{o.create_time}}
                            </span>
                            <span v-if="o.de_money !== 0 && o.card_no !==''">
                                {{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+o.de_type+
                                '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+o.card_no
                                +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + o.member_name}}</span>
                            <span v-else-if="o.card_no == ''">
                                {{
                                '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0散客'+
                                '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+
                                '——'
                                +'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0'+'——'}}</span>
                            
                            <span style="color:red" v-if="o.de_money !== 0" >
                                {{'\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0' 
                                + o.goodsname}}</span>
                        </div>
                    </div>
                </el-scrollbar>
            </el-card>
        </div>
    </div>
    
</template>
<script>
import cloudbase from "@cloudbase/js-sdk";
import { cutOutNum } from '@/utils/decimals';
export default {
    data(){
        return{
            currentSub:'',
            incomeDate:[],
            insertNum:0,
            couponIn:0,
            freeIn:0,
            CardIn:0,
            productIn:0,
            deductList:[],
            selected:1,
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        //获取当日统计数据
        this.getData()
        this.getInsertNum()
        this.getCouponIn()
        this.getFreeIn()
        this.getCardIn()
        this.getProductIn()
        this.getDeductRecord()
        this.getCustomCard()
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
        selectToday(){
            this.selected = 1
            this.getData()
            this.getInsertNum()
            this.getCouponIn()
            this.getFreeIn()
            this.getCardIn()
            this.getProductIn()
            this.getDeductRecord()
            this.getCustomCard()
        },
        cutOutNums(num){
            if(num>0){
                // 截取当前数据到小数点后两位
                let realVal = parseFloat(num).toFixed(2)
                return realVal
            }else{
                return cutOutNum(num,2)
            }
        },
        //点击7天的按钮
        selectSeven(){
            this.selected = 2
            this.getData()
            this.getInsertNum()
            this.getCouponIn()
            this.getFreeIn()
            this.getCardIn()
            this.getProductIn()
            this.getDeductRecord()
            this.getCustomCard()
        },
        //点击30天的按钮
        selectThirty(){
            console.log('30天来了')
            this.selected = 3
            this.getData()
            this.getInsertNum()
            this.getCouponIn()
            this.getFreeIn()
            this.getCardIn()
            this.getProductIn()
            this.getDeductRecord()
            this.getCustomCard()
        },
        //获取优惠券消费数据
        async getCustomCard(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getIncome',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    goods_type:6
                }
            })
            this.customCard = res.result[0].totalNum
        },
        //获取统计数据
        async getData(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getIncome',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    goods_type:1
                }
            })
            this.incomeDate = res.result[0].totalNum
            console.log('获取到的统计结果为：',this.incomeDate)
        },
        //获取实体商品收入
        async getProductIn(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getFreeIn',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    type:3
                }
            })
            if(res.result.length>0){
                this.productIn = res.result[0].totalNum
            }else{
                this.productIn = 0
            }
        },
        //获取办卡收入
        async getCardIn(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getFreeIn',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    type:2
                }
            })
            if(res.result.length>0){
                this.CardIn = res.result[0].totalNum
            }else{
                this.CardIn = 0
            }
        },
        //获取散客收入
        async getFreeIn(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getFreeIn',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    type:1
                }
            })
            if(res.result.length>0){
                this.freeIn = res.result[0].totalNum
            }else{
                this.freeIn = 0
            }
            
        },
        //获取券类收入
        async getCouponIn(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getCouponIn',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime
                }
            })
            if(res.result.length>0){
                this.couponIn = res.result[0].totalNum
            }else{
                this.couponIn = 0
            }
            
            console.log('获取到的优惠券收入为：',this.couponIn)
        },
        
        //获取统计数据
        async getInsertNum(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate03(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate03(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate03(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate03(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            const res = await this.$cloudbase.callFunction({
                name:'getSmemNum',
                data:{
                    selected:selected,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                }
            })
            if(res.result.length > 0){
                
                this.insertNum = res.result[0].insertNum
            }else{
                this.insertNum = 0
            }
            console.log('获取到的新增会员数为：',this.insertNum)
        },

        //获取员工提成记录
        async getDeductRecord(){
            var selected = this.selected
            var myDate = new Date()
            var currentTime = this.getNowFormatDate()
            var today = this.getNowFormatDate02(myDate)+" 23:59:59"
            var sevenTime = "00"
            var thirtyTime = "00"
            if(selected == 1){//默认selected为1,遍历当天数据
                currentTime = this.getNowFormatDate02(myDate)+" 00:00:00"
            }else if(selected == 2){//当selected为2，遍历近一周的数据
                //获取七天前的时间戳，getTime获取当前时间戳，24即24小时，60即60分钟，60即60秒，1000即计数单位
                var seventime=myDate.getTime()-24*60*60*1000*6;
                sevenTime = this.getNowFormatDate02(new Date(seventime))+" 00:00:00"
                console.log('第七天的时间为',sevenTime)
            }else if(selected == 3){//当selected为3，遍历近一个月的数据
                var thirtytime=(new Date).getTime()-24*60*60*1000*29;
                thirtyTime = this.getNowFormatDate02(new Date(thirtytime))+" 00:00:00"
                console.log('第30天的时间为',thirtyTime)
            }
            //1.查询数组
            const res = await this.$cloudbase.callFunction({
                name: "get-deductRecord",
                data: {
                    selected:selected,
                    sstate:1,
                    create_time:currentTime,
                    today:today,
                    sevenTime:sevenTime,
                    thirtyTime:thirtyTime,
                    orderstr:'create_time',
                    ordertype:'desc'
                },
            })
            let deductList = res.result.data
            //获取之后进行数据处理
            let newRecord = [];
            deductList.forEach((item,i)=>{
                let index = i
                let isExists = newRecord.some((newItem,j)=>{
                    if(item.employee == newItem.employee){
                        index = j;
                        return true;
                    }
                })

                if(!isExists){
                    //计算当月的总工资
                    if(item.de_money == 0){
                        newRecord.push({
                            employee:item.employee,
                            total:item.de_money,
                            subList:[item],
                            num:0
                        })
                    }else{
                        newRecord.push({
                            employee:item.employee,
                            total:item.de_money,
                            subList:[item],
                            num:1
                        })
                    }
                }else{
                    if(item.de_money !== 0){
                        newRecord[index].subList.push(item)
                        newRecord[index].num = newRecord[index].num + 1
                        newRecord[index].total = parseFloat(newRecord[index].total) + parseFloat(item.de_money)
                    }
                    
                }
            })

            this.deductList = newRecord
            console.log('哈哈哈',this.deductList)

        }
    }
}
</script>
<style>
    .employee-work1{
        width: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
    .employee-work{
        height: 150px;
    }
    .text {
        font-size: 14px;
    }
    .item {
        margin-bottom: 18px;
    }
    .clearfix{
        font-size: 14px;
    }
    

    .box-card {
        width: 520px;
    }
    
    .el-scrollbar__wrap {
        overflow-x: hidden;
    }
    .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view{
        white-space: nowrap;
    }
    ul{
        display: inline-block;
    }
    .head{
        display: flex;
        position: relative;
        z-index: 10;
    }
    .head .btn{
        position: absolute;
        right: 0;
    }
    .el-row {
        margin-bottom: 20px;
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
</style>