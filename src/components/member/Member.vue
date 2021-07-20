<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>会员管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="name" 
                    @keyup.enter.native="getMemberList" clearable @clear="getMemberList">
                        <el-button slot="append" icon="el-icon-search"
                        @click="getMemberList" ></el-button>
                    </el-input>
                </el-col>
                <!-- <el-col :span="3">
                    <el-button type="primary"  @click="addDialogVisible = true">添加用户</el-button>
                </el-col> -->
            </el-row>
            <el-tabs style="margin-top:20px" type="border-card" v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="会员" name="first"></el-tab-pane>
                <el-tab-pane label="游客" name="second"></el-tab-pane>
                <!-- 用户列表区域 -->
                <el-table :data="memberlist" size="small" border stripe>
                    <el-table-column align="center" label="卡号" prop="card_no" width="100"></el-table-column>
                    <el-table-column align="center" label="姓名" prop="name" width="100"></el-table-column>
                    <el-table-column align="center" label="电话" prop="tel" width="150"></el-table-column>
                    <el-table-column align="center" label="余额" prop="balance" width="100"></el-table-column>
                    <el-table-column align="center" label="累计消费" prop="cumulant" width="100"></el-table-column>
                    <el-table-column align="center" label="会员积分" prop="consum_points" width="100"></el-table-column>
                    <el-table-column align="center" label="昵称" prop="nickName" width="200"></el-table-column>
                    <el-table-column align="center" label="创建时间" prop="create_time" width="180"></el-table-column>
                    <el-table-column align="center" label="状态" width="100">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.state"
                                @change="stateChange(scope.row)"
                                active-color="#13ce66"
                                inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="会员充值" width="100">
                        <template slot-scope="scope">
                            <el-tooltip  effect="dark" content="会员充值" placement="top" :enterable="false">
                                <!-- 设置按钮 -->
                                <el-button type="warning" icon="el-icon-eleme" size="mini"
                                :data='scope.id' @click="showRechargeDialog(scope.row._id,1)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="按次充卡" width="100">
                        <template slot-scope="scope">
                            <el-tooltip  effect="dark" content="充值按次商品" placement="top" :enterable="false">
                                <!-- 设置按钮 -->
                                <el-button type="warning" icon="el-icon-s-ticket" size="mini"
                                :data='scope.id' @click="showRechargeDialog(scope.row._id,2)"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="操作" width="200">
                        <template slot-scope="scope">
                            <!-- 修改按钮 -->
                            <el-button type="primary" icon="el-icon-edit" size="mini" 
                            :data="scope.id" @click="showEditDialog(scope.row._id)"></el-button>
                            <!-- 删除按钮 -->
                            <el-button type="danger" icon="el-icon-delete" 
                            size="mini" @click="removeMemberById(scope.row._id)"></el-button>
                            <!-- <el-tooltip  effect="dark" content="会员充值" placement="top" :enterable="false">
                                <el-button type="warning" icon="el-icon-setting" size="mini"
                                :data='scope.id' @click="showRechargeDialog(scope.row._id)"></el-button>
                            </el-tooltip> -->
                        </template>
                    </el-table-column>
                </el-table>
            </el-tabs>

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
        <!-- 充值会员页面的对话框 -->
        <el-dialog
        :title="memberTitle" :visible.sync="rechargeDialogVisible"
        width="50%" @close="rechargeDialogClosed" >
            <el-dialog
            width="30%"
            title="管理员密码"
            :visible.sync="innerVisible"
            append-to-body>
                <div style="margin-top:10px !important">
                <el-tag effect="dark" style="margin-right:15px !important;">
                    自定义密码
                </el-tag>
                <el-input style="width:222px !important;display:inline-block !important;"
                placeholder="请输入内容"
                v-model="customPassword">
                </el-input>
            </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="confirmNew">确 定</el-button>
                </span>
            </el-dialog>
            <el-table :data="memberInfo" size="small" style="margin-bottom:20px">
                <el-table-column align="center" label="卡号" prop="card_no" width="100"></el-table-column>
                <el-table-column align="center" label="姓名" prop="name" width="100"></el-table-column>
                <el-table-column align="center" label="电话" prop="tel" width="150"></el-table-column>
                <el-table-column align="center" label="余额" prop="balance" width="100"></el-table-column>
                <el-table-column align="center" label="累计消费" prop="cumulant" width="100"></el-table-column>
                <el-table-column align="center" label="会员积分" prop="consum_points" width="100"></el-table-column>
            </el-table>  
            <el-tag effect="dark" style="margin-right:15px" v-if="cardNo=='' && num ==1">
                选择类型
            </el-tag>
            <el-select style="margin-right:15px"  v-if="cardNo=='' && num ==1" v-model="value" clearable placeholder="请输入">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
             <!-- 选择优惠活动 -->
            
            <el-tag effect="dark" v-if="num == 2">
                按次项目
            </el-tag>
            <el-select style="margin-left:15px" v-if="num == 2" 
            v-model="timeGood" clearable placeholder="请选择">
                <el-option
                v-for="item in timeGoodslist"
                :key="item._id"
                :label="item.title"
                :value="item._id">
                </el-option>
            </el-select>
            <el-tag effect="dark" style="margin-left:20px" v-if="num == 2">
                过期日期
            </el-tag>
            <el-date-picker style="margin-left:15px" v-if="num == 2" 
                v-model="endTime"
                type="date"
                placeholder="选择日期">
            </el-date-picker>
            <div style="margin-top:10px">
                
                <el-button 
                v-if="this.e_name == undefined ||this.e_name == ''"
                size="mini"
                type="danger"
                @click="selectEmployee()">完成人员 </el-button>
                
                <el-button
                type="primary"
                v-else
                size="mini"
                @click="selectEmployee()">
                {{e_name}} </el-button>
                <el-select size="mini" 
                style="margin-left:15px;width:100px" v-if="openCompleted"
                v-model="e_name" clearable placeholder="请选择">
                    <el-option
                    v-for="item in employeeLists"
                    :key="item.name"
                    :label="item.name"
                    :value="item.name">
                    </el-option>
                </el-select>
                <span slot="footer" v-if="openCompleted"
                style="margin-left:10px">
                    <el-button type="primary" size="mini" 
                    @click="confirmEmployee()">确 定</el-button>
                </span>
                <!-- 选择支付方式 -->
                <el-tag effect="dark" style="margin-left:20px">
                    选择支付方式
                </el-tag>
                <el-select style="margin-left:10px" v-model="payType" clearable placeholder="请选择">
                    <el-option
                    v-for="item in payTypes"
                    :key="item.label"
                    :label="item.lable"
                    :value="item.lable">
                    </el-option>
                </el-select>
            </div>
            <!-- <el-tag effect="dark" v-if="num == 2 && timeGood !==0" style="margin-left:15px !important;">
                服务次数
            </el-tag>
            <el-input v-if="num == 2 && timeGood !==0"
            style="margin-left:15px;width:222px !important;display:inline-block !important;"
            placeholder="请输入服务次数"
            v-model="severTime">
            </el-input> -->
             <!-- 选择优惠活动 -->
            
            <el-tag effect="dark" v-if="value !== 2 && num ==1">
                优惠活动
            </el-tag>
            <el-select style="margin-left:15px" v-if="value !== 2 && num == 1" 
            v-model="activity" clearable placeholder="请选择">
                <el-option
                v-for="item in activityRuleList"
                :key="item.value"
                :label="item.activity"
                :value="item.value">
                </el-option>
            </el-select>
            <!-- 选择分店-->
            <!-- 选择员工 -->
            <div v-if="cardNo==''&& value !==1  && num ==1"  style="margin-top:10px !important">
                <el-tag effect="dark" style="margin-right:15px !important;">
                    自定义值
                </el-tag>
                <el-input style="width:222px !important;display:inline-block !important;"
                placeholder="请输入内容"
                v-model="newBalance">
                </el-input>
            </div>
            <div v-if="activity === '0'&&value !== 2" style="margin-top:10px !important">
                <el-tag effect="dark" style="margin-right:15px !important;">
                    自设本金
                </el-tag>
                <el-input style="width:222px !important;display:inline-block !important;"
                placeholder="请输入内容"
                v-model="customcash">
                </el-input>
                <el-tag effect="dark" style="margin-left:15px !important;">
                    自设储值
                </el-tag>
                <el-input style="margin-left:15px;width:222px !important;display:inline-block !important;"
                placeholder="请输入内容"
                v-model="customvalue">
                </el-input>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="rechargeDialogVisible = false">取 消</el-button>
                <el-button v-if="customcash !== 0"
                type="primary" @click="openInner">确 定</el-button>
                <el-button v-else-if="num == 2"
                type="primary" @click="confirmTimes">确定</el-button>
                <el-button v-else
                type="primary" @click="confirmRecharge">确定</el-button>
            </span>
        </el-dialog>

        <!-- 添加页面的对话框 -->
        <el-dialog
        title="添加会员" :visible.sync="addDialogVisible"
        width="50%" @close="addDialogClosed" >
            <el-form ref="addFormRef" :rules="addFormRules" 
            :model="addForm" label-width="80px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="addForm.tel" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addMember">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改页面的对话框 -->
        <el-dialog
        title="修改用户" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed">
            <el-form ref="editFormRef" :rules="editFormRules" 
            :model="editForm" label-width="80px">
                <el-form-item label="姓名">
                    <el-input v-model="editForm.name" ></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="tel">
                    <el-input v-model="editForm.tel"></el-input>
                </el-form-item>
                <el-form-item label="余额" prop="balance">
                    <el-input v-model="editForm.balance" ></el-input>
                </el-form-item>
                <el-form-item label="累计消费" prop="balance">
                    <el-input v-model="editForm.cumulant" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import cloudbase from "@cloudbase/js-sdk";
export default {
    data(){
        
        //失去焦点的时候检验电话号码的方法
        var checkTel = (rule,value,cb) =>{
            //验证手机号的正则表达式
            const regTel = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if(regTel.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的手机号'))

        }
        return{
            //获取用户列表的参数对象
            pagenum:1,
            pagesize:10,
            memberlist:[],
            memberInfo:[],
            cardNo:'',
            //优惠活动规则
            activityRuleList:[],
            activity:'',
            memberTitle:'会员充值',

            //办理人
            employeeList:[],
            transactor:[],

            //选择办卡类型
            options: [{
                value: 1,
                label: '办理新卡'
                }, {
                value: 2,
                label: '以旧换新'
                }],
            value: '',
            newBalance:0,

            //当前最新的会员
            //currentMember:{},
            name:'',
            total:0,

            //控制添加对话框的显示与隐藏
            addDialogVisible:false,
            addForm:{
                name:'',
                tel:''
            },
            addFormRules:{
                name:[
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ],
                tel:[
                    {required:true,message:'请输入电话号码',trigger:'blur'},
                    {validator:checkTel, trigger:'blur'}
                ]
            },
            //控制修改用户对话框的显示与隐藏
            editDialogVisible:false,
            //控制会员充值功能的显示与隐藏
            rechargeDialogVisible:false,
            //查询到的用户对象
            editForm:{},
            //修改表单的验证规则对象
            editFormRules:{
                tel:[
                    {required:true,message:'请输入电话号码',trigger:'blur'},
                    {validator:checkTel, trigger:'blur'}
                ]
            },
            currentSub:'',
            customcash:0,
            customvalue:0,
            innerVisible:false,
            customPassword:'',
            //选择商品类别
            activeName: 'first',
            type:1,
            //按次商品列表
            num:0,
            timeGoodslist:[],
            currentGood:{},
            timeGood:0,//按次商品的编号
            //severTime:0,//服务次数自定义
            endTime:'',//优惠卷过期日期选择

            //当前员工列表
            employeeLists:[],
            e_name:'',
            //选择完成人员
            openCompleted:false,
            openCompletedW:200,
            coupon:{},
            //结算界面参数
            payTypes:[
                {
                    value:2,
                    lable:'微信'
                },
                {
                    value:3,
                    lable:'支付宝'
                },
                {
                    value:4,
                    lable:'现金'
                },
                {
                    value:5,
                    lable:'信用卡'
                },
                {
                    value:6,
                    lable:'医疗保险'
                }
            ],
            payType:'',
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getMemberList()
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
            this.getMemberList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getMemberList()
        },
        //切换商品类别
        handleClick(tab) {
            let name = tab.name
            if(name == 'first'){
                this.type = 1
            }else if(name == 'second'){
                this.type = 2
            }
            //设置好参数后，调用获取商品列表的接口
            this.getMemberList()
        },
        //删除操作
        async removeMemberById(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name=='tcmbro1'){
                console.log(id)
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
                const result = await db.collection("member")
                .doc(id)
                .remove()
                if(result.deleted !== 1){
                    return this.$message.error('删除用户失败！')
                }

                this.$message.success('删除用户成功！')
                
                this.getMemberList()
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }

        },
        //监听修改对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        //监听添加对话框的关闭事件
        addDialogClosed(){
            this.$refs.addFormRef.resetFields()
        },
        //校验并提交添加内容
        addMember(){
            this.$refs.addFormRef.validate(
                async valid=>{
                    if(!valid) return

                    //获取数据库引用
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    })
                    const currentTime = this.getNowFormatDate()
                    const db = app.database()
                    const result = await db.collection("member")
                    .add({
                        name:this.addForm.name,
                        tel:this.addForm.tel,
                        coe_deduct:0,
                        balance:0,
                        cash:0,
                        consum_points:0,
                        member_level:1,
                        card_no:0,//从云函数获取最新的编号
                        face_no:0,
                        cumulant:0,
                        auth:true,//用户注册，默认通过鉴权
                        position:1,
                        state:true,
                        create_time:currentTime,
                        update_time:currentTime
                    })

                    if(result.code !== undefined){
                        return this.$message.error('添加会员失败！')
                    }
                    
                    //关闭对话框
                    this.addDialogVisible = false
                    //刷新数据列表
                    this.getMemberList()
                    this.$message.success('添加会员成功！')
                }
            )
        },
        //监听会员充值对话框关闭事件
        rechargeDialogClosed(){

        },
        //展示Employee对话框
        async selectEmployee(){
            this.openCompleted = true
            this.openCompletedW = 500
            //调用查询员工接口并赋值给员工列表
            const res = await this.$cloudbase.callFunction({
                name: "get-member",
                data: {
                    position:3,
                    sub_id:this.currentSub
                },
            })
            this.employeeLists = res.result.data
            console.log(this.employeeLists)
        },
        //确认选择员工index
        confirmEmployee(){
            
            //关闭选择框
            this.openCompleted = false
            
            //如果所有都为false再关闭
            let openCompleted = this.openCompleted
            if(!openCompleted){
                this.openCompletedW = 200
            }
            
            
        },
        async addTimesDeduct(){
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            var date = new Date()
            //获取年月
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            //为该员工进行新卡提成记录的添加
            //获取当前已选择的员工value
            let employeeName = this.e_name
            //start count employee deduct
            //获取当前会员信息
            let member = this.memberInfo[0]
            let memberOpenId = ''
            let memberName = '散客'
            let memberTel = '——'
            let cardNo = '——'
            if(member.tel !== undefined){
                if(member._openid){
                    memberOpenId = member._openid
                }
                
                memberName = member.name
                memberTel = member.tel
                cardNo = member.card_no
            }
            let coupon = this.coupon
            //获取当前的时间
            const currentTime = this.getNowFormatDate()
            const updateTime = this.getNowFormatDate()
            let payType = this.payType
            //自定义提成
            let deCoe = 0.1
            let deNewMoney = 0
            let deNewType = '新卡'
            
            if(this.num == 2){
                let price = parseInt(coupon.totalPrice)
                deCoe = 0.05
                //计算优惠券提成
                deNewMoney = (price * deCoe).toFixed(2)
                deNewType = '按次服务'
            }
            
            const result =await app.callFunction({
                name:'add-deductRecord',
                data:{
                    employee:employeeName,
                    price:coupon.totalPrice,
                    deMoney:deNewMoney,
                    goodsType:0,
                    goodsNo:0,
                    goodsName:'',
                    deType:deNewType,//1会员，散客，办卡
                    payType:payType,
                    deRate:deCoe,//办卡提成率
                    orderNo:'',
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    card_no:cardNo,
                    sub_id:this.currentSub,
                    state:1,
                    createTime:currentTime,
                    updateTime:updateTime,
                    year:year,
                    month:month,
                    date:day
                }

            })
            if(result.result.id == undefined){
                return this.$message.error('生成员工XIN服务券提成记录失败')
            }
            this.$message.success('生成员工XIN服务券提成记录成功')

                
        },
        openInner(){
            let value = this.activity
            let customcash = parseInt(this.customcash)
            let customvalue = parseInt(this.customvalue)
            if(value == '0'){
                //如果有其中一个为0怎么不通过
                if(customcash == 0 || customvalue == 0){
                    return this.$message.error('自定义值不能为0')
                }
                //如果其中一个比例大于1.5，则无法通过
                console.log('当前的比例',customvalue/customcash)
                if(customvalue/customcash > 1.5){
                    return this.$message.error('赠送金额过大请调整金额再提交！')
                }
                if(customvalue/customcash < 1){
                    return this.$message.error('您的赠送金额小于本金不能提交！')
                }
            }
            //1.打开对话框
            this.innerVisible = true
            //2.判断余额是否充足，提醒对方
        },
        confirmNew(){
            let password = this.customPassword
            console.log('当前自定义密码',password,password == '111aaa')
            if(password == '000111'){
                this.innerVisible = false
                //调用会员充值方法
                this.confirmRecharge()
            }else{
                return this.$message.error('密码错误请重新输入')
            }
        },
        //提交按次商品充值
        async confirmTimes(){

            let timeGoodNo = this.timeGood

            if(timeGoodNo == 0){
                return this.$message.error('请选择按次服务商品再提交！')
            }
            if(this.endTime == ''){
                return this.$message.error('请选择过期时间再提交！')
            }
            if(this.payType == ''){
                return this.$message.error('请选择支付方式再提交！')
            }
            if(this.e_name == ''){
                return this.$message.error('请选择提成人员再提交！')
            }
            let memberInfo = this.memberInfo[0]
            if(memberInfo.tel == undefined){
                return this.$message.error('请选择会员，才能提交哦！')
            }
            let timeGoodslist = this.timeGoodslist
            //从我的优惠卷中遍历是否已存在该商品，如果存在，则直接返回
            let currentGoodsName = ''
            for(let i =0;i<timeGoodslist.length;i++){
                if(timeGoodNo == timeGoodslist[i]._id){
                    currentGoodsName = timeGoodslist[i].goods_name
                }
            }
            console.log('当前选中的商品名称为',currentGoodsName)
            let memberCoupons = memberInfo.coupon_id
            for(let i = 0;i<memberCoupons.length;i++){
                if(memberCoupons[i].goods_name == currentGoodsName){
                    return this.$message.error('你充值的按次服务卷，此人已经购买过，请等消费完再进行购买！')
                }
            }
            //获取数据库引用
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            })
            
            const db = app.database()
            //查询次编号对应的优惠券
            const resCoupon = await db.collection("coupon")
            .where({
                _id:timeGoodNo
            }).get()
            let coupon = resCoupon.data[0]
            this.coupon = coupon
            console.log('获取到此优惠券的详情为',coupon)
            
            const currentTime = this.getNowFormatDate()
            let newEndTime = this.getNowFormatDate02(this.endTime)
            console.log('修改后的这个过期时间为',newEndTime)
            const endTime = newEndTime
            const result = await db.collection("my_coupon")
            .add({
                title:coupon.title,
                _openid:memberInfo._openid,
                type:coupon.type,
                goods_no:coupon.goods_no,
                goods_name:coupon.goods_name,
                goods_price:coupon.goods_price,
                totalTime:coupon.totalTime,
                totalPrice:coupon.totalPrice,
                usedTime:0,//已使用的次数
                target_money:coupon.target_money,
                sub:coupon.sub,
                indate:0,
                end_time:endTime,
                state:true,
                status:1,//优惠券使用状态
                create_time:currentTime,
                update_time:currentTime
            })

            if(result.code !== undefined){
                return this.$message.error('添加到我的优惠券失败！')
            }
            
            this.$message.success('添加到我的优惠券成功！') 
            //将优惠卷添加到该会员的优惠卷里
            console.log('开始修改',memberInfo._id,coupon.goods_no,coupon.goods_name)
            const resC = await this.$cloudbase.callFunction({
                name:"updateMcoupon",
                data:{
                    _id:memberInfo._id,
                    goods_no:coupon.goods_no,
                    goods_name:coupon.goods_name
                }
            })
            console.log('111111',resC)
            if(resC.result.stats.updated !== 1){
                return this.$message.error('修改会员优惠卷添加失败！')
            }
            this.$message.success('修改会员优惠卷添加成功！')
            let currentNo = 90000
            if(memberInfo.card_no == 0 && memberInfo.balance == 0){
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "get-member",
                    data: {
                        name:this.name,
                        cardNo:'9',
                        position:1,
                        orderstr:'create_time',
                        ordertype:'desc'
                    },
                })
                let currentMember = res.result.data[0]
                console.log('会员的列表为',currentMember)
                //获取最新的卡号
                if(res.result.data.length !== 0){
                    currentNo = parseInt(currentMember.card_no)+1
                }
                const createTime = this.getNowFormatDate01()
                //2.办新卡调用修改云函数
                const resU = await this.$cloudbase.callFunction({
                    name:"update-member",
                    data:{
                        _id:memberInfo._id,
                        cardNo:currentNo+'',
                        sub_id:this.currentSub,
                        createTime:createTime
                    },  
                })
                console.log('22222222',resU)
                if(resU.result.updated !== 1){
                    return this.$message.error('会员充值失败！')
                }
                this.$message.success('会员充值成功！')
            }
            
            //计算XIN优惠券提成
            this.addTimesDeduct()

            //完成之后清空value值,否则下一个商品也是这个员工了
            this.e_name = ''
            
            //关闭对话框
            this.rechargeDialogVisible = false
            this.type = 1
            //刷新数据列表
            this.getMemberList()

        },
        //提交会员充值
        async confirmRecharge(){
            //根据金额查找对应的充值金额在规则表中
            //根据ID查询用户信息接口
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            let value = this.activity
            let cash = 0
            let info = {}
            console.log('------------',value)
            
            if(value !== '' && value !== '0'){
                const db = app.database();
                const result = await db.collection("activity_rules")
                .where({
                    value:this.activity,
                    state:true
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询活动信息失败！')
                }
                info = result.data[0]
        
                cash = info.cash
                console.log('当前的充值现金为',cash)
                
            }

            let customcash = parseInt(this.customcash)
            let customvalue = parseInt(this.customvalue)
            
            //关闭对话框(将此条语句提前，防止点击两次，重复充值)
            this.rechargeDialogVisible=false

            //对自定义本金赋值
            let member_coe = 0
            if(customcash !== 0){
                cash = customcash
                //计算员工提成系数
                let coeM = customvalue/customcash
                if(coeM<1.3){
                    member_coe = 0.1
                }else if(coeM>=1.3 && coeM <=1.4){
                    member_coe = 0.07
                }else{
                    member_coe = 0.03
                }
            }
            //如果为促销活动
            if(info.type == 2){
                //计算员工提成系数
                let proValue = parseInt(info.value)
                let proCash = parseInt(info.cash)
                let coeM = proValue/proCash
                if(coeM<1.3){
                    member_coe = 0.1
                }else if(coeM>=1.3 && coeM <=1.4){
                    member_coe = 0.07
                }else{
                    member_coe = 0.03
                }
            }

            //计算节约
            let save1 = 0;
            
            //进行自定义值得处理
            var customBalance = 0 
            let newBalance = this.newBalance
            console.log('当前的余额与添加值为------',newBalance,newBalance == 0,cash,customvalue)
            if(newBalance == 0){
                
                if(this.activity == '0'||customvalue !==0){//如果为自定义时
                    customBalance = customvalue
                    save1 = customvalue - cash
                }else{
                    customBalance = parseInt(this.activity)
                    save1 = customBalance - cash
                }
            }else{
                customBalance = parseInt(newBalance)
                save1 = 0
            }

            // 1.如果该会员没有卡号或者卡号为0并且消费记录也为0为此用户创建新卡
            //     a.查询当前最大卡号，并为此用户创建新卡号
            //     b.为该用户修改余额并且修改办理人
            // 2.如果有卡则给直接修改金额修改办理人,并为
            //     a.根据前面的消费记录，计算提成比例，拿出10%为前面的人分红
            //     b.为分红人添加提成记录，次提成类型为办卡
            let memberInfo = this.memberInfo[0]
            let currentNo = 90000
            console.log('获取到的用户信息为',memberInfo)
            if(memberInfo.balance == 0 && memberInfo.cumulant == 0){
                let createTime = this.getNowFormatDate01()
                if(memberInfo.card_no == 0 ){
                    //1.查询数组
                    const res = await this.$cloudbase.callFunction({
                        name: "get-member",
                        data: {
                            name:this.name,
                            cardNo:'9',
                            position:1,
                            orderstr:'create_time',
                            ordertype:'desc'
                        },
                    })
                    let currentMember = res.result.data[0]
                    console.log('会员的列表为',currentMember)
                    //获取最新的卡号
                    if(res.result.data.length !== 0){
                        currentNo = parseInt(currentMember.card_no)+1
                    }
                }else{
                    currentNo = memberInfo.card_no
                    createTime = memberInfo.create_time
                }
                
                let timestamp = Date.parse(new Date())
                //2.办新卡调用修改云函数
                const resU = await this.$cloudbase.callFunction({
                    name:"update-member",
                    data:{
                        _id:memberInfo._id,
                        cardNo:currentNo+'',
                        balance:customBalance,
                        transactor:this.transactor,
                        cash:cash,
                        type:this.value,
                        member_coe:member_coe,
                        saveValue:save1,
                        sub_id:this.currentSub,
                        createTime:createTime,
                        timestamp:timestamp
                    },  
                })
                if(resU.result.updated !== 1){
                    return this.$message.error('会员充值失败！')
                }
                this.$message.success('会员充值成功！')
                //生成会员充值记录
                let label = ''
                if(this.value == 1){
                    label = this.options[0].label
                }else{
                    label = this.options[1].label
                }
                await this.addRechargeRecord(label,customBalance)
            }else{
                //3.计算提成比例，根据会员卡修改时间取出自从上次到现在的所有消费记录，
                //  并计算出每个员工的费用与累计消费的费用比例，为该员工本次提成的比例
                //1.查询数组
                console.log('续卡开始计算员工比例，参数------',memberInfo.tel)
                console.log('该会员最近一次的修改时间为',memberInfo.name,memberInfo.timestamp)
                //*这里获取所有的消费记录，所以不加分店字段
                const res = await this.$cloudbase.callFunction({
                    name: "get-consumRecord",
                    data: {
                        tel:memberInfo.tel,
                        state:1,
                        uTime:memberInfo.timestamp
                    },
                })
                let consumList = res.result.data
                console.log('获取到的消费记录---',consumList)
                if(consumList.length !== 0){
                    console.log('获取到的所有消费记录为',consumList)
                    //创建一个集合存放已经计算过提成的人
                    let cardDeduct = []
                    let totalPrice = 0
                    for(var z in consumList){
                        totalPrice = totalPrice + parseInt(consumList[z].price)
                    }
                    console.log('获取到的消费总和为',totalPrice)
                    for(var i in consumList){
                        let consumItem = consumList[i]
                        if(cardDeduct.indexOf(consumItem.employee) == -1){
                            let itemPrice = 0
                            console.log('当前的提成人员为：',consumItem.employee)
                            for(var j in consumList){
                                if(consumList[j].employee == consumItem.employee){
                                    itemPrice = itemPrice + parseInt(consumList[j].price)
                                }
                            }
                            //计算该员工的提成比例
                            console.log('该员工的提成比例为',itemPrice/totalPrice)
                            //将该员工添加为已提成员工
                            cardDeduct.push(consumItem.employee)
                            //为该员工进行续卡提成记录的添加
                            //获取当前的时间
                            const currentTime = this.getNowFormatDate()
                            const updateTime = this.getNowFormatDate()
                            //获取年月
                            var date = new Date()
                            var year = date.getFullYear()
                            var month = date.getMonth() + 1
                            var day = date.getDate()
                            //自定义提成
                            // let deCoe = 0.1
                            // if(memberInfo.member_coe !== undefined && memberInfo.member_coe !==0){
                            //     deCoe = memberInfo.member_coe
                            // }
                            console.log('此时的续卡提成比例为------------为',member_coe)
                            let deNewRate = 0
                            if(member_coe !== 0){
                                deNewRate = itemPrice/totalPrice * member_coe
                            }else{
                                deNewRate = itemPrice/totalPrice * 0.1
                            }
                            
                            //计算提成
                            let deNewMoney = (cash * deNewRate).toFixed(2)

                            let deNewType = '续卡'
                            console.log('续卡金额与参数',deNewRate,deNewMoney)
                            const result =await app.callFunction({
                                name:'add-deductRecord',
                                data:{
                                    employee:consumItem.employee,
                                    price:cash,
                                    deMoney:deNewMoney,
                                    goodsType:0,
                                    goodsNo:0,
                                    goodsName:'',
                                    deType:deNewType,//1会员，散客，办卡
                                    deRate:deNewRate,//办卡提成率
                                    orderNo:memberInfo.card_no,
                                    memberOpenId:memberInfo._openid,
                                    memberName:memberInfo.name,
                                    memberTel:memberInfo.tel,
                                    card_no:memberInfo.card_no,
                                    sub_id:this.currentSub,
                                    state:1,
                                    createTime:currentTime,
                                    updateTime:updateTime,
                                    year:year,
                                    month:month,
                                    date:day
                                }

                            })
                            if(result.result.id == undefined){
                                return this.$message.error('生成续卡提成记录失败')
                            }
                            this.$message.success('生成续卡提成记录成功')
                        }
                    }
                }
                //续卡修改修改用户用户余额，当前现金，以及办理人
                const updateTime = this.getNowFormatDate()
                let balance = customBalance + parseInt(memberInfo.balance)
                let saveOld=memberInfo.saveValue
                let newSave = customBalance - cash
                let save = saveOld + newSave
                let timestamp = Date.parse(new Date())
                //2.调用修改云函数
                const resU = await this.$cloudbase.callFunction({
                    name:"update-member",
                    data:{
                        _id:memberInfo._id,
                        balance:balance,
                        cash:cash,
                        saveValue:save,
                        member_coe:member_coe,
                        sub_id:this.currentSub,
                        updateTime:updateTime,
                        timestamp:timestamp
                    },  
                })
                if(resU.result.updated !== 1){
                    return this.$message.error('充值失败！')
                }
                this.$message.success('充值成功！')
                //生成会员充值记录
                await this.addRechargeRecord('续卡',customBalance)
            }
            
            
            //刷新数据列表
            this.getMemberList()
        },
        //生成充值记录
        async addRechargeRecord(name,customBalance){
            //添加商品列表，如果有会员添加其姓名ID最后添加remark以及支付方式
            //状态以及时间是必须的，采用云函数端调用的方法
            //最后再添加单据编号
            //添加消费记录接口
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            //获取当前会员信息
            let member = this.memberInfo[0]
            let memberOpenId = ''
            let memberName = ''
            let memberTel = ''
            let card_no = ''
            let memberBalance = 0
            if(member.tel !== undefined){
                if(member._openid){
                    memberOpenId = member._openid
                }
                memberName = member.name
                memberTel = member.tel
                card_no = member.card_no
                memberBalance = member.balance+customBalance
            }
            //获取当前的支付方式以及备注
            //获取当前的时间
            const currentTime = this.getNowFormatDate()
            const updateTime = this.getNowFormatDate()
            //获取年月
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            const result =await app.callFunction({
                name:'add-goodsRecord',
                data:{
                    goodsname:name,
                    orderNo:'',
                    type:3,
                    price:customBalance,
                    memberBalance:memberBalance,
                    employee:'',
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    card_no:card_no,
                    state:2,//2为充值
                    payType:'',
                    remark:'',
                    sub_id:this.currentSub,
                    createTime:currentTime,
                    updateTime:updateTime,
                    year:year,
                    month:month
                }

            })
            if(result.result.id == undefined){
                return this.$message.error('生成会员卡充值记录失败')
            }
            this.$message.success('生成会员卡充值记录成功')
        },
        //校验提交修改内容
        confirmEdit(){
            this.$refs.editFormRef.validate(
                async valid=>{
                    if(!valid) return
                    //调用修改用户信息接口
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    });
                    const db = app.database();
                    const result = await db.collection("member")
                    .doc(this.editForm._id)
                    .update({
                        name:this.editForm.name,
                        tel:this.editForm.tel,
                        balance:this.editForm.balance,
                        cumulant:this.editForm.cumulant
                    })
                    if(result.updated !== 1){
                        return this.$message.error('更新用户失败！')
                    }
                    
                    //关闭对话框
                    this.editDialogVisible = false
                    //刷新数据列表
                    this.getMemberList()
                    this.$message.success('更新用户成功！')
                }
            )
        },

        //展示会员充值对话框
        async showRechargeDialog(id,num){
            this.num = num
            if(num == 1){
                this.memberTitle = '会员充值'
            }else{
                this.memberTitle = '按次充卡'
            }
            //打开对话框
            this.rechargeDialogVisible=true
            //根据ID查询用户信息接口
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            const db = app.database();
            const result = await db.collection("member")
            .where({
                _id:id
            })
            .get()
            if(result.length == 0){
                return this.$message.error('查询用户信息失败！')
            }

            this.memberInfo = result.data
            this.cardNo = result.data[0].card_no

            if(num == 1){
                //查询活动活动规则
                const resultR = await db.collection('activity_rules').where({
                    state:true
                })
                .get()

                console.log('当前规则',resultR)
                resultR.data.push({value:'0',activity:'自定义'})
                this.activityRuleList = resultR.data
            }else{
                //查询按次服务券
                const resCoupon = await db.collection("coupon").get()
                this.timeGoodslist = resCoupon.data
                console.log('当前的按次商品列表为',this.timeGoodslist)
            }
            

            //调用查询员工接口并赋值给员工列表
            const res = await this.$cloudbase.callFunction({
                name: "get-member",
                data: {
                    position:3
                },
            })
            this.employeeList = res.result.data
            console.log(this.employeeList)
        },
        
        
        //展示Edit对话框
        async showEditDialog(id){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name=='tcmbro1'){
                //根据ID查询用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("member")
                .where({
                    _id:id
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询用户信息失败！')
                }
                this.editDialogVisible=true
                this.editForm = result.data[0]
            }else{
                return this.$message.error('你没有权限进行此项操作！')
            }

        },
        async stateChange(memberInfo){
            const name = window.sessionStorage.getItem('token')
            if(name == 'tcmbros' || name=='tcmbro1'){

                //修改状态接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                const db = app.database();
                const result = await db.collection("member")
                .doc(memberInfo._id)
                .update({
                    state:memberInfo.state
                })
                console.log('修改后的结果为',result)
                if(result.updated !== 1){
                    memberInfo.state = !memberInfo.state
                    return this.$message.error('更新用户状态失败！')
                }
                this.$message.success('更新用户状态成功！')
            }else{
                memberInfo.state = !memberInfo.state
                return this.$message.error('你没有权限进行此项操作！')
            }
        },
        //获取会员列表
        async getMemberList(){
            try {
                if(this.name == ''){
                    //1.查询数组
                    const res = await this.$cloudbase.callFunction({
                        name: "get-member",
                        data: {
                            page: this.pagenum,
                            pagesize: this.pagesize,
                            name:this.name,
                            position:1,
                            type:this.type,
                            orderstr:'create_time',
                            ordertype:'desc'
                        },
                    })
                    this.memberlist = res.result.data
                    //2、查询数组
                    const resT = await this.$cloudbase.callFunction({
                        name: "get-member",
                        data: {
                            type:this.type,
                            name:this.name,
                            position:1
                        },
                    })
                    this.total = resT.result.data.length
                }else{
                    let numReg = /^[0-9]*$/
                    let numRe = new RegExp(numReg)
                    if(!numRe.test(this.name)){
                        //1.查询数组
                        const res = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                type:this.type,
                                name:this.name,
                                position:1,
                                orderstr:'create_time',
                                ordertype:'desc'
                            },
                        })
                        this.memberlist = res.result.data
                        this.total = res.result.data.length
                    }else{
                        console.log('数字')
                        //let search = this.name
                        let arr = []
                        //1.查询数组
                        const res = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                type:this.type,
                                tel:this.name,
                                position:1,
                                orderstr:'create_time',
                                ordertype:'desc'
                            },
                        })
                        let result1 = res.result.data
                        arr = arr.concat(res.result.data)
                        //1.查询数组
                        const resNum = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                type:this.type,
                                cardNo:this.name,
                                position:1,
                                orderstr:'create_time',
                                ordertype:'desc'
                            },
                        })
                        let result2 = resNum.result.data
                        console.log(resNum.result.data)
                        //利用for循环进行筛选
                        if(result1.length>0 && result2.length>0){
                            for(var i in result1){
                                for(var j in result2){
                                    if(result1[i]._id !== result2[j]._id){
                                        arr =  arr.concat(resNum.result.data)
                                    }
                                }
                            }
                        }else{
                            arr =  arr.concat(resNum.result.data)
                        }
                        this.memberlist = arr
                    }
                    this.total = this.memberlist.length
                    //打开搜索框
                    this.searchDialogVisible = true
                }
                
            } catch (e) {
                this.memberlist = e+'我是错误的';
            }
        }
    }
}
</script>

<style lang="less" scoped>

</style>
