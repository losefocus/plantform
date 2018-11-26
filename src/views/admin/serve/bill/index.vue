<template>
    <div style="background: #fff;">
        <div class="b_c">
            <div class="c_t clearfix">
                <div class="t_l clearfix">
                    <span class="pull-left">发票类型</span>
                    <div class="pull-left" style="width:120px;margin-left:10px;" >
                        <el-select size="small" v-model="listQuery.bill_type" placeholder="请选择" @change="handleChange">
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
                    <span class="pull-left">开票状态</span>
                    <div class="pull-left" style="width:120px;margin-left:10px;" >
                        <el-select size="small" v-model="listQuery.status" placeholder="请选择" @change="handleChange">
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
                <div class="t_l"  style="width:120px;">
                    <el-input v-model="listQuery.username" size="small" placeholder="用户名称" @blur="handleChange"></el-input>
                </div>
                <div class="t_l" style="margin-right:0px">
                    <el-button size="small" @click="handleChange">查询</el-button>
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
                            prop="createdAt"
                            align="center"
                            label="申请日期">
                            <template slot-scope="scope">
                                <span>{{scope.row.createdAt | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="title"
                            align="center"
                            label="发票抬头"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop="total"
                            align="center"
                            label="发票总额">
                        </el-table-column>
                        <el-table-column
                            prop="billType"
                            align="center"
                            label="发票类型">
                            <template slot-scope="scope">
                                <span>{{typeMap.get(scope.row.billType.toString())}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            align="center"
                            label="开票状态">statusMap
                            <template slot-scope="scope">
                                <span>{{statusMap[scope.row.status.toString()]}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="comment"
                            align="center"
                            label="备注"
                            show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            prop=""
                            align="center"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.status == 0" plain size="mini" @click="updateBill(scope.row)">开票</el-button>
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
import { fetchList,updateObj} from "@/api/serve/bill";
import {remote} from "@/api/dict";
export default {
    data(){
        return {
            statusOptions:[{value:'',label:'所有状态'},{value:'0',label:'未开票'},{value:'1',label:'已开票'},{value:'2',label:'已邮寄'},],
            typeOptions:[],
            time:[],
            list:[],
            listQuery:{
                page_index:1,
                page_size:20,
                sort_by:'ob.created_at',
                direction:'desc',
            },
            total:0,
            loading:false,
            typeMap:null,
            statusMap:{
                '0':'未开票',
                '1':'已开票',
                '2':'已邮寄',
            }
        }
    },
    computed: {
        
    },
    created() {
        remote("bill_type").then(res => {
            this.typeOptions = res.data.result
            this.typeOptions.unshift({value:'',label:'所有类型'})
            this.typeMap = new Map()
            res.data.result.forEach(ele => {
                this.typeMap.set(ele.value,ele.label)
            });
        });
    },
     mounted(){
        this.getList()
    },
    methods:{
        changeTime(val){
            this.listQuery.page_index = 1;
            this.listQuery.date_start = new Date(val[0]).getTime()/1000
            this.listQuery.date_end = new Date(val[1]).getTime()/1000
            this.getList()
        },
        handleChange(){
            this.listQuery.page_index=1
            this.getList();
        },
        filterKeyword(){
            this.listQuery.page_index=1
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
        },
        updateBill(row){
            let data ={id:row.id,status:1}
            updateObj(data).then(res => {
                if(res.data.success){
                    this.$notify({
                        title: '成功',
                        message: "操作成功",
                        type: "success",
                        duration: 2000
                    });
                    this.listQuery.page_index=1
                    this.getList()
                }
                
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

