<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-form-item label="名称" prop="productName">
          <el-input v-model="searchProductName" placeholder="商品名称"></el-input>
        </el-form-item>
      </el-col>
      <div style="width: 12px"></div>
    </el-row>
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button @click="fetchAllCarousel()">搜索</el-button>
        <el-button @click="showDialog('add')">新增轮播图</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe showHeaderBackground>
      <template #default>
        <el-table-column label="轮播图ID" prop="chartId" width="200px" sortable />
        <el-table-column label="商品名称" prop="productName" />
        <el-table-column label="图片" prop="picture">
          <template #default="scope">
            <el-image :src="scope.row.picture" fit="cover" />
          </template>
        </el-table-column>
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
                  { key: 'edit', label: '编辑轮播图' },
                  { key: 'delete', label: '删除轮播图' }
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
      :title="dialogType === 'add' ? '新增品牌' : '编辑品牌'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="轮播图ID" prop="chartId" v-if="false">
          <el-input v-model="form.chartId" />
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-select
            v-model="form.productName"
            placeholder="请选择商品"
            @change="handleProductChange"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="图片" prop="picture">
          <el-image v-if="form.picture" :src="form.picture" fit="cover" @click="selectPicture" />
          <el-icon
            v-else
            size="40"
            style="padding: 5px; border: 1px solid #ccc; border-radius: 5px"
            @click="selectPicture"
          >
            <Plus />
          </el-icon>
          <!-- <input type="file" ref="fileInputPicture"  @change="uploadPicture($event, 'picture')"
                        accept="image/*" style="display: inline-block; width: 0; height: 0; opacity: 0;" /> -->
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
    chartId: -1,
    productId: -1,
    productName: '',
    picture: '',
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

  const handleProductChange = (value: any) => {
    form.productId = value
    form.productName = productOptions.value.find((item: any) => item.value === value)?.label
  }

  const selectPicture = () => {
    fileInputPicture.value = document.createElement('input')
    fileInputPicture.value.type = 'file'
    fileInputPicture.value.accept = 'image/*'
    fileInputPicture.value.style.display = 'inline-block'
    fileInputPicture.value.style.width = '0'
    fileInputPicture.value.style.height = '0'
    fileInputPicture.value.style.opacity = '0'
    fileInputPicture.value.addEventListener('change', (event: Event) => {
      uploadPicture(event, 'picture')
    })
    fileInputPicture.value.click()
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
          response = await MallManagementService.addCarousel({
            productId: form.productId,
            productName: form.productName,
            picture: form.picture
          })
        } else {
          console.log('form:', form)
          response = await MallManagementService.updateCarousel({
            chartId: form.chartId,
            productId: form.productId,
            productName: form.productName,
            picture: form.picture,
            status: form.status
          })
        }

        if (response.success) {
          const message = dialogType.value === 'add' ? '新增轮播图成功' : '修改轮播图成功'
          ElMessage.success(message)
          fetchAllCarousel()
        } else {
          ElMessage.error('操作失败，请重试')
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
      ElMessageBox.confirm('确定删除该轮播图吗？', '删除确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        MallManagementService.deleteCarousel(row.chartId)
          .then(() => {
            fetchAllCarousel()
          })
          .catch(() => {
            ElMessage.error('删除失败')
          })
      })
    }
  }

  const deleteCarousel = (row: any) => {
    ElMessageBox.confirm('确定删除该轮播图吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      MallManagementService.deleteCarousel(row.carouselId)
        .then(() => {
          fetchAllCarousel()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
  }

  // 上传轮播图图片
  const uploadPicture = async (event: Event, type: string) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const response = await MallManagementService.uploadCarouselPicture(file)
      if (response.success) {
        const pictureUrl = response.data[0]
        if (type === 'picture') {
          form.picture = pictureUrl
        }
      } else {
        ElMessage.error('保存图片失败，请重试')
      }
    }

    fileInputPicture.value = null
  }

  const showDialog = async (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.chartId = row.chartId
      form.productId = row.productId
      form.productName = row.productName
      form.picture = row.picture
      form.status = row.status
    } else {
      form.chartId = -1
      form.productId = -1
      form.productName = ''
      form.picture = ''
      form.status = 1
    }
  }

  const searchForm = reactive({
    productName: ''
  })

  const search = () => {
    fetchAllCarousel()
  }

  const fetchAllCarousel = async () => {
    const response = await MallManagementService.fetchAllCarousel(searchForm.productName)

    tableData.value = response.data
  }
  onMounted(() => {
    fetchAllCarousel()
    fetchProduct()
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
