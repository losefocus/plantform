<template>
    <div style="background: #fff;">
        <div class="b_c">
            <div class="c_t clearfix">
                <div class="t_l clearfix">
                    <span class="pull-left">产品服务</span>
                    <div class="pull-left" style="width:120px;margin-left:10px;" >
                        <el-select size="small" v-model="product" placeholder="请选择">
                            <el-option
                            v-for="item in productOptions"
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
                    <el-select  size="small" v-model="type" placeholder="请选择">
                        <el-option
                        v-for="item in typeOptions"
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
                        end-placeholder="结束日期">
                        </el-date-picker>
                    </div>
                </div>
                <div class="t_l" style="width:100px;">
                    <el-select v-model="filterKey" placeholder="请选择" size="small">
                        <el-option label="订单号" value="order_no"> </el-option>
                        <el-option label="用户名" value="buyer_name"> </el-option>
                    </el-select>
                </div>
                <div class="t_l"  style="width:120px;margin-left:-15px">
                    <el-input v-model="filterVal" size="small"></el-input>
                </div>
                <div class="t_l" style="margin-right:0px">
                    <el-button size="small" @click="filterKeyword">查询</el-button>
                </div>
            </div>
            <div class="c_b">
                    <el-table
                        :data="list"
                        style="width: 100%">
                        <el-table-column
                            prop="buyerName"
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
import { fetchList} from "@/api/serve/order";

export default {
    data(){
        return {
            product:'',
            productOptions:[{value:'1',label:'所有产品'}],
            type:'',
            typeOptions:[{value:'1',label:'所有状态'}],
            time:[],
            list:[{name:'12s',money:'123'}],
            listQuery:{
                page_index:1,
                page_size:20
            },
            total:0,
            filterKey:'order_no',
            filterVal:''
        }
    },
    computed: {
        
    },
    created() {
        this.getList()
    },
    methods:{
        filterKeyword(){
            this.listQuery={
                page_index:1,
                page_size:20
            },
            this.listQuery[this.filterKey] = this.filterVal
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
            fetchList(this.listQuery).then(res => {
                this.list = res.data.result.items
                this.total = res.data.result.total
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

