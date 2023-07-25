<template>
  <div class="importData">
    <div class="stepBox">
      <el-row type="flex" class="importData-title" justify="space-between">
        <el-col :span="20">元数据导入</el-col>
        <el-col class="importData-goback" :span="4" @click.native="$router.go(-1)">
          <i class="iconfont icon-arrow-right"></i> 返回
        </el-col>
      </el-row>
      <el-row style="padding-top:20px;">
        <el-col :span="24">
          <!-- <el-form label-position="right" label-width="85px">
            <el-form-item label="系统数据源">
              <el-select
                v-model="systemDataSourceObj"
                :style="{'display':'flex'}"
                placeholder="请选择系统数据源"
                :disabled="$route.params.disabled"
                @change="dataSourceChange"
              >
                <el-option
                  v-for="(obj,idx) in systemDataSource"
                  :label="obj.name"
                  :value="obj.id"
                  :key="idx"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>-->
          <el-form>
            <el-form-item label="系统数据源【注：只允许选择系统】">
              <select-tree
                v-model="systemDataSourceObj"
                :options="systemDataSource"
                :props="depSysProps"
                @on-click-node="dataSourceChange"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row class="transfer">
        <el-transfer
          class="transfer"
          filterable
          :render-content="renderTransferFunc"
          :titles="['源系统表', '目标表']"
          :filter-method="filterMethod"
          filter-placeholder="请输入搜索内容"
          v-model="allDataSource"
          :data="tempDataSourceTableData"
          style="height:calc(100% - 50px);"
        ></el-transfer>
      </el-row>
    </div>
    <el-row style="margin:10px 0;" type="flex" justify="center">
      <el-button :disabled="allDataSource.length < 1" @click="getSave">保存</el-button>
    </el-row>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import selectTree from '@/components/selectTree'
export default {
  data() {
    return {
      systemDataSourceObj: '',
      systemDataSource: [],
      tempDataSourceTableData: [],
      allDataSource: [],
      catalogId: '',
      depSysProps: {
        value: 'uniqueId', // 唯一标识
        label: 'name',     // 标签显示
        children: 'childs' // 子级
      }
    }
  },
  components: { selectTree },
  computed: {
    ...mapState('bussines', ['dataSourceTableData'])
  },
  created() {
    if (Object.keys(this.$route.params).length == 0)
      this.$router.push({ name: 'bussines' })
    //console.log(this.$route.params.childs)
    if (this.$route.params.childs) {
      this.systemDataSource = [].concat(this.$route.params.childs)
      if (this.$route.params.type == '1') {
        this.systemDataSourceObj = this.$route.params.childs.length > 0 ? this.systemDataSource[0].id : ''
      }
      else {
        this.systemDataSourceObj = this.$route.params.childs.id
      }
      //this.doTable(this.systemDataSourceObj)
    }
  },
  methods: {
    ...mapActions('bussines', [
      'getTables',
      'addBussinesSourceTable'
    ]),
    dataSourceChange(val) {
      this.systemObjs = []
      this.iptSysObjSearch = ''
      this.catalogId = val
      this.doTable(val)
    },
    filterMethod(query, item) {
      return item.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    },
    doTable(val) {
      this.getTables(val).then(re => {
        if (this.dataSourceTableData.length > 0) {
          this.tempDataSourceTableData = [].concat(this.dataSourceTableData.map(item => {
            return { name: item.name, key: item.name, title: item.catalogName, fullName: item.fullName }
          }))
        }
      })
    },
    renderTransferFunc(h, option) {
      return <span title={`表名：${option.name}`}>{option.name}</span>
    },
    getSave() {
      let tempDataSourceId = ''
      if (this.systemDataSourceObj.indexOf('_') > -1) {
        tempDataSourceId = this.systemDataSourceObj.split('_')[1]
      } else {
        tempDataSourceId = this.systemDataSourceObj
      }
      this.addBussinesSourceTable({ dataSourceId: tempDataSourceId, tableNames: this.allDataSource }).then(re => {
        this.$message({
          message: '元数据导入成功！',
          type: 'success',
          showClose: true
        })
        this.$router.go(-1)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.importData {
  &-title {
    font-size: 16px;
    border-bottom: solid 1px #ddd;
    padding: 0 0 15px 25px;
  }
  &-goback {
    text-align: right;
    padding-right: 10px;
    color: #409eff;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .transfer {
    height: calc(100% - 112px);
    /deep/ .el-transfer-panel {
      height: 100%;
      width: calc(50% - 50px);
    }
    /deep/ .el-transfer-panel__body {
      height: calc(100% - 40px);
    }
    /deep/ .el-transfer-panel__list.is-filterable {
      height: calc(100% - 32px);
    }
  }
  .stepBox {
    height: calc(100% - 32px);
  }
}
</style>