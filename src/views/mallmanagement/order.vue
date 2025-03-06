<template>
  <div class="page-content">
    <table-bar
      :showTop="false"
      @search="search"
      @reset="resetForm(searchFormRef)"
      @changeColumn="changeColumn"
      :columns="columns"
    >
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input-number label="用户ID" prop="userId" v-model="searchForm.userId" />
            <form-input-number label="金额" prop="moneyMax" v-model="searchForm.moneyMax" />
            <form-input-number label="金额" prop="moneyMin" v-model="searchForm.moneyMin" />
          </el-row>
        </el-form>
      </template>
    </table-bar>

    <art-table :data="tableData" stripe>
      <template #default>
        <el-table-column label="订单流水号" prop="number" v-if="columns[6].show" sortable />
        <el-table-column
          label="商品名称"
          prop="productName"
          v-if="columns[4].show"
          show-overflow-tooltip
        />
        <el-table-column label="封面图片" prop="productImage" v-if="columns[5].show">
          <template #default="scope">
            <el-image :src="scope.row.productImage" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="订单金额" prop="money" v-if="columns[7].show" sortable />
        <el-table-column
          label="支付状态"
          prop="isPay"
          :filters="isPayFilters"
          :filter-method="filterIsPay"
          filter-placement="bottom-end"
          v-if="columns[18].show"
        >
          <template #default="scope">
            <el-tag :type="getIsPayTagType(scope.row.isPay)">
              {{ formatIsPay(scope.row.isPay) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="用户昵称" prop="username" v-if="columns[4].show" />
        <el-table-column
          label="状态"
          prop="status"
          :filters="statusFilters"
          :filter-method="filterStatus"
          filter-placement="bottom-end"
          v-if="columns[10].show"
        >
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)"> {{ scope.row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150px" v-if="columns[10].show">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'more', label: '查看详情' },
                  { key: 'send', label: '订单发货', disabled: scope.row.status !== '待发货' },
                  { key: 'cancel', label: '取消订单', disabled: scope.row.status !== '待发货' }
                ]"
                @click="buttonMoreClick($event, scope.row)"
              />
            </el-row>
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'more' ? '查看详情' : '发货'"
      width="30%"
    >
      <el-scrollbar max-height="740px">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
          <!-- 发货 -->
          <el-form-item
            label="快递单号"
            placeholder="请输入快递单号"
            v-if="dialogType === 'send'"
            prop="courierNumber"
          >
            <el-input v-model="form.courierNumber" />
          </el-form-item>

          <template v-if="dialogType === 'more'">
            <!-- 查看详情 -->
            <el-form-item label="订单ID" prop="orderId" v-if="false">
              <template #default>
                {{ form.orderId }}
              </template>
            </el-form-item>
            <el-form-item label="订单流水号" prop="number">
              <template #default>
                {{ form.number }}
              </template>
            </el-form-item>
            <el-form-item label="商品编号" prop="productId">
              <template #default>
                {{ form.productId }}
              </template>
            </el-form-item>
            <el-form-item label="商品名称" prop="productName">
              <template #default>
                {{ form.productName }}
              </template>
            </el-form-item>
            <el-form-item label="商品数量" prop="amount">
              <template #default>
                {{ form.amount }}
              </template>
            </el-form-item>
            <el-form-item label="订单金额" prop="money">
              <template #default>
                {{ form.money }}
              </template>
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod" v-if="form.isPay">
              <template #default>
                {{ formatPaymentMethod(form.paymentMethod) }}
              </template>
            </el-form-item>
            <el-form-item label="备注" prop="memo">
              <template #default>
                {{ form.memo }}
              </template>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <template #default>
                {{ form.status }}
              </template>
            </el-form-item>
            <el-form-item label="用户昵称" prop="username">
              <template #default>
                {{ form.username }}
              </template>
            </el-form-item>
            <el-form-item label="收货地址" prop="address">
              <template #default>
                {{ form.address }}
              </template>
            </el-form-item>
            <el-form-item label="快递单号" prop="courierNumber" v-if="form.courierNumber">
              <template #default>
                {{ form.courierNumber }}
              </template>
            </el-form-item>
            <el-form-item label="支付时间" prop="payTime" v-if="form.isPay">
              <template #default>
                {{ formatDate(form.payTime) }}
              </template>
            </el-form-item>
            <el-form-item label="发货时间" prop="shipTime" v-if="form.status === '待收货'">
              <template #default>
                {{ formatDate(form.shipTime) }}
              </template>
            </el-form-item>
            <el-form-item label="完成时间" prop="finishTime" v-if="form.status === '成功'">
              <template #default>
                {{ formatDate(form.finishTime) }}
              </template>
            </el-form-item>
            <el-form-item label="取消时间" prop="cancelTime" v-if="form.status === '失败'">
              <template #default>
                {{ formatDate(form.cancelTime) }}
              </template>
            </el-form-item>
            <el-form-item label="是否支付" prop="isPay">
              <template #default>
                {{ formatIsPay(form.isPay) }}
              </template>
            </el-form-item>
            <el-form-item label="取消原因" prop="cancelReason" v-if="form.status === '失败'">
              <template #default>
                {{ form.cancelReason }}
              </template>
            </el-form-item>
          </template>
        </el-form>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <!-- 发货 -->
          <el-button type="primary" @click="handleSubmit(formRef)" v-if="dialogType === 'send'"
            >提交</el-button
          >
          <el-button type="info" @click="dialogVisible = false" v-else>取消</el-button>
          <!-- 查看详情 -->
          <!-- <el-button type="primary" @click="handleSubmit(formRef)">打印</el-button> -->
          <!-- <el-button @click="dialogVisible = false">取消</el-button> -->
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/Form/ButtonMore.vue'
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { MallManagementService } from '@/api/mallmanagementApi'
  import { ref } from 'vue'

  const tableData = ref([])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const formRef = ref<FormInstance>()
  const form = reactive({
    orderId: -1,
    userId: -1,
    username: '',
    productId: -1,
    productName: '',
    productImage: '',
    number: '',
    money: '',
    paymentMethod: -1,
    memo: '',
    status: '',
    addressId: -1,
    address: '',
    courierNumber: '',
    amount: -1,
    payTime: '',
    shipTime: '',
    finishTime: '',
    cancelTime: '',
    isPay: false,
    cancelReason: ''
  })

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    userId: null,
    moneyMax: null,
    moneyMin: null,
    paymentMethod: null,
    status: null,
    payTimeFrom: null,
    payTimeTo: null,
    shippingTimeFrom: null,
    shippingTimeTo: null,
    finishTimeFrom: null,
    finishTimeTo: null,
    cancelTimeFrom: null,
    cancelTimeTo: null,
    isPay: null,
    cancelReason: null
  })

  const productOptions = ref<any>([])

  /* 状态（1:待付款 2:待发货 3:待收货 4:待评价 5:成功 6:失败） */
  const statusFilters = [
    {
      value: '1',
      text: '待支付'
    },
    {
      value: '2',
      text: '待发货'
    },
    {
      value: '3',
      text: '待收货'
    },
    {
      value: '4',
      text: '待评价'
    },
    {
      value: '5',
      text: '成功'
    },
    {
      value: '6',
      text: '失败'
    }
  ]

  const statusOptions = [
    {
      value: 1,
      text: '待支付'
    },
    {
      value: 2,
      text: '待发货'
    },
    {
      value: 3,
      text: '待收货'
    },
    {
      value: 4,
      text: '待评价'
    },
    {
      value: 5,
      text: '成功'
    },
    {
      value: 6,
      text: '失败'
    }
  ]

  const isPayFilters = [
    {
      value: '0',
      text: '未支付'
    },
    {
      value: '1',
      text: '已支付'
    }
  ]

  const isPayOptions = [
    {
      value: true,
      text: '已支付'
    },
    {
      value: false,
      text: '未支付'
    }
  ]

  const paymentMethodOptions = [
    {
      value: 1,
      text: '支付宝'
    },
    {
      value: 0,
      text: '微信'
    }
  ]

  const cancelReasonOptions = [
    {
      value: 1,
      text: '超时未支付'
    },
    {
      value: 2,
      text: '用户取消'
    },
    {
      value: 3,
      text: '商家取消'
    }
  ]

  const formatPaymentMethod = (paymentMethod: number) => {
    const option = paymentMethodOptions.find((option) => option.value === paymentMethod)
    if (option) {
      return option.text
    } else {
      return null
    }
  }

  const formatIsPay = (isPay: boolean) => {
    const option = isPayOptions.find((option) => option.value === isPay)
    if (option) {
      return option.text
    } else {
      return null
    }
  }

  const columns = reactive([
    { name: '订单ID', prop: 'orderId', show: true },
    { name: '用户ID', prop: 'userId', show: true },
    { name: '用户昵称', prop: 'username', show: true },
    { name: '商品ID', prop: 'productId', show: true },
    { name: '商品名称', prop: 'name', show: true },
    { name: '商品图片', prop: 'productImage', show: true },
    { name: '订单流水号', prop: 'number', show: true },
    { name: '订单金额', prop: 'money', show: true },
    { name: '支付方式', prop: 'paymentMethod', show: true },
    { name: '备注', prop: 'memo', show: true },
    { name: '状态', prop: 'status', show: true },
    { name: '收货地址', prop: 'address', show: true },
    { name: '快递单号', prop: 'courierNumber', show: true },
    { name: '商品数量', prop: 'amount', show: true },
    { name: '支付时间', prop: 'payTime', show: true },
    { name: '发货时间', prop: 'shipTime', show: true },
    { name: '完成时间', prop: 'finishTime', show: true },
    { name: '取消时间', prop: 'cancelTime', show: true },
    { name: '是否支付', prop: 'isPay', show: true },
    { name: '取消原因', prop: 'cancelReason', show: true }
  ])

  const changeColumn = (list: any) => {
    columns.values = list
  }

  const filterIsPay = (value: string, row: any) => {
    let flag = value === '0' ? false : true
    return flag === row.isPay
  }

  const filterStatus = (value: string, row: any) => {
    let text = statusFilters.find((option) => option.value === value)?.text
    return text === row.status
  }

  const formatStatus = (status: string) => {
    const option = statusOptions.find((option) => option.text === status)
    if (option) {
      return option.value
    } else {
      return -1
    }
  }

  const getIsPayTagType = (isPay: boolean) => {
    let type: 'success' | 'warning' | 'info' | 'primary' | 'danger' = 'info' // Default type
    if (isPay) {
      type = 'success'
    } else {
      type = 'danger'
    }
    return type
  }

  const getStatusTagType = (status: string) => {
    let type: 'success' | 'warning' | 'info' | 'primary' | 'danger' = 'info' // Default type
    let statusNumber = formatStatus(status)
    switch (statusNumber) {
      case 1:
        type = 'warning'
        break
      case 2:
        type = 'primary'
        break
      case 3:
        type = 'info'
        break
      case 4:
        type = 'info'
        break
      case 5:
        type = 'success'
        break
      case 6:
        type = 'danger'
        break
    }
    return type
  }

  const handleProductChange = (value: any) => {
    form.productId = value
    form.productName = productOptions.value.find((item: any) => item.value === value)?.label
  }

  const formatDate = (date: string) => {
    return new Date(date)
      .toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      .replace(/\//g, '-')
  }

  const rules = reactive<FormRules>({
    addCourierNumber: [{ required: true, message: '请输入快递单号', trigger: 'blur' }]
  })

  const buttonMoreClick = (event: any, row: any) => {
    if (event.key === 'more') {
      showDialog('more', row)
    } else if (event.key === 'send') {
      if (event.disabled) {
        ElMessage.warning('当前状态不能发货')
        return
      }
      showDialog('send', row)
    } else if (event.key === 'cancel') {
      if (event.disabled) {
        ElMessage.warning('当前状态不能取消')
        return
      }
      cancelOrder(row)
    }
  }

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    if (dialogType.value === 'send') {
      console.log('form:发货', form)
      // 发货
      await formEl.validate(async (valid) => {
        if (valid) {
          console.log('form:发货', form)
          let response = await MallManagementService.sendOrder(form.courierNumber, form.orderId)
          if (response.success) {
            ElMessage.success('发货成功')
            fetchAllOrder()
          } else {
            ElMessage.error('发货失败')
            ElMessage.error(response.msg)
          }
          dialogVisible.value = false
          formEl.resetFields()
        }
      })
    }
  }

  const cancelOrder = async (row: any) => {
    let response = await MallManagementService.cancelOrder(row.orderId)
    if (response.success) {
      ElMessage.success('取消订单成功')
      fetchAllOrder()
    }
  }
  const search = () => {
    fetchAllOrder()
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    fetchAllOrder()
  }

  const showDialog = async (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'more' && row) {
      form.orderId = row.orderId
      form.number = row.number
      form.username = row.username
      form.productId = row.productId
      form.productName = row.productName
      form.money = row.money
      form.paymentMethod = row.paymentMethod
      form.memo = row.memo
      form.status = row.status
      form.address = row.address
      form.courierNumber = row.courierNumber
      form.amount = row.amount
      form.payTime = row.payTime
      form.shipTime = row.shipTime
      form.finishTime = row.finishTime
      form.cancelTime = row.cancelTime
      form.isPay = row.isPay
      form.cancelReason = row.cancelReason
    } else if (type === 'send') {
      // 发货
      form.orderId = row.orderId
      form.courierNumber = ''
    }
  }

  const fetchAllOrder = async () => {
    const response = await MallManagementService.fetchAllOrder(searchForm)

    tableData.value = response.data
  }
  onMounted(() => {
    fetchAllOrder()
  })
</script>

<style lang="scss" scoped>
  .page-content {
    .svg-icon {
      width: 1.8em;
      height: 1.8em;
      overflow: hidden;
      vertical-align: -8px;
      fill: currentcolor;
    }
  }
</style>
