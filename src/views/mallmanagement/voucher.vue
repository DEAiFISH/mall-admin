<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="名称" prop="name">
          <el-input v-model="searchProductName" placeholder="名称"></el-input>
        </el-form-item>
      </el-col>
      <div style="width: 12px"></div>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button @click="search()">搜索</el-button>
        <el-button @click="showDialog('add')">新增优惠卷</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe showHeaderBackground>
      <template #default>
        <el-table-column label="优惠卷ID" prop="voucherId" width="200px" />
        <el-table-column label="名称" prop="name" width="200px" />
        <el-table-column label="描述" prop="description" show-overflow-tooltip />
        <el-table-column label="价格" prop="price" width="200px" />
        <el-table-column label="数量" prop="amount" width="200px" />
        <el-table-column
          label="状态"
          prop="status"
          :filters="statusFilters"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          width="200px"
        >
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ formatStatus(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'edit', label: '编辑优惠卷' },
                  { key: 'delete', label: '删除优惠卷' }
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
      :title="dialogType === 'add' ? '新增优惠卷' : '编辑优惠卷'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="优惠卷ID" prop="voucherId" v-if="false">
          <el-input v-model="form.voucherId" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input-number v-model="form.price" :min="0" :max="1000000" :precision="2" />
        </el-form-item>
        <el-form-item label="数量" prop="amount">
          <el-input-number v-model="form.amount" :min="0" :max="1000000" />
        </el-form-item>
        <el-form-item label="状态" prop="status" v-if="dialogType === 'edit'">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
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
  import { ProductService } from '@/api/productsApi'
  import { MallManagementService } from '@/api/mallmanagementApi'
  import { ref } from 'vue'

  const tableData = ref([])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const formRef = ref<FormInstance>()
  const form = reactive({
    voucherId: -1,
    name: '',
    description: '',
    price: 0,
    amount: 0,
    status: 1
  })

  const searchProductName = ref('')

  const fileInputIcon = ref<HTMLInputElement | null>(null)
  const fileInputPicture = ref<HTMLInputElement | null>(null)

  const productOptions = ref<any>([])

  const statusOptions = [
    {
      value: 0,
      label: '禁用'
    },
    {
      value: 1,
      label: '启用'
    }
  ]

  const statusFilters = [
    {
      value: '0',
      text: '禁用'
    },
    {
      value: '1',
      text: '启用'
    }
  ]

  const filterTag = (value: number, row: any) => {
    return row.status === statusOptions[value].value
  }

  const formatStatus = (status: string) => {
    return statusOptions.find((option) => option.value === Number(status))?.label
  }

  const getTagType = (status: number) => {
    let type: 'success' | 'warning' | 'info' | 'primary' | 'danger' = 'info' // Default type
    if (status === 1) {
      type = 'success'
    } else if (status === 0) {
      type = 'warning'
    }
    return type
  }

  const fetchProduct = async () => {
    const response = await ProductService.getProductsBrief({})
    if (response.success) {
      productOptions.value = response.data.map((item: any) => ({
        value: item.productId,
        label: item.name
      }))
    } else {
      ElMessage.error('获取商品信息失败')
    }
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
    productName: [{ required: true, message: '请选择商品', trigger: 'blur' }],
    picture: [{ required: true, message: '请上传商品图片', trigger: 'blur' }]
  })

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
      if (valid) {
        let response = null

        if (dialogType.value === 'add') {
          response = await MallManagementService.addVoucher({
            name: form.name,
            description: form.description,
            price: form.price,
            amount: form.amount,
            status: 1
          })
        } else {
          console.log('form:', form)
          response = await MallManagementService.updateVoucher({
            voucherId: form.voucherId,
            name: form.name,
            description: form.description,
            price: form.price,
            amount: form.amount,
            status: form.status
          })
        }

        if (response.success) {
          const message = dialogType.value === 'add' ? '新增优惠卷成功' : '修改优惠卷成功'
          ElMessage.success(message)
          fetchAllVoucher()
        } else {
          ElMessage.error('操作失败，请重试')
          ElMessage.error(response.data)
          ElMessage.error(response.msg)
        }
        dialogVisible.value = false
        formEl.resetFields()
      }
    })
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: any) => {
    if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      ElMessageBox.confirm('确定删除该优惠卷吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        MallManagementService.deleteVoucher(row.voucherId)
          .then(() => {
            fetchAllVoucher()
          })
          .catch(() => {
            ElMessage.error('删除失败')
          })
      })
    }
  }

  const deleteVoucher = (row: any) => {
    ElMessageBox.confirm('确定删除该优惠卷吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      MallManagementService.deleteVoucher(row.voucherId)
        .then(() => {
          fetchAllVoucher()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
  }

  const showDialog = async (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.voucherId = row.voucherId
      form.name = row.name
      form.description = row.description
      form.price = row.price
      form.amount = row.amount
      form.status = row.status
    } else {
      form.voucherId = -1
      form.name = ''
      form.description = ''
      form.price = 0
      form.amount = 0
      form.status = 1
    }
  }

  const searchForm = reactive({
    name: ''
  })

  const search = () => {
    fetchAllVoucher()
  }

  const fetchAllVoucher = async () => {
    const response = await MallManagementService.fetchAllVoucher(searchForm.name)

    tableData.value = response.data
  }
  onMounted(() => {
    fetchAllVoucher()
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
