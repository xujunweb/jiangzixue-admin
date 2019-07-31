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
      <Button size="large" icon="md-add" type="primary" @click="showEdit=true">添加产品</Button>
    </div>
    <Table border :columns="columns" :data="tableData" stripe ref="userTable"></Table>
    <div class="page">
      <Page :total="total" show-total show-elevator :page-size="pageSize" @on-change="pageSwitch" />
    </div>
    <a id="hrefToExportTable" style="postion: absolute;left: -10px;top: -10px;width: 0px;height: 0px;"></a>
    <Modal
      v-model="showEdit"
      :title="isAdd?'新增产品':'编辑产品'"
      :loading="loading"
      @on-ok="metUpdateDevice"
      @on-cancel="cancel">
      <Form ref="formInline" :model="formInline" :rules="ruleInline">
        <FormItem prop="name" class="search-item">
          <span>产品名称：</span><Input v-model.trim="formInline.name" placeholder="请输入产品名" style="width: 200px" />
        </FormItem>
        <FormItem prop="price" class="search-item">
          <span>产品价格：</span><Input v-model.trim="formInline.price" number placeholder="请输入产品价格" style="width: 200px" />
        </FormItem>
        <FormItem prop="type" class="search-item">
          <span>产品类型：</span>
          <Select v-model="formInline.type" style="width:200px">
          <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem class="search-item">
          <span>产品图片：</span>
          <div class="demo-upload-list" v-if="formInline.imgs">
            <template>
              <img :src="formInline.imgs">
              <div class="demo-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(formInline.imgs)" size="30"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove()" size="30"></Icon>
              </div>
            </template>
          </div>
          <Upload
            ref="upload"
            :show-upload-list="false"
            :default-file-list="defaultList"
            :on-success="handleSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="5048"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :before-upload="handleBeforeUpload()"
            type="drag"
            :action="uploadUrl"
            :headers="headers"
            style="display: inline-block;width:150px;">
            <div class="upload">
              <Icon type="ios-camera" size="40"></Icon>
            </div>
          </Upload>
        </FormItem>
        <FormItem prop="desc" class="search-item">
          <span>产品描述：</span><Input v-model.trim="formInline.desc" placeholder="请输入产品描述" style="width: 400px" />
        </FormItem>
      </Form>
      <!--<div class="input-item"></div>-->
    </Modal>
    <Modal title="View Image" v-model="visible">
      <img :src="imgName" v-if="visible" style="width: 100%">
    </Modal>
  </div>
</template>

<script>
  // import table2excel from '@/libs/table2excel.js'
  import { getDeviceList,updateDevice,insertDevice } from '@/api/devicelist'
  import {mapGetters} from 'vuex'
  import { uniq } from "../../libs/tools"
  import config from '../../config/index'
  export default {
    name: 'devicelist',
    components: {
    },
    data () {
      return {
        headers:{
          "ticket":app.$store.state.user.userId
        },
        defaultList: [
        ],
        imgName: '',
        visible: false,
        loading:true,
        isAdd:true,    //新增状态
        uploadUrl:config.baseUrl.pro+'file/upload', //全局配置
        total:0,
        formInline: {
          name: '',   //产品名
          price:'',  //价格
          imgs:'',   //图片
          desc:'',  //描述
          type:'',     //类型
          id:'',   //产品Id
          status:'0',
        },
        insertDevice,
        updateDevice,
        typeList:[
          {value:1,label:'非洲鼓'},
          {value:2,label:'吉他'},
          {value:3,label:'钢琴'},
        ],
        typeMap:{ 1:'非洲鼓', 2:'吉他', 3:'钢琴'},
        pageSize: 15,
        showEdit:false,
        thisPage:1,
        selectIndex:0,     //选中的索引
        ruleInline: {
          name: [{ required: true, message: '请输入产品名', trigger: 'blur' },],
          price: [{ required: true, message: '请输入产品价格', trigger: 'blur',type:'number' },],
          imgs: [{ required: true, message: '请上传产品图片', },],
          type:[{ required: true, message: '请选择产品类型', },],
        },
        columns: [
          {title: '产品名称', key: 'name'},
          {title: '产品价格', key: 'price',
              render: (h, params) => {
                return h('div', params.row.price/100)
              }
          },
          {title: '产品类型', key: 'type',
            render: (h, params) => {
              return h('div', this.typeMap[params.row.type])
            }
          },
          {title: '产品描述', key: 'desc',},
          {title: '产品图片', key: 'imgs',
            render: (h, params) => {
              return h('div', [
                h('img', {
                  attrs : {
                    src:params.row.imgs
                  },
                  style: {width: '100px',cursor:'pointer'},
                  on: {click: () => {
                      this.handleView(params.row.imgs)
                    }}
                }),
              ])
            }
          },
          {title: '操作', key: 'action', width: 200, align: 'center',
            render: (h, params) => {
                return h('div', [
                  h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '5px'},
                    on: {click: () => {
                        this.selectIndex = params.index
                        this.isAdd = false
                        this.showEdit = true
                        this.formInline = {...params.row,price:params.row.price/100 }
                    }}
                  }, '编辑信息'),
                  h('Button', {
                    props: {type: 'primary', size: 'small'},
                    style: {marginRight: '5px'},
                    on: {click: () => {
                        this.isAdd = false
                        this.$Modal.info({
                          title:'提示',
                          content:'是否确定删除此产品？',
                          loading:true,
                          onOk:()=>{
                            this.formInline = {...params.row,status:'1'}
                            this.postPro()
                          }
                        })
                      }}
                  }, '删除')
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
      //重置按钮loading
      resetLoading(){
        setTimeout(() => {
          this.loading = false
          this.$nextTick(() => {
            this.loading = true
          })
        }, 1000)
      },
      renderFormat (label) {
        return label.join(' => ')
      },
      //查看大图
      handleView (name) {
        this.imgName = name
        this.visible = true
      },
      //删除图片
      handleRemove () {
        this.$refs['upload'].fileList.splice(0, 1)
        this.formInline.imgs = ''
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
      //编辑锁信息
      metUpdateDevice(){
        this.$refs['formInline'].validate((valid) => {
          console.log('校验结果',valid)
          if (valid) {
            this.postPro()
          }else {
            this.resetLoading()
          }
        })
      },
      //操作产品请求
      postPro () {
        var data = {
          ...this.formInline,
          price:this.formInline.price*100
        }
        this[this.isAdd?'insertDevice':'updateDevice'](data).then((res)=>{
          console.log('编辑锁信息--------',res)
          if(res.data.code === 100){
            if(!this.isAdd){
              this.tableData[this.selectIndex].name = this.formInline.name
              this.tableData[this.selectIndex].price = this.formInline.price*100
              this.tableData[this.selectIndex].imgs = this.formInline.imgs
              this.tableData[this.selectIndex].desc = this.formInline.desc
              this.tableData[this.selectIndex].type = this.formInline.type
            }else {
              this.getDeviceList(1)
            }
            this.$Message.success('操作成功!')
            this.cancel()
            this.resetLoading()
          }
        }).catch(err => {
          this.resetLoading()
          if(this.formInline.status === '1'){
            //删除状态下
            this.$Modal.remove()
          }
          this.$Message.error('操作失败!')
        })
      },
      //重置formInline数据
      //关闭弹窗
      cancel(){
        this.$refs['formInline'].resetFields()
        this.showEdit = false
        this.isAdd = true
        this.formInline = {
          name: '',   //产品名
          price:'',  //价格
          imgs:'',   //图片
          desc:'',  //描述
          type:'',     //类型
          id:'',   //产品Id
          status:'0',
        }
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
      //上传之前
      handleBeforeUpload () {
        // this.handleSpinCustom()
        return (e)=>{
          const check = this.formInline.imgs.length < 1
          if (!check) {
            this.$Notice.warning({
              title: '最多只能选择1张图片.'
            })
          }
          return check
        }
      },
      //上传成功
      handleSuccess (res, file) {
        this.$Spin.hide()
        console.log('上传成功-------',res,file)
        for(let i=0,len=res.data.length;i<len;i++){
          this.formInline.imgs = res.data[i].url
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件类型错误',
          desc: '文件' + file.name + " 类型错误, 请选择 'jpg','jpeg','png'"
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
  .demo-upload-list{
    display: inline-block;
    width: 150px;
    height: 130px;
    text-align: center;
    line-height: 130px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 15px;
    position: relative;
  }
  .upload-list{
    display: inline-block;
    width: 155px;
    /*height: 130px;*/
    margin-bottom: 15px;
    margin-right: 15px;
    .demo-upload-list{
      margin-right: 0;
    }
  }
  .save{
    margin-top: 20px;
  }
  .demo-upload-list img{
    width: 150px;
    height: 130px;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
<style lang="less">
  .ivu-form-item-error-tip{
    margin-left: 60px;
  }
</style>
