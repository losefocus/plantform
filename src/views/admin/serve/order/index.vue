<template>
    <div style="background: #fff;">
        <div class="b_c">
            <div class="c_t clearfix">
                <div class="t_l clearfix">
                    <span class="pull-left">产品服务</span>
                    <div class="pull-left" style="width:120px;margin-left:10px;" >
                        <el-select size="small" v-model="listQuery.service_id" placeholder="请选择" @change="handleChange">
                            <el-option
                            v-for="item in serviceOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    
                </div>
                <div class="t_l clearfix">
                    <span class="pull-left">支付状态</span>
                    <div class="pull-left" style="width:120px;margin-left:10px;">
                    <el-select  size="small" v-model="listQuery.status" placeholder="请选择" @change="handleChange">
                        <el-option
                        v-for="item in statusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                    </div>
                </div>
                <div class="t_l clearfix">
                    <span class="pull-left">时间范围</span>
                    <div class="pull-left" style="width:250px;margin-left:10px;">
                        <el-date-picker
                        v-model="time"
                        size="small"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        unlink-panels
                        @change="changeTime">
                        </el-date-picker>
                    </div>
                </div>
                <div class="t_l" style="width:100px;">
                    <el-select v-model="filterKey" placeholder="请选择" size="small" @change="changeKey">
                        <el-option label="订单号" value="order_no"> </el-option>
                        <el-option label="用户名" value="username"> </el-option>
                    </el-select>
                </div>
                <div class="t_l"  style="width:120px;margin-left:-15px">
                    <el-input v-model="filterVal" size="small"></el-input>
                </div>
                <div class="t_l" style="margin-right:0px">
                    <el-button size="small" @click="filterKeyword">查询</el-button>
                </div>
            </div>
            <div class="c_b" v-loading="loading">
                    <el-table
                        :data="list"
                        style="width: 100%">
                        <el-table-column
                            prop="username"
                            label="用户名称"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="orderNo"
                            label="订单号"
                            width="120">
                        </el-table-column>
                        <el-table-column
                            prop="serviceName"
                            align="center"
                            label="产品/服务">
                        </el-table-column>
                        <el-table-column
                            prop="payMethod"
                            align="center"
                            label="支付方式">
                            <template slot-scope="scope">
                                <span>{{payMethodMap.get(scope.row.payMethod+'')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="payMoney"
                            align="center"
                            label="付款金额"
                            width="150">
                            <template slot-scope="scope">
                                <span style="color:#EB474D;font-size:16px;">￥{{scope.row.payMoney}}</span>
                                <span style="color:#979797;font-size:12px;">(已折扣￥{{scope.row.discountPrice}})</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="createdAt"
                            align="center"
                            label="创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="payAt"
                            align="center"
                            label="支付时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.payAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            align="center"
                            label="状态">
                            <template slot-scope="scope">
                                <span>{{statusMap.get(scope.row.status+'')}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div style="margin-top:20px;" class="clearfix">
                        <div class="pull-right">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
                            </el-pagination>
                        </div>
                    </div>
            </div>
           
        </div>
    </div>
</template>

<script>
import { fetchList,serviceList} from "@/api/serve/order";
import {remote} from "@/api/dict";  

export default {
    data(){
        return {
            serviceOptions:[],
            type:'',
            statusOptions:[],
            time:[],
            list:[],
            listQuery:{
                page_index:1,
                page_size:20,
                sort_by:'o.created_at',
                direction:'desc',
            },
            total:0,
            filterKey:'order_no',
            filterVal:'',
            statusMap:null,
            payMethodMap:null,
            loading:false,
        }
    },
    computed: {
        
    },
    created() {
        remote("order_status").then(res => {
            [...this.statusOptions] = res.data.result
            this.statusOptions.unshift({value:'',label:'所有状态'})
            this.statusMap = new Map()
            res.data.result.forEach(ele => {
                this.statusMap.set(ele.value,ele.label)
            });
        });
        remote("pay_method").then(res => {
            this.payMethodMap = new Map()
            res.data.result.forEach(ele => {
                this.payMethodMap.set(ele.value,ele.label)
            });
        });
        this.getServiceList()
    },
    mounted(){
        this.getList()
    },
    methods:{
        getServiceList(){
            let data ={
                page_index:1,
                page_size:99
            }
            serviceList(data).then(res => {
                this.serviceOptions = res.data.result.items.map(v => {return {value:v.id,label:v.name}})
                this.serviceOptions.unshift({value:'',label:'所有状态'})
            })
        },
        changeKey(){
            delete this.listQuery.order_no
            delete this.listQuery.username
        },
        filterKeyword(){
            this.listQuery.page_index = 1
            this.listQuery[this.filterKey] = this.filterVal
            this.getList();
        },
        changeTime(val){
            this.listQuery.page_index = 1;
            this.listQuery.date_start = new Date(val[0]).getTime()/1000
            this.listQuery.date_end = new Date(val[1]).getTime()/1000
            this.getList()
        },
        handleChange(){
            this.listQuery.page_index = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.page_size = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.page_index = val;
            this.getList();
        },
        getList(){
            this.loading = true
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
                this.loading = false
            })
        }
    }
}
</script>
<style lang="scss" scoped>
    .b_c{
        padding: 0 45px 30px;
        .c_t{
            height: 70px;
            line-height: 70px;
            font-size: 14px;
            color: #666666;
            .t_l{
                float: left;
                margin-right:20px;
            }
        }
    }
</style>

