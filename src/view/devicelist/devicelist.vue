<template>
  <div class="userlist">
    <div class="search-div">
      <!--<Form ref="formInline" :model="formInline" :rules="ruleInline" inline>-->
        <!--<FormItem prop="user_id" class="search-item">-->
          <!--<span>用户id：</span>-->
          <!--<Input v-model="formInline.user_id" placeholder="请输入用户id" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="lock_no" class="search-item">-->
          <!--<span>设备编号：</span>-->
          <!--<Input v-model="formInline.lock_no" placeholder="请输入设备编号" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="qr_code_no" class="search-item">-->
          <!--<span>二维码编号：</span>-->
          <!--<Input v-model="formInline.qr_code_no" placeholder="请输入二维码编号" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="device_no" class="search-item">-->
          <!--<span>柜子编号：</span>-->
          <!--<Input v-model="formInline.device_no" placeholder="请输入柜子编号" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="lock_mac" class="search-item">-->
          <!--<span>锁MAC：</span>-->
          <!--<Input v-model="formInline.lock_mac" placeholder="请输入锁MAC" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="hospital" class="search-item">-->
          <!--<span>锁所属医院：</span>-->
          <!--<Input v-model="formInline.hospital" placeholder="请输入医院" number clearable style="width: 200px" />-->
        <!--</FormItem>-->
        <!--<FormItem prop="state" class="search-item">-->
          <!--<span>锁状态：</span>-->
          <!--<Select v-model="formInline.state" style="width:200px">-->
            <!--<Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <!--<FormItem>-->
          <!--<Button type="primary" @click="handleSubmit('formInline')">搜索</Button>-->
          <!--<Button @click="handleReset('formInline')" style="margin-left: 8px">清除条件</Button>-->
        <!--</FormItem>-->
        <!--<Upload-->
          <!--ref="upload"-->
          <!--:on-success="handleSuccess"-->
          <!--:format="['xlsx','excel']"-->
          <!--:max-size="5048"-->
          <!--:on-format-error="handleFormatError"-->
          <!--:on-exceeded-size="handleMaxSize"-->
          <!--:headers="headers"-->
          <!--action="https://www.chmbkh.com/lockInfo/importLockInfoData" v-if="access[0] == '1'">-->
          <!--<Button icon="ios-cloud-upload-outline">导入设备</Button>-->
        <!--</Upload>-->
      <!--</Form>-->
      <Button size="large" icon="md-add" type="primary" @click="exportExcel">添加产品</Button>
    </div>
    <Table border :columns="columns" :data="tableData" stripe ref="userTable"></Table>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" @on-change="pageSwitch" />
    </div>
    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
    <Modal
      v-model="showEdit"
      title="编辑锁信息"
      @on-ok="updateDevice"
      @on-cancel="cancel">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="name" class="search-item">
          <span>产品名称：</span><Input v-model.trim="formInline.name" placeholder="请输入产品名" style="width: 200px" />
        </FormItem>
        <FormItem prop="price" class="search-item">
          <span>产品价格：</span><Input v-model.trim="formInline.price" placeholder="请输入产品价格" style="width: 200px" />
        </FormItem>
        <FormItem prop="type" class="search-item">
          <span>产品类型：</span><Input v-model.trim="formInline.type" placeholder="请输入科室" style="width: 200px" />
        </FormItem>
        <FormItem prop="imgs" class="search-item">
          <span>产品图片：</span><Input v-model.trim="formInline.imgs" placeholder="请输入产品描述"style="width: 200px" />
        </FormItem>
        <FormItem prop="desc" class="search-item">
          <span>产品描述：</span><Input v-model.trim="formInline.desc" placeholder="请输入产品描述" style="width: 400px" />
        </FormItem>
      </Form>
      <!--<div class="input-item"></div>-->
    </Modal>
  </div>
</template>

<script>
  // import table2excel from '@/libs/table2excel.js'
  import { getDeviceList,updateDevice,updateDevicePrice } from '@/api/devicelist'
  import {mapGetters} from 'vuex'
  import { uniq } from "../../libs/tools"
  export default {
    name: 'devicelist',
    components: {
    },
    data () {
      return {
        headers:{
          "ticket":app.$store.state.user.userId
        },
        total:0,
        inputUserId:'', //绑定的用户ID
        hospital:'',  //绑定的医院
        department:'',  //绑定的科室
        bind_user:'', //绑定的用户
        inputPrice:'',  //锁价格
        formInline: {
          name: '',   //产品名
          price:'',  //价格
          imgs:'',   //图片
          desc:'',  //描述
          type:'',     //类型
          id:'',   //产品Id
        },
        stateList:[
          {value:'',label:'全部'},
          {value:0,label:'正常'},
          {value:1,label:'维修中'},
          {value:2,label:'禁用'},
          {value:3,label:'使用中'},
        ],
        stateMap:{0:'正常', 1:'维修中', 2:'禁用', 3:'使用中'},
        pageSize: 15,
        showEdit:false,
        showEditPrice:false,
        thisPage:1,
        selectIndex:0,     //选中的索引
        ruleInline: {
          name: [{ required: true, message: '请输入产品名', trigger: 'blur' },],
          price: [{ required: true, message: '请输入产品价格', trigger: 'blur' },],
          imgs: [{ required: true, message: '请上传产品图片', },],
        },
        columns: [
          {title: '产品名称', key: 'name'},
          {title: '产品价格', key: 'price',},
          {title: '产品类型', key: 'type',},
          {title: '产品描述', key: 'desc',},
          {title: '产品图片', key: 'imgs',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs : {
                    src:params.row.imgs
                  },
                  style: {width: '200px'},
                  on: {click: () => {
                      this.selectIndex = params.index
                      this.showEdit = true
                      this.formInline = {...params.row }
                    }}
                }),
              ])
            }
          },
          // {title: '锁状态', key: 'state',
          //   render: (h, params) => {
          //     return h('div', this.stateMap[params.row.state])
          //   }
          // },
          {title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '5px'},
                    on: {click: () => {
                        this.selectIndex = params.index
                        this.showEdit = true
                        this.formInline = {...params.row }
                    }}
                  }, '编辑信息'),
                ])
            }
          }
        ],
        tableData: []
      }
    },
    computed: {
      ...mapGetters({
        'access':'getAccess'
      })
    },
    created () {
      // 组件实例化生命周期
      this.getDeviceList(1)
    },
    methods: {
      handleSpinCustom () {
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {'class': 'demo-spin-icon-load',
                props: {type: 'ios-loading', size: 18}
              }), h('div', 'Loading')
            ])
          }
        })
      },
      renderFormat (label) {
        return label.join(' => ')
      },
      // 请求设备列表
      getDeviceList (p) {
        return new Promise((resolve, reject)=>{
          let data = {
            pageNum: p||this.thisPage, pageSize: this.pageSize,
            ...this.formInline
          }
          getDeviceList(data).then(res => {
            console.log('产品列表----',res)
            const data = res.data
            this.tableData = res.data.data.list.length?res.data.data.list:[]
            this.total = res.data.data.total
            resolve(res.data)
            console.log(res)
          }).catch(err => {
            reject(err)
            console.log(err)
          })
        })
      },
      // 发起搜索
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.getDeviceList(1).then((res)=>{
              this.$Message.success('操作成功!')
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          } else {
            this.$Message.error('Fail!')
          }
        })
      },
      //编辑锁信息
      updateDevice(){
        this.$refs['formInline'].validate((valid) => {
          console.log('校验结果',valid)
          if (valid) {
            var data = {
              ...this.formInline
            }
            updateDevice(data).then((res)=>{
              console.log('编辑锁信息--------',res)
              if(res.data.code === 100){
                this.tableData[this.selectIndex] = {...this.formInline}
                this.$Message.success('操作成功!')
                this.resetForm()
              }
            }).catch(err => {
              this.$Message.error('操作失败!')
            })
          }
        })
      },
      //重置formInline数据
      resetForm () {
        this.formInline = {
          name: '',   //产品名
          price:'',  //价格
          imgs:'',   //图片
          desc:'',  //描述
          type:'',     //类型
          id:'',   //产品Id
        }
      },
      //关闭弹窗
      cancel(){
        this.showEdit = false
        this.showEditPrice = false
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      },
      changeDate (e) {
        this.formInline.date = e
      },
      remove (index) {
        this.tableData.splice(index, 1)
      },
      // 分页切换
      pageSwitch (page) {
        console.log(page)
        this.thisPage = page
        this.getDeviceList(page)
      },
      // 导出excel
      exportExcel () {
        table2excel.transform(this.$refs.userTable, 'hrefToExportTable', '文件名')
      },
      //上传之前
      handleBeforeUpload () {
        this.handleSpinCustom()
        return true
      },
      //上传成功
      handleSuccess (res, file) {
        this.$Spin.hide()
        console.log('上传成功-------',res,file)
        this.getDeviceList(1)
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件' + file.name + ' 类型错误, 请选择 xlsx 或者 excel'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件大小超出限制',
          desc: '文件  ' + file.name + ' 太大, 请上传5M以下的文件'
        })
      },
    },
    watch: {
    }
  }
</script>

<style scoped lang="less">
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  .input-item{
    margin-top: 20px;
    span{display: inline-block;width: 70px;}
  }
  .userlist{
    padding: 20px;
  }
  .page{
    text-align: right;
    margin-top: 40px;
  }
  .search-div{
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .ivu-form-item{
      margin-bottom: 0;
    }
    .search-item{
      margin-bottom: 20px;
      span{
        display: inline-block;
        width: 75px;text-align: right;
      }
    }
  }
</style>
<style lang="less">
  .ivu-form-item-error-tip{
    margin-left: 60px;
  }
</style>
