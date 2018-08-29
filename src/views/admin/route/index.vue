<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button v-if="sys_route_add" class="filter-item" @click="handleCreate" type="primary" size="small" icon="edit">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleApply" type="primary" size="small" icon="edit">同步</el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="服务名称">
        <template slot-scope="scope">
          <span>{{ scope.row.serviceId }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="匹配路径">
        <template slot-scope="scope">
          <span>{{ scope.row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="转发地址">
        <template slot-scope="scope">
          <span>{{ scope.row.scope }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="去掉前缀">
        <template slot-scope="scope">
          <span>{{ scope.row.stripPrefix | statusFilter(scope.row.stripPrefix) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否重试">
        <template slot-scope="scope">
          <span>{{ scope.row.retryable | statusFilter(scope.row.retryable) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否启用">
        <template slot-scope="scope">
          <span>{{ scope.row.enabled | statusFilter(scope.row.enabled) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="敏感头">
        <template slot-scope="scope">
          <span>{{ scope.row.sensitiveheadersList }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_route_upd" size="mini" type="" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_route_del" size="mini" type="" @click="handleDelete(scope.row)" style="margin-left:0">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="clearfix">
        <el-form-item label="服务名称" prop="serviceId">
          <el-input v-model="form.serviceId" placeholder="服务名称"></el-input>
        </el-form-item>
        <el-form-item label="匹配路径" prop="path">
          <el-input v-model="form.path" placeholder="匹配路径"></el-input>
        </el-form-item>
        <el-form-item label="转发地址" prop="url">
          <el-input v-model="form.url" placeholder="转发地址"></el-input>
        </el-form-item>
        <el-form-item label="去掉前缀" prop="stripPrefix" style="width:50%" class="pull-left">
          <el-radio-group v-model="form.stripPrefix">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否重试" prop="retryable" style="width:50%"  class="pull-right">
          <el-radio-group v-model="form.retryable">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用" prop="enabled" style="width:50%" class="pull-left">
          <el-radio-group v-model="form.enabled">
            <el-radio label="0">否</el-radio>
            <el-radio label="1">是</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="敏感头" prop="sensitiveheadersList" style="width:50%" class="pull-right">
          <el-input v-model="form.sensitiveheadersList" placeholder="敏感头"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" size="small">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" size="small">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" size="small">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, applyObj } from "@/api/route";
import { tableOption } from "@/const/crud/route";
import { mapGetters } from "vuex";
import waves from "@/directive/waves/index.js"; // 水波纹指令
export default {
  name: "route",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      },
      rules: {
        serviceId: [
          {
            required: true,
            message: "请输入服务名称",
            trigger: "blur"
          }
        ],
        path: [
          {
            required: true,
            message: "请输入匹配路径",
            trigger: "blur"
          }
        ],
        stripPrefix: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        retryable: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ],
        enabled: [
          {
            required: true,
            message: "请选择",
            trigger: "blur"
          }
        ]
      },
      form: {
        stripPrefix:'1',
        retryable:'1',
        enabled:'1'
      },
      dialogFormVisible: false,
      dialogStatus: "",
      sys_route_add: false,
      sys_route_upd: false,
      sys_route_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "否",
        1: "是"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.sys_route_add = this.permissions["sys_route_add"];
    this.sys_route_upd = this.permissions["sys_route_upd"];
    this.sys_route_del = this.permissions["sys_route_del"];
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "";
      this.listQuery.direction = false;
      fetchList(this.listQuery).then(response => {
        this.list = response.data.result.items;
        this.total = response.data.result.total;
        this.listLoading = false;
      });
    },
    handleFilter() {
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
    handleDelete(row) {
      delObj(row.id).then(response => {
        this.dialogFormVisible = false;
        this.getList();
        this.$notify({
          title: "成功",
          message: "删除成功",
          type: "success",
          duration: 2000
        });
      });
    },
    handleUpdate(row) {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.form.id = row.id;
      this.form.path = row.path;
      this.form.serviceId = row.serviceId;
      this.form.url = row.url;
      this.form.stripPrefix = row.stripPrefix;
      this.form.retryable = row.retryable;
      this.form.enabled = row.enabled;
      this.form.sensitiveheadersList = row.sensitiveheadersList;
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
    },
    create(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "创建成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    cancel(formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
      this.form = {
        stripPrefix:'1',
        retryable:'1',
        enabled:'1'
      }
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          putObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: "成功",
              message: "修改成功",
              type: "success",
              duration: 2000
            });
          });
        } else {
          return false;
        }
      });
    },
    handleApply(){
      var _this = this
      this.$confirm('是否确认同步至网关路由', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return applyObj()
        })
        .then(data => {
          _this.$message({
            showClose: true,
            message: '同步成功',
            type: 'success'
          })
        })
        .catch(function(err) {})
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

