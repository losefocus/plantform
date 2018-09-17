<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container clearfix">
      <div class="pull-right">
        <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="类型" v-model="listQuery.type" size="small">
        </el-input>
        <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter" size="small">搜索</el-button>
      </div>
      <el-button v-if="sys_dict_add" class="filter-item" @click="handleCreate" type="primary" icon="edit" size="small">添加
      </el-button>
    </div>
    <el-table :key='tableKey' :data="list" v-loading="listLoading" fit highlight-current-row style="width: 100%">
      <!-- <el-table-column align="center" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span>{{ scope.row.type }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column> -->
      <el-table-column align="center" label="数据值">
        <template slot-scope="scope">
          <span>{{ scope.row.value }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="标签名">
        <template slot-scope="scope">
          <span>{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="排序">
        <template slot-scope="scope">
          <span>{{ scope.row.sort }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="备注信息">
        <template slot-scope="scope">
          <span>{{ scope.row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button v-if="sys_dict_upd" size="mini" type="" @click="handleUpdate(scope.row)">编辑
          </el-button>
          <el-button v-if="sys_dict_del" size="mini" type="" @click="handleDelete(scope.row)" style="margin-left:0">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="!listLoading" class="pagination-container">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page_index" :page-sizes="[10,20,30, 50]" :page-size="listQuery.page_size" layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-form-item label="编号" prop="id" v-if="dialogStatus == 'update'">
          <el-input v-model="form.id" placeholder="编号" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="数据值" prop="value">
          <el-input v-model="form.value" placeholder="数据值"></el-input>
        </el-form-item>
        <el-form-item label="标签名" prop="label">
          <el-input v-model="form.label" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="form.type" placeholder="类型"></el-input>
        </el-form-item>
        <!-- <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述"></el-input>
        </el-form-item> -->
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="排序（升序）"></el-input>
        </el-form-item>
        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" placeholder="备注信息"></el-input>
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
import { fetchList, addObj, putObj, delObj } from "@/api/dict";
import waves from "@/directive/waves/index.js"; // 水波纹指令
import { mapGetters } from "vuex";

export default {
  name: "table_sys_dict",
  directives: {
    waves
  },
  data() {
    var validateValue = (rule, value, callback) => {
      if (value === '' || value== undefined) {
        callback(new Error('请输入数据值'));
      } else {
        callback();
      }
    };
    var validateLabel = (rule, value, callback) => {
      if (value === '' || value== undefined) {
        callback(new Error('请输入标签名'));
      } else {
        callback();
      }
    };
    var validateType = (rule, value, callback) => {
      if (value === '' || value== undefined) {
        callback(new Error('请输入类型'));
      } else {
        callback();
      }
    };
    var validateRemarks = (rule, value, callback) => {
      if (value === '' || value== undefined) {
        callback(new Error('请输入备注信息'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page_index: 1,
        page_size: 20
      },
      rules: {
        value:[{ validator: validateValue, message: '请输入数据值', trigger: 'blur',required: true, }],
        label:[{ validator: validateLabel, message: '请输入标签名', trigger: 'blur',required: true, }],
        type:[{ validator: validateType, message: '请输入类型', trigger: 'blur',required: true, }],
        remarks:[{ validator: validateRemarks, message: '请输入备注信息', trigger: 'blur',required: true,}]
      },
      form: {},
      dialogFormVisible: false,
      dialogStatus: "",
      sys_dict_add: false,
      sys_dict_upd: false,
      sys_dict_del: false,
      textMap: {
        update: "编辑",
        create: "创建"
      },
      tableKey: 0,
      lastType:'',
      rowspanIndex:0
    };
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: "有效",
        1: "无效"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    this.sys_dict_add = this.permissions["sys_dict_add"];
    this.sys_dict_upd = this.permissions["sys_dict_upd"];
    this.sys_dict_del = this.permissions["sys_dict_del"];
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        this.lastType = row.type
        if(this.rowspanIndex === rowIndex&&this.rowspanIndex!=this.list.length-1){
          for(let i=this.rowspanIndex;i<this.list.length;i++){
            if(this.list[i].type != this.lastType||i==this.list.length-1){
              if(i==this.list.length-1){
                this.rowspanIndex = i+1
              }else{
              this.rowspanIndex = i
              }
              
              break
            }
          }
          // return {
          //     rowspan: 3,//parseInt(this.rowspanIndex - rowIndex)
          //     colspan: 1
          //   };
          // return [1, 2]
        } else{
          // return {
          //     rowspan: 0,
          //     colspan: 0
          //   };
          // return [0, 0];
        }
      }
    },
    getList() {
      this.listLoading = true;
      this.listQuery.sort_by = "create_time";
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
      delObj(row).then(response => {
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
      this.form.type = row.type;
      this.form.value = row.value;
      this.form.label = row.label;
      this.form.description = row.description;
      this.form.sort = row.sort;
      this.form.remarks = row.remarks;
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
    },
    update(formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
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
    }
  }
};
</script>
