<template>
  <div class="worklist">
    <div class="search-div">
      <span>处理结果：</span>
      <Select v-model="type" style="width:100px" @on-change="selecChange">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
      </Select>
    </div>
    <Table border ref="selection" :columns="columns" :data="datalist" stripe class="table" @on-selection-change="selectionChange" ></Table>
    <Button @click="handleSelectAll(true)">标记已回访</Button>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" @on-change="pageSwitch" />
    </div>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
import { getWorkList, updateWork } from '@/api/worklist'
export default {
  name: "worklist",
  data () {
    return {
      pageSize:20,
      visible: false,
      imgName:'',
      total:1,
      thispage:1,
      type:'',      //处理结果
      typeList: [
        {value:'',label:'全部'},
        {value:'0',label:'未回访'},
        {value:'1',label:'已回访'},
        // {value:'2',label:'拒绝回访'}
      ],
      typeMap:{
        0:'未回访',
        1:'已回访',
        2:'拒绝回访',
      },
      selecArry:[], //选中项
      faultMap:{
        0:'男',
        1:'女',
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '姓名',
          key: 'name'
        },
        {
          title: '手机号',
          key: 'phone',
        },
        {
          title: '性别',
          key: 'sex',
          render:(h, params)=>{
            return h('span',this.faultMap[params.row.sex])
          }
        },
        {
          title: '邮箱',
          key: 'email'
        },
        {
          title: '地址',
          key: 'address'
        },
        {
          title: '留言',
          key: 'desc'
        },
        {
          title: '是否回访',
          width:100,
          align: 'center',
          key: 'result',
          render: (h, params) => {
            return h('div', this.typeMap[params.row.visit])
          }
        }
      ],
      datalist: []
    }
  },
  created () {
    this.getWorkList(1)
  },
  methods: {
    //请求loading
    loading () {
      this.$Spin.show({
        render: (h) => {
          return h('div', [
            h('Icon', {
              'class': 'demo-spin-icon-load',
              props: {
                type: 'ios-loading',
                size: 18
              }
            }),
            h('div', 'Loading')
          ])
        }
      })
    },
    //选中项发生变化
    selectionChange (selec) {
      console.log(selec)
      this.selecArry = selec
    },
    //标记处理
    handleSelectAll () {
      // this.$refs.selection.selectAll(status);
      let ids = []
      for(let i = 0,sel;sel = this.selecArry[i];i++){
        ids.push(sel.id)
      }
      updateWork({id:ids}).then(res => {
        console.log('处理结果------res',)
        this.$Message.success('操作成功!')
        this.getWorkList(this.thispage)
      }).catch(err => {
        this.$Message.error('操作失败!')
      })
    },
    //下拉改变
    selecChange () {
      this.getWorkList(1)
    },
    // 分页切换
    pageSwitch (page) {
      console.log(page)
      this.thispage = page
      this.getWorkList(page)
    },
    handleView (name) {
      this.imgName = name
      this.visible = true
    },
    //咨询列表
    getWorkList (p) {
      let data = {
        pageNum:p,
        pageSize:20,
        visit:this.type
      }
      getWorkList(data).then((res)=>{
        console.log('故障列表-----',res)
        this.datalist = res.data.data.list
        this.total = res.data.data.total
      })
    }
  }
}
</script>

<style scoped lang="less">
  .worklist{
    padding: 18px;padding-bottom: 50px;
  }
  .table{
    margin-bottom: 15px;margin-top: 15px;
  }
  .page{
    margin-top: 30px;text-align: right;
  }
</style>
