<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>消费管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品消费</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 会员信息卡片视图 -->
        <el-card>
            <!-- 搜索区域 -->
            <el-row :gutter="20">
                <el-col :span="5">
                <el-button type="success" plain @click="switchMember">会员消费</el-button>
                <el-button type="danger" style="margin-left:30px" plain @click="switchTraveler">散客消费</el-button>
                </el-col>
                <el-col :span="7" v-if="selected == 1">
                    <el-input placeholder="请输入会员信息" @keyup.enter.native="getMemberList" v-model="memberSearch" clearable @clear="clearMember">
                        <el-button slot="append" icon="el-icon-search" @click="getMemberList"></el-button>
                    </el-input>
                </el-col>
            </el-row>
            <el-row style="margin-top:20px" v-if="selected == 2">
                <span style="color:red;margin-right:20px">当前选择为:</span>
                <el-tag
                    type='danger'
                    effect="dark">
                    散客消费
                </el-tag>
                
            </el-row>
            <!-- 会员信息 -->
            <el-row v-if="currentMember.tel != undefined" style="margin-top:15px" v-model="currentMember">
                <el-col :span="4">
                    <el-tag
                        type='success'
                        effect="dark">
                        会员卡号：
                    </el-tag>
                    <el-tag
                        type='success'
                        effect="plain">
                        {{ currentMember.card_no }}
                    </el-tag>
                </el-col>
                <el-col :span="4">
                    <el-tag
                        type="info"
                        effect="dark">
                        会员姓名：
                    </el-tag>
                    <el-tag
                        type='info'
                        effect="plain">
                        {{ currentMember.name }}
                    </el-tag>
                </el-col>
                <el-col :span="5">
                    <el-tag
                        type='danger'
                        effect="dark">
                        会员电话：
                    </el-tag>
                    <el-tag
                        type='danger'
                        effect="plain">
                        {{ currentMember.tel }}
                    </el-tag>
                </el-col>
                <el-col :span="4">
                    <el-tag
                        effect="dark">
                        会员余额：
                    </el-tag>
                    <el-tag
                        effect="plain">
                        {{ currentMember.balance }}
                    </el-tag>
                </el-col>
                <el-col :span="4">
                    <el-tag
                        type='warning'
                        effect="dark">
                        会员积分：
                    </el-tag>
                    <el-tag
                        type='warning'
                        effect="plain">
                        {{ currentMember.consum_points }}
                    </el-tag>
                </el-col>
            </el-row>
        </el-card>


        <!-- 下面的商品列表区域 -->
        <el-row :gutter="20">
            <el-col :span="7">
                <!-- 卡片视图 -->
                <el-tabs  v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="服务商品" name="first"></el-tab-pane>
                    <el-tab-pane label="美团团单" name="second"></el-tab-pane>
                    <el-tab-pane label="实体商品" name="third"></el-tab-pane>
                    <el-tab-pane label="按次商品" name="fourth"></el-tab-pane>
                </el-tabs>
                <el-card class="card-box">
                    <!-- 搜索区域 -->
                    <el-row :gutter="20">
                        <el-col :span="18">
                            <el-input placeholder="请输入内容" @keyup.enter.native="getGoodsList" v-model="goodsname" clearable @clear="getGoodsList">
                                <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                    <!-- 商品列表区域 -->
                    <el-table :data="goodslist" style="font-size:9pt" size="small" @row-click="addShopping" border stripe>
                        <el-table-column align="center" label="编号" prop="goods_no" width="100"></el-table-column>
                        <el-table-column align="center" label="名称" prop="goodsname" width="120"></el-table-column>
                        <el-table-column align="center" label="单位" prop="unit" width="100"></el-table-column>
                        <el-table-column align="center" label="价格" prop="price" width="100"></el-table-column>
                    
                    </el-table>

                    <!-- 分页区域 -->
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pagenum"
                        :page-sizes="[10, 20, 100, 500]"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </el-card>
            </el-col>
            <el-col :span="17">
                <el-card class="card-box">
                     <!-- 购物车列表区域 :summary-method="getSummaries" show-summary sum-text-->
                    <el-table :data="shoppingList" height="300" show-summary
                    :summary-method="getSummaries" style="width:100%"
                    border stripe size="small">
                        <el-table-column align="center" type="index"></el-table-column>
                        <el-table-column align="center" label="编号" prop="goods_no" width="100"></el-table-column>
                        <el-table-column align="center" label="名称" prop="goodsname" width="150"></el-table-column>
                        <el-table-column align="center" label="单位" prop="unit" width="80"></el-table-column>
                        <el-table-column align="center" label="价格" prop="price" width="100"></el-table-column>
                        <el-table-column align="center" label="操作" :width="openCompletedW">
                            <template slot-scope="scope">
                                <el-button
                                size="mini"
                                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button
                                v-if="scope.row.employee == undefined ||scope.row.employee == ''"
                                size="mini"
                                type="danger"
                                @click="selectEmployee(scope.$index, scope.row)">完成人员 </el-button>
                                
                                <el-button
                                type="primary"
                                v-else
                                size="mini"
                                @click="selectEmployee(scope.$index, scope.row)">
                                {{scope.row.employee}} </el-button>
                                <el-select size="mini" 
                                style="margin-left:15px;width:100px" v-if="openCompleted[scope.$index]"
                                v-model="e_name" clearable placeholder="请选择">
                                    <el-option
                                    v-for="item in employeeList"
                                    :key="item.name"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                                <span slot="footer" v-if="openCompleted[scope.$index]"
                                style="margin-left:10px">
                                    <el-button type="primary" size="mini" 
                                    @click="confirmEmployee(scope.$index)">确 定</el-button>
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作"
                            width="120">
                            <template slot-scope="scope">
                                <el-button
                                @click.native.prevent="deleteRow(scope.$index, shoppingList)"
                                type="text"
                                size="small">
                                移除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    
                </el-card>
            </el-col>
            
        </el-row>
        <el-button :disabled="accountDisabled" 
        @click="accountOrder"
        class="account" type="danger">结算订单</el-button>

        <!-- 确认订单对话框 -->
        <el-dialog
        title="确认订单" :visible.sync="accountDialogVisible"
        width="50%" @close="accountDialogClosed" >
            <!-- 内层Dialog -->
            <el-dialog
            width="30%"
            title="确认类型"
            :visible.sync="innerVisible"
            append-to-body>
                <div v-if="currentMember.tel == undefined && activeName !== 'fourth'">
                    <span style="color:red">注意:</span>当前为散客消费,确认请提交！
                </div>
                <div v-else-if="currentMember.balance >= countPrice && activeName !== 'fourth'">
                    当前会员姓名为<span style="color:red"> ${{currentMember.name}}$ </span>,请确认信息后提交！
                </div>
                <div v-else-if="currentMember.balance < countPrice && activeName !== 'fourth'">
                    当前会员姓名为<span style="color:red"> ${{currentMember.name}}$ </span>,请补齐余额后提交！
                    
                </div>
                <div v-if="currentMember.balance < countPrice && activeName !== 'fourth'"  style="margin-top:10px !important">
                    <el-tag effect="dark" style="margin-right:15px !important;">
                        自定义充值额
                    </el-tag>
                    <el-input style="width:220px !important;display:inline-block !important;"
                    v-model="addBalance">
                    </el-input>
                    <!-- 选择支付方式 -->
                    <div style="margin-top:20px">
                        <el-tag effect="dark" >
                            选择支付方式
                        </el-tag>
                        <el-select
                        v-model="customPay" clearable placeholder="请选择">
                            <el-option
                            v-for="item in customTypes"
                            :key="item.label"
                            :label="item.lable"
                            :value="item.lable">
                            </el-option>
                        </el-select>
                    </div>
                </div>

                <div v-if="activeName == 'fourth'">
                    当前会员姓名为<span style="color:red"> ${{currentMember.name}}$ </span>,请确认消费商品编号为{{selectCoupon}}优惠卷信息后提交！
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary"  @click="confirmPay">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 会员信息 -->
            <el-row v-if="currentMember.tel != undefined" style="margin-top:15px" v-model="currentMember">
                
                <el-col :span="3">
                    <el-tag
                        type='success'
                        effect="dark">
                        卡号
                    </el-tag>
                    <el-tag
                        type='success'
                        style="margin-top:10px"
                        effect="plain">
                        {{ currentMember.card_no }}
                    </el-tag>
                </el-col>
                <el-col :span="3">
                    <el-tag
                        type='info'
                        effect="dark">
                        姓名
                    </el-tag>
                    <el-tag
                        type='info'
                        style="margin-top:10px"
                        effect="plain">
                        {{ currentMember.name }}
                    </el-tag>
                </el-col>
                <el-col :span="4">
                    <el-tag
                        type='danger'
                        effect="dark">
                        电话
                    </el-tag>
                    <el-tag
                        type='danger'
                        style="margin-top:10px"
                        effect="plain">
                        {{ currentMember.tel }}
                    </el-tag>
                </el-col>
                <el-col :span="2">
                    <el-tag
                        type='danger'
                        effect="dark">
                        余额
                    </el-tag>
                    <el-tag
                    style="margin-top:10px"
                        effect="plain">
                        {{ currentMember.balance }}
                    </el-tag>
                </el-col>
                <el-col :span="3">
                    <el-tag
                        type='danger'
                        effect="dark">
                        积分
                    </el-tag>
                    <el-tag
                        type='warning'
                        style="margin-top:10px"
                        effect="plain">
                        {{ currentMember.consum_points }}
                    </el-tag>
                </el-col>
            </el-row>
            <el-table :data="shoppingList" size="small" style="margin-bottom:10px" height="180">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column align="center" label="编号" prop="goods_no" width="100"></el-table-column>
                <el-table-column align="center" label="名称" prop="goodsname" width="120"></el-table-column>
                <el-table-column align="center" label="单位" prop="unit" width="100"></el-table-column>
                <el-table-column align="center" label="价格" prop="price" width="100"></el-table-column>
                <el-table-column align="center" label="完成人员" prop="employee" width="100">
                </el-table-column>
            </el-table>
            <!-- 选择支付方式 -->
            <el-tag v-if="activeName != 'fourth'" effect="dark">
                选择支付方式
            </el-tag>
            <el-select v-if="activeName != 'fourth'" v-model="payType" clearable placeholder="请选择">
                <el-option
                v-for="item in payTypes"
                :key="item.label"
                :label="item.lable"
                :value="item.lable">
                </el-option>
            </el-select>
            <!-- 选择支付方式 -->
            <el-tag v-if="activeName == 'fourth'" effect="dark">
                选择优惠劵
            </el-tag>
            <el-select v-if="activeName == 'fourth'" v-model="selectCoupon" clearable placeholder="请选择">
                <el-option
                v-for="item in currentMember.coupon_id"
                :key="item.goods_no"
                :label="item.goods_name"
                :value="item.goods_no">
                </el-option>
            </el-select>
            <!-- 备注 -->
            <div class="remark">备注信息：</div>
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="remark">
            </el-input>
            <div class="totalPrice">订单总价：{{countPrice}}</div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="accountDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="openInner">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择员工的对话框 -->
        <el-dialog
        title="选择员工" :visible.sync="employeeDialogVisible"
        width="50%" @close="employeeDialogClosed" >
            <el-table :data="currentShoppingList" size="small" height="180">
                <el-table-column align="center" type="index"></el-table-column>
                <el-table-column align="center" label="编号" prop="goods_no" width="100"></el-table-column>
                <el-table-column align="center" label="名称" prop="goodsname" width="120"></el-table-column>
                <el-table-column align="center" label="单位" prop="unit" width="100"></el-table-column>
                <el-table-column align="center" label="价格" prop="price" width="100"></el-table-column>
            </el-table>

            <!-- 选择员工 -->
            
            <el-tag effect="dark">
                选择员工
            </el-tag>
            <el-select v-model="e_name" clearable placeholder="请选择">
                <el-option
                v-for="item in employeeList"
                :key="item.name"
                :label="item.name"
                :value="item.name">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="employeeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEmployee">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改页面的对话框 -->
        <el-dialog
        title="修改商品" :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed" >
            <el-form ref="editFormRef" :rules="editFormRules" 
            :model="editForm" label-width="80px">
                <el-form-item label="姓名" prop="goodsname">
                    <el-input v-model="editForm.goodsname"></el-input>
                </el-form-item>
                <el-form-item label="单位" prop="unit">
                    <el-input v-model="editForm.unit" ></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="price">
                    <el-input v-model="editForm.price" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmEdit">确 定</el-button>
            </span>
        </el-dialog>
        
        <!-- 搜索会员结果的对话框 -->
        <el-dialog
        title="会员信息" :visible.sync="searchDialogVisible"
        width="50%">
        
            <el-table stripe size="small" 
                :data="memberlist"
                @row-dblclick="selectMember"
                style="width: 100%">
                <el-table-column
                    prop="card_no"
                    label="卡号"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="姓名"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="tel"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="balance"
                    label="余额">
                </el-table-column>
                <el-table-column
                    prop="consum_points"
                    label="积分">
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import cloudbase from "@cloudbase/js-sdk";
export default {
    data(){
        
        return{
            
            //获取商品列表的参数对象
            pagenum:1,
            pagesize:10,
            goodslist:[],
            goodsname:'',
            total:0,
            searchDialogVisible:false,
            //模糊查询获取会员数组
            memberlist:[],
            //模糊查询搜索字段
            memberSearch:'',
            //模糊查询当前选中的对象
            currentMember:{},
            //当前购物车
            shoppingList:[],
            //当前购物车中修改的商品
            currentShopping:{},
            currentShoppingList:[],
            currentIndex:0,
            //当前员工列表
            employeeList:[],
            e_name:'',
            //办理新卡已经提成的员工列表
            newCardDeduct:[],
            //购物车商品总价
            countPrice:0,
             //控制修改商品对话框的显示与隐藏
            editDialogVisible:false,
            employeeDialogVisible:false,
            accountDialogVisible:false,
            innerVisible:false,
            //查询到的商品对象
            editForm:{
                goodsname:'',
                unit:'',
                price:0
            },
            //修改表单的验证规则对象
            editFormRules:{
                goodsname:[
                    {required:true,message:'请输入商品名',trigger:'blur'}
                ],
                unit:[
                    {required:true,message:'请输入商品单位',trigger:'blur'}
                ],
                price:[
                    {required:true,message:'请输入商品价格',trigger:'blur'}
                ]
            },
            //结算按钮的状态
            accountDisabled:true,
            //结算界面参数
            payTypes:[],
            customTypes:[
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
            customPay:'',
            remark:'',
            currentSub:'',
            //切换会员和散客
            selected:0,
            //选择完成人员
            openCompleted:[],
            openCompletedW:200,
            //选择商品类别
            activeName: 'first',
            type:1,
            //是否显示补充余额
            addBalance:0,
            
            //被选中的优惠卷的商品编号
            selectCoupon:0,
            MyCoupon:[],
            currentCoupon:{}
        }
    },
    created(){
        //获取当前的分店信息并赋值
        const name = window.sessionStorage.getItem('token')
        this.getSub(name)
        this.getGoodsList()
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
        getSummaries(param) {
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '总价';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))&&values.every(value => (value<10000))) {
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
        //切换商品类别
        handleClick(tab) {
            let name = tab.name
            if(name == 'first'){
                this.type = 1
                this.pagenum = 1
                this.shoppingList = []
                this.payTypes = []
            }else if(name == 'second'){
                this.type = 2
                this.pagenum = 1
                this.shoppingList = []
                this.payTypes = []
                this.currentMember = {}
            }else if(name == 'third'){
                this.type = 5
                this.pagenum = 1
                this.shoppingList = []
                this.payTypes = []
                this.currentMember = {}
            }else{
                this.type = 6
                this.pagenum = 1
                this.shoppingList = []
                this.payTypes = []
            }
            //设置好参数后，调用获取商品列表的接口
            this.getGoodsList()
        },
        //切换会员和散客
        switchTraveler(){
            let selected = this.selected
            if(selected !== 2){
                this.selected = 2
            }
            this.currentMember = {}
        },
        //切换会员和散客
        switchMember(){
            let selected = this.selected
            if(selected !== 1){
                this.selected = 1
            }
        },
        handleSizeChange(newSize){
            this.pagesize = newSize
            this.getGoodsList()
        },
        handleCurrentChange(newPage){
            this.pagenum = newPage
            this.getGoodsList()
        },
        //监听修改对话框的关闭事件
        editDialogClosed(){
            this.$refs.editFormRef.resetFields()
        },
        employeeDialogClosed(){
            //清空当前选择的数据对象数组
            this.currentShoppingList = undefined
        },
        accountDialogClosed(){
        },
        //结算订单对话框
        async accountOrder(){
            this.accountDialogVisible = true
            let currentMember = this.currentMember
            let shoppingList = this.shoppingList
            console.log('当前的购物车列表为',shoppingList)
            let type = shoppingList[0].type
            if(type == 1){
                this.payTypes.splice(0,5,
                {
                    value:1,
                    lable:'会员余额'
                },
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
                })
            }else if(type == 2){
                this.payTypes.splice(0,5,
                {
                    value:1,
                    lable:'美团支付'
                },
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
                })
            }else if(type == 5){
                this.payTypes.splice(0,4,
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
                })
            }else{
                //遍历我的优惠卷
                //根据ID查询用户信息接口
                const app = cloudbase.init({
                    env: "cloud1-9gt8jfexd120c4fc"
                });
                
                const db = app.database();
                const result = await db.collection("my_coupon")
                .where({
                    _openid:currentMember._openid
                })
                .get()
                if(result.length == 0){
                    return this.$message.error('查询用户优惠卷集合信息失败！')
                }
                let MyCoupon = result.data
                this.MyCoupon = MyCoupon
                
                console.log("此用户的所有优惠卷集合",this.MyCoupon)
            }
            if(currentMember.tel !== undefined){
                this.payType = '会员余额'
            }
            //计算当前订单的总价
            this.totalPrice()
        },
        totalPrice(){
            let shoppingList = this.shoppingList
            //每次计算都将原始价格重置为0
            let countPrice = 0
            for(var i in shoppingList){
                countPrice = parseInt(shoppingList[i].price)+countPrice
            }
            this.countPrice = countPrice
        },

        openInner(){
            if(this.payType == ''){
                return this.$message.error('请选择支付方式再进行提交')
            }
            if(this.activeName !== 'fourth'){
                let member = this.currentMember
                let countPrice = this.countPrice
                if(member.tel !== undefined && member.balance < countPrice){
                    this.$message.error('当前用户余额不足，请先充值再进行提交')
                    this.addBalance = countPrice - member.balance
                }
            }
            
            //1.打开对话框
            this.innerVisible = true
            //2.判断余额是否充足，提醒对方
        },
        //确认支付
        async confirmPay(){
            if(this.addBalance !== 0){
                //调用自定义充值方法
                await this.customBalance(this.addBalance)
            }
            this.innerVisible = false
            //清空
            this.payTypes = []
            //获取当前的支付方式以及备注
            if(this.activeName == 'fourth'){
                //获取当前购物车
                let shoppingList = this.shoppingList
                let isSelect = 0
                //生成单据之后再生成对应的单条消费记录
                for(var i in shoppingList){
                    let shopping = shoppingList[i]
                    //1.遍历我的优惠券
                    let couponList= this.MyCoupon
                    for(let j in couponList){
                        //如果定位了某一张优惠券
                        let goods_no = shopping.goods_no
                        if(goods_no == couponList[j].goods_no){
                            isSelect = 1
                        }
                    }
                }
                if(isSelect == 0){
                    return this.$message.error('你提交的商品，不在该顾客的优惠券中,请重新选择')
                }
            }
            
            
            this.addOrder()

        },
        //自定义会员充值接口
        async customBalance(addBalance){
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            //获取当前会员信息
            let member = this.currentMember
            let memberOpenId = ''
            let memberName = '散客'
            let memberTel = ''
            if(member.tel !== undefined){
                if(member._openid){
                    memberOpenId = member._openid
                }
                memberName = member.name
                memberTel = member.tel
            }
            const result = await app.callFunction({
                name:'addGoodRecord',
                data:{
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    payType:this.customPay,
                    sub_id:this.currentSub,
                    price:addBalance
                }

            })
            console.log('自定义充值结果',result.result)
            if(result.result._id == undefined){
                return this.$message.error('自定义充值失败')
            }
            this.$message.success('自定义充值成功')

            const updateTime = this.getNowFormatDate()
            let balance = member.balance + addBalance
            let cumulant = member.cumulant
            let consumPoints = member.consum_points
            //2.调用修改云函数
            const resU = await this.$cloudbase.callFunction({
                name:"update-member",
                data:{
                    _id:member._id,
                    balance:balance,
                    cumulant:cumulant,
                    consumPoints:consumPoints,
                    updateTime:updateTime
                },  
            })
            if(resU.result.updated !== 1){
                return this.$message.error('自定义会员充值失败！')
            }
            this.$message.success('自定义会员充值成功！')
        },
        //生成单据
        async addOrder(){
            //关闭结算对话框
            this.accountDialogVisible = false
            
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            let orderNo = 'GB'+this.getNumber()
            console.log('订单号为',orderNo)
            //获取当前会员信息
            let member = this.currentMember
            let memberOpenId = ''
            let memberName = '散客'
            let memberTel = '——'
            let cardNo = '——'
            let memberBalance = 0
            if(member.tel !== undefined){
                if(member._openid){
                    memberOpenId = member._openid
                }
                
                memberName = member.name
                memberTel = member.tel
                cardNo = member.card_no
                memberBalance = member.balance
            }
            //获取当前的支付方式以及备注
            if(this.activeName == 'fourth'){
                this.payType = '优惠券抵扣'
            }
            let payType = this.payType
            
            let remark = this.remark
            //获取当前的时间
            const currentTime = this.getNowFormatDate()
            const updateTime = this.getNowFormatDate()

            //获取当前购物车
            let shoppingList = this.shoppingList
            const result = await app.callFunction({
                name:'add-order',
                data:{
                    orderNo:orderNo,
                    totalPrice:this.countPrice,
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    cardNo:cardNo,
                    operateId:'',
                    subId:this.currentSub,
                    recallId:'',
                    recallName:'',
                    recallCause:'',
                    shoppingList:shoppingList,
                    state:1,
                    payType:payType,
                    type:'',
                    remark:remark,
                    createTime:currentTime,
                    updateTime:updateTime
                }

            })
            if(result.result.id == undefined){
                return this.$message.error('生成单据失败')
            }
            this.$message.success('生成单据成功')

            console.log('当前的购物车为',shoppingList)
            //生成单据之后再生成对应的单条消费记录
            for(var i in shoppingList){
            
                let shopping = shoppingList[i]
                console.log('当前的计算商品为',shopping,memberBalance)
                if(memberBalance !== 0 && this.activeName !== 'fourth'){
                    memberBalance = memberBalance - shopping.price
                }
                //如果当前为优惠卷消费
                if(this.activeName == 'fourth'){
                    //修改该用户的我的优惠卷中的该商品编号的对应的优惠券的次数
                    //1.遍历我的优惠券
                    let couponList= this.MyCoupon
                    //根据ID查询用户信息接口
                    const app = cloudbase.init({
                        env: "cloud1-9gt8jfexd120c4fc"
                    });
                    const currentTime = this.getNowFormatDate()
                    const db = app.database();
                    for(let j in couponList){
                        //如果定位了某一张优惠券
                        let goods_no = shopping.goods_no
                        if(goods_no == couponList[j].goods_no){
                            this.currentCoupon = couponList[j]
                            let totalTime = parseInt(couponList[j].totalTime)
                            let usedTime = parseInt(couponList[j].usedTime) +1
                            //进行修改操作
                            const resUMcoupon = await db.collection("my_coupon")
                            .where({
                                _openid:this.currentMember._openid,
                                goods_no:goods_no 
                            })
                            .update({
                                usedTime:usedTime,
                                updateTime:currentTime
                            })
                            console.log('修改优惠卷结果',resUMcoupon)
                            if(resUMcoupon.updated !== 1){
                                return this.$message.error('修改用户优惠卷次数失败！')
                            }
                            this.$message.success('更新用户优惠卷次数成功！')
                            if(totalTime == usedTime){
                                //如果相等，则要删除该用户会员表中的优惠卷，并删除我的优惠卷表中的优惠卷数据
                                const result = await db.collection("my_coupon")
                                .where({
                                   _openid:this.currentMember._openid,
                                    goods_no:goods_no  
                                })
                                .remove()
                                if(result.deleted !== 1){
                                    return this.$message.error('删除该用户的优惠卷失败！')
                                }
                                this.$message.success('该用户次数已用完，删除优惠卷成功！')

                                //删除用户表用的对应优惠卷
                                const _ = db.command
                                const res1 = await db.collection('member').doc(this.currentMember._id).update({
                                    coupon_id: _.pull({
                                        goods_no:goods_no
                                    })
                                })
                                if(res1.updated !== 1){
                                    return this.$message.error('删除用户优惠卷次数失败！')
                                }
                                this.$message.success('删除用户优惠卷次数成功！')
                                
                            }
                            
                        }
                    }
                }
                
                //生成单条商品消费记录
                await this.addGoodsRecord(shopping,orderNo,memberBalance)
                //生成员工提成记录
                await this.addDeductRecord(shopping,orderNo)
            }
            
            //生成消费记录之后，如果是会员消费则对该会员进行扣费，积分，以及生成累积消费
            if(member.tel !== undefined && this.activeName !== 'fourth'){
                const updateTime = this.getNowFormatDate()
                let balance = parseInt(member.balance) + this.addBalance - this.countPrice
                let cumulant = member.cumulant + this.countPrice
                let consumPoints = member.consum_points+this.countPrice
                //2.调用修改云函数
                const resU = await this.$cloudbase.callFunction({
                    name:"update-member",
                    data:{
                        _id:member._id,
                        balance:balance,
                        cumulant:cumulant,
                        consumPoints:consumPoints,
                        updateTime:updateTime
                    },  
                })
                if(resU.result.updated !== 1){
                    return this.$message.error('扣减会员余额失败！')
                }
                this.$message.success('扣减会员余额成功！')
            }
            

            //关闭结算对话框
            // this.accountDialogVisible = false
            //清空购物车
            this.shoppingList = []
            //清空
            this.openCompleted = []
            //清空支付方式和备注
            this.payType = ''
            this.remark = ''
            //清空
            this.newCardDeduct = []
            this.currentMember = {}
            this.currentCoupon = {}
        },
        //添加员工提成记录
        async addDeductRecord(shopping,orderNo){
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            var date = new Date()
            //获取年月
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var day = date.getDate()
            //获取当前会员信息
            let member = this.currentMember
            let memberOpenId = ''
            let memberName = ''
            let memberTel = ''
            let card_no = ''
            let deType = '会员'
            let payType = this.payType
            //计算员工提成
            //1.如果该员工没有设置提成系数，则直接按照商品的提成系数计算
            //2.如果该类型为会员新卡，是该会员的第一单，除了商品的提成外，还需要给提成人员计算新卡提成
            let deRate = 0.3
            if(member.coe_deduct == 0 || member.coe_deduct == undefined){
                deRate = shopping.coe_deduct
            }else{
                deRate = member.coe_deduct
            }
            let deMoney = 0
            
            let coupon = this.currentCoupon
            let couponState = 0
            if(this.activeName == 'fourth'){
                let total = parseInt(coupon.totalPrice)
                if(coupon.usedTime !== 0){
                    couponState = 1
                }
                let time = coupon.totalTime
                let price = (total/time).toFixed(2)
                deMoney = (price*deRate).toFixed(2)
            }else{
                deMoney = (shopping.price * deRate).toFixed(2)
            }
            if(member.tel !== undefined && couponState == 0){
                if(member._openid){
                    memberOpenId = member._openid
                }
                card_no = member.card_no
                memberName = member.name
                memberTel = member.tel
                //1.判断该会员是不是新办的卡，如果是需要给办卡员工提成
                //   a.计算本单中该员工的提成比例，计算完成后，将已计算员工设置为newCardDeduct:[]
                if(member.type !== 2 && member.cumulant == 0 && this.activeName !== 'fourth'
                && this.newCardDeduct.indexOf(shopping.employee) == -1){
                    //如果不包含当前员工，计算该员工的提成比例
                    //获取当前购物车
                    let shoppingList = this.shoppingList
                    let totalPrice = this.countPrice
                    let itemPrice = 0
                    for(var i in shoppingList){
                        console.log('员工姓名字符串是否相等',shoppingList[i].employee == shopping.employee)
                        if(shoppingList[i].employee == shopping.employee){
                            itemPrice = itemPrice + parseInt(shoppingList[i].price)
                        }
                    }
                    //将该员工添加为已提成员工
                    this.newCardDeduct.push(shopping.employee)
                    //为该员工进行新卡提成记录的添加
                    //获取当前的时间
                    const currentTime = this.getNowFormatDate()
                    const updateTime = this.getNowFormatDate()
                    
                    //自定义提成
                    let deCoe = 0.1
                    if(member.member_coe !== undefined && member.member_coe !== 0){
                        deCoe = member.member_coe
                    }
                    let deNewMoney = 0
                    let deNewType = '新卡'
                    let deNewRate = 0
                    
                    if(this.activeName == 'fourth' && coupon.usedTime == 0){
                        let price = parseInt(coupon.totalPrice)
                        deCoe = 0.05
                        deNewRate = itemPrice/totalPrice * deCoe
                        //计算优惠券提成
                        deNewMoney = (price * deNewRate).toFixed(2)
                        deNewType = '按次服务'
                    }else{
                        console.log('此时的提成比例为------------为',deCoe)
                        deNewRate = itemPrice/totalPrice * deCoe
                        //计算提成
                        deNewMoney = (member.cash * deNewRate).toFixed(2)
                    }
                    
                    console.log('新卡参数',deNewRate,deNewMoney)
                    const result =await app.callFunction({
                        name:'add-deductRecord',
                        data:{
                            employee:shopping.employee,
                            price:member.cash,
                            deMoney:deNewMoney,
                            goodsType:0,
                            goodsNo:0,
                            goodsName:'',
                            deType:deNewType,//1会员，散客，办卡
                            payType:payType,
                            deRate:deNewRate,//办卡提成率
                            orderNo:orderNo,
                            memberOpenId:memberOpenId,
                            memberName:memberName,
                            memberTel:memberTel,
                            card_no:card_no,
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
                        return this.$message.error('生成员工XIN卡提成记录失败')
                    }
                    this.$message.success('生成员工XIN卡提成记录成功')

                }

            }else{
                if(this.activeName == 'fourth'){
                    if(member._openid){
                        memberOpenId = member._openid
                    }
                    card_no = member.card_no
                    memberName = member.name
                    memberTel = member.tel
                }else{
                    deType = '散客'
                }
            }
            console.log('参数',memberOpenId,memberName,memberTel,deType,deMoney,shopping,orderNo)
            //获取当前的时间
            const currentTime = this.getNowFormatDate()
            const updateTime = this.getNowFormatDate()
        
            const result =await app.callFunction({
                name:'add-deductRecord',
                data:{
                    employee:shopping.employee,
                    price:shopping.price,
                    deMoney:deMoney,
                    goodsType:shopping.type,
                    goodsNo:shopping.goods_no,
                    payType:payType,
                    goodsName:shopping.goodsname,
                    deType:deType,//1会员，散客，办卡
                    deRate:deRate,//办卡提成率
                    orderNo:orderNo,
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    card_no:card_no,
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
                return this.$message.error('生成员工提成记录失败')
            }
            this.$message.success('生成员工提成记录成功')

        },
        
        //添加商品消费记录
        async addGoodsRecord(shopping,orderNo,memberBalance){
            //添加商品列表，如果有会员添加其姓名ID最后添加remark以及支付方式
            //状态以及时间是必须的，采用云函数端调用的方法
            //最后再添加单据编号
            //添加消费记录接口
            const app = cloudbase.init({
                env: "cloud1-9gt8jfexd120c4fc"
            });
            
            //获取当前会员信息
            let member = this.currentMember
            let memberOpenId = ''
            let memberName = ''
            let memberTel = ''
            let card_no = ''
            
            if(member.tel !== undefined){
                if(member._openid){
                    memberOpenId = member._openid
                }
                memberName = member.name
                memberTel = member.tel
                card_no = member.card_no
            }
            //获取当前的支付方式以及备注
            let payType = this.payType
            let remark = this.remark
            //获取当前的时间
            const currentTime = this.getNowFormatDate()
            const updateTime = this.getNowFormatDate()
            //获取年月
            var date = new Date()
            var year = date.getFullYear()
            var month = date.getMonth() + 1
            var timestamp = Date.parse(date)
            const result =await app.callFunction({
                name:'add-goodsRecord',
                data:{
                    goodsname:shopping.goodsname,
                    orderNo:orderNo,
                    type:shopping.type,
                    price:shopping.price,
                    employee:shopping.employee,
                    memberOpenId:memberOpenId,
                    memberName:memberName,
                    memberTel:memberTel,
                    card_no:card_no,
                    state:1,
                    payType:payType,
                    remark:remark,
                    memberBalance:memberBalance,
                    sub_id:this.currentSub,
                    createTime:currentTime,
                    updateTime:updateTime,
                    timestamp:timestamp,
                    year:year,
                    month:month
                }

            })
            if(result.result.id == undefined){
                return this.$message.error('生成消费记录失败')
            }
            this.$message.success('生成消费记录成功')
        },
        //展示Employee对话框
        async selectEmployee(index,row){
            console.log(index,row)
            this.openCompleted[index] = true
            this.openCompletedW = 500
            //this.employeeDialogVisible=true
            //选择员工时，将选择的数据项放入当前对象中，方便后续操作
            this.currentIndex = index
            this.currentShoppingList = []
            this.currentShoppingList.push(row)
            console.log('哈哈哈哈当前index',index)
            //调用查询员工接口并赋值给员工列表
            const res = await this.$cloudbase.callFunction({
                name: "get-member",
                data: {
                    position:3,
                    sub_id:this.currentSub
                },
            })
            this.employeeList = res.result.data
            console.log(this.employeeList)
        },
        
        //展示Edit对话框
        handleEdit(index,row){
            //打开编辑页面对话框，然后给变量赋值
            console.log(row)
            this.editDialogVisible=true
            this.currentShopping = row
            this.currentIndex = index
            //将信息放入编辑框中
            this.editForm = row
        },
        //确认选择员工index
        confirmEmployee(index){
            //获取最新购物车列表，根据最新index添加提成人员
            let shoppingList = this.shoppingList
            let currentIndex = index
            //获取当前已选择的员工value
            let value = this.e_name
            let newShoppingList = []
            for(var i in shoppingList){
                console.log(i,currentIndex)
                if(parseInt(i) === currentIndex){
                    //为当前商品添加员工的电话
                    shoppingList.map((item,index)=>{
                        if(index==currentIndex){
                            newShoppingList.push(Object.assign({},item,{employee:value}))
                        }else{
                            newShoppingList.push(item)
                        }
                    })
                }
            } 
            this.shoppingList = newShoppingList
            console.log('哈哈哈',this.shoppingList)
            //完成之后清空value值,否则下一个商品也是这个员工了
            this.e_name = ''
            //关闭对话框
            //this.employeeDialogVisible=false
            //关闭选择框
            this.openCompleted[currentIndex] = false
            //检查当前数组中是否都已经有员工，开启支付按钮，如果添加新商品时需重新关闭
            this.confirmAcount()
            
            //如果所有都为false再关闭
            let openCompleted = this.openCompleted
            for(var j in openCompleted){
                if(openCompleted[j] == true){
                    this.openCompletedW = 500
                    return
                }
                this.openCompletedW = 200
            }
            
            
        },
        //校验是否显示结算订单按钮的方法
        confirmAcount(){
            let newList = this.shoppingList
            for(var j in newList){
                if(newList[j].employee == undefined ||newList[j].employee == '' ){
                    console.log('----------存在未选择员工的数据-----------')
                    this.accountDisabled=true
                    return
                }else if(j == newList.length-1){
                    this.accountDisabled=false
                }
            }
        },
        //校验提交修改内容
        confirmEdit(){
            this.$refs.editFormRef.validate(
                async valid=>{
                    if(!valid) return
                    //利用for循环遍历当前购物车中的商品，如果是满足索引则修改
                    let shoppingList = this.shoppingList
                    let index = this.currentIndex
                    for(var i in shoppingList){
                        console.log(i,index)
                        if(parseInt(i) === index){
                            console.log('当前数据将会被修改',this.editForm.price)
                            let shopping = this.shoppingList[index]

                            //VUE中数组中对象重新渲染的方案
                            shopping = Object.assign({},shopping)
                            this.$set(this.shoppingList,index,shopping)
                        }
                    }
                    //修改完成之后重新赋值给当前购物车
                    console.log(this.editForm)
                    //关闭对话框
                    this.editDialogVisible = false
                    this.$message.success('修改商品成功！')
                }
            )
        },

        //加入购物车
        addShopping(row){
            let arr = this.shoppingList
            let completed = this.openCompleted
            console.log('哈哈哈',row)
            arr = arr.concat(row)
            completed = completed.concat(false)
            this.shoppingList = arr
            this.openCompleted = completed
            //如果结算打开请关闭
            this.accountDisabled=true
        },
        //从购物车中移除
        deleteRow(index, rows){
            console.log(index,rows)
            rows.splice(index, 1);
            //移除后校验是否显示
            this.confirmAcount()
        },
        
        //选择会员
        selectMember(row){
            this.currentMember = row
            this.searchDialogVisible = false
        },
        //关闭搜索框的同时清空选中的会员
        clearMember(){
            this.currentMember = {}
        },

        
        //模糊查询获取会员列表
        async getMemberList(){
            try {
                console.log('当前输入',this.memberSearch)
                if(this.memberSearch == ''){
                    console.log('请重新输入')
                }else{
                    let numReg = /^[0-9]*$/
                    let numRe = new RegExp(numReg)
                    if(!numRe.test(this.memberSearch)){
                        let name = this.memberSearch
                        console.log('名字')
                        //1.查询数组
                        const res = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                name:name,
                                position:1
                            },
                        })
                        this.memberlist = res.result.data
                        console.log('获取到的结果',this.memberlist)
                    }else{
                        console.log('数字')
                        let search = this.memberSearch
                        let arr = []
                        //1.查询数组
                        const res = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                tel:search,
                                position:1
                            },
                        })
                        let result1 = res.result.data
                        arr = arr.concat(res.result.data)
                        
                        console.log('我是第一个',arr)
                        const resNum = await this.$cloudbase.callFunction({
                            name: "get-member",
                            data: {
                                cardNo:search,
                                position:1
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

                    //打开搜索框
                    this.searchDialogVisible = true
                }
                
            } catch (e) {
                this.memberlist = e+'我是错误的';
            }
        },
        //获取商品列表
        async getGoodsList(){
            console.log(this.goodsname,'-------------')
            try {
                //1.查询数组
                const res = await this.$cloudbase.callFunction({
                    name: "get-goods",
                    data: {
                        page: this.pagenum,
                        pagesize: this.pagesize,
                        name: this.goodsname,
                        sub_id:this.currentSub,
                        type:this.type
                    },
                })
                this.goodslist = res.result.data
                console.log('来了',this.goodslist)
                //2、查询数组
                const resT = await this.$cloudbase.callFunction({
                    name: "get-goods",
                    data: {
                        name:this.goodsname,
                        sub_id:this.currentSub,
                        type:this.type
                    },
                })
                this.total = resT.result.data.length
            } catch (e) {
                this.goodslist = e+'我是错误的';
            }

        }
    }
}
</script>

<style lang="less" scoped>
    // .card1{
    //     margin-bottom: 10px;
    // }
    .title{
        font-size: 18px;
        line-height: 1.7;
        font-family: "微软雅黑";
        margin-bottom: 10px;
    }
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
    .el-tag{
        margin-right: 12px ;
    }
    .cell{
        line-height: 0;
        padding-right: 0;
    }
    .account{
        position:absolute;
        bottom:60px;
        right: 60px;
    }

</style>
