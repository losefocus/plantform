<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <div class="pull-right">
        <el-input class="filter-item" v-model="listQuery.requestUri" size="small" style="width:150px"/>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索</el-button>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="createIndex" size="small" v-if="log_btn_create">创建索引</el-button>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="deleteIndex" size="small" v-if="sys_log_del">删除索引</el-button>
      </div>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <el-table-column label="服务ID" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.serviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求接口" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.requestUri }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createNow}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="IP地址">
        <template slot-scope="scope">
          <span>{{ scope.row.remoteAddr }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求方式">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="传入参数" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="请求耗时(ms)">
        <template slot-scope="scope">
          <span>{{ scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="异常">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.exception" placement="top-end">
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">{{ scope.row.exception}}</span>
          </el-tooltip>
          
        </template>
      </el-table-column>

    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { createIndex, delIndex, fetchList } from "@/api/log";
import { remote } from "@/api/dict";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { mapGetters } from "vuex";

export default {
  name: "table_log",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      sys_dict_add: false,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20,
        requestUri: undefined
      },
      tableKey: 0,
      log_btn_create:false,
      sys_log_del:false,
    }
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
  },
  created() {
    this.getList()
    this.log_btn_create = this.permissions["log_btn_create"];
    this.sys_log_del = this.permissions["sys_log_del"];

  },
  methods: {
    createIndex(){
      createIndex().then(response => {
        this.$notify({
          title: "成功",
          message: "创建成功",
          type: "success",
          duration: 2000
        });
      })
    },
    deleteIndex(){
      delIndex().then(response => {
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      })
    },
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "createTime";
      this.listQuery.direction = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    handleSizeChange(val) {
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.page_index = val;
      this.getList();
    },
    handleFilter() {
      this.listQuery.page_index = 1;
      this.getList();
    }
  }
};
</script>
<style lang="scss" scoped>

</style>

