<template>
  <div class="page-content">
    <table-bar :showTop="false" @search="search" @reset="resetForm(searchFormRef)" @changeColumn="changeColumn"
      :columns="columns">
      <template #top>
        <el-form :model="searchForm" ref="searchFormRef" label-width="82px">
          <el-row :gutter="20">
            <form-input label="商品名称" prop="name" v-model="searchForm.name" />
            <form-input label="商品编号" prop="number" v-model="searchForm.number" />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')">添加商品</el-button>
      </template>
    </table-bar>

    <art-table :data="tableData" stripe>
      <template #default>
        <el-table-column label="商品ID" prop="productId" v-if="columns[0].show" width="80px" />
        <el-table-column label="商品编号" prop="number" v-if="columns[1].show" width="120px" />
        <el-table-column label="商品名称" prop="name" v-if="columns[2].show" width="200px" show-overflow-tooltip />
        <el-table-column label="商品价格" prop="price" v-if="columns[3].show" width="120px" sortable />
        <el-table-column label="商品优惠价" prop="preferentialPrice" v-if="columns[4].show" width="140px" sortable />
        <el-table-column label="商品库存" prop="stock" v-if="columns[5].show" width="120px" sortable />
        <el-table-column label="商品销量" prop="sale" v-if="columns[6].show" width="120px" sortable />
        <el-table-column label="状态" prop="status" :filters="statusFilters" :filter-method="filterTag"
          filter-placement="bottom-end" v-if="columns[7].show" width="100px">
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ formatStatus(scope.row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分类名称" prop="classifyName" v-if="columns[8].show" width="120px" show-overflow-tooltip />
        <el-table-column label="品牌名称" prop="brandName" v-if="columns[9].show" width="120px" show-overflow-tooltip />
        <el-table-column label="封面图片" prop="coverPicture" v-if="columns[10].show" width="200px">
          <template #default="scope">
            <el-image :src="scope.row.coverPicture" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column label="商品简介" prop="briefDescription" v-if="columns[11].show" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more :list="[
                {key: 'label', label: '商品标签'},
                { key: 'edit', label: '编辑商品' },
                { key: 'delete', label: '删除商品' }
              ]" @click="buttonMoreClick($event, scope.row)" />
            </el-row>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" width="150px" v-if="columns[10].show">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deleteProduct(scope.row)" />
          </template>
        </el-table-column> -->
      </template>
    </art-table>

    <el-dialog v-model="dialogVisible" :title="dialogType === 'add' ? '添加商品' : '编辑商品'" width="30%">
      <el-scrollbar max-height="640px">
        <el-form ref="formRef" :model="detailFormData" :rules="rules" label-width="100px">
          <el-form-item v-if="dialogType === 'edit'" label="商品ID" prop="productId" :disabled="dialogType === 'edit'">
            <el-input v-model="detailFormData.productId" disabled />
          </el-form-item>
          <el-form-item label="商品编号" prop="number">
            <el-input v-model="detailFormData.number" />
          </el-form-item>
          <el-form-item label="商品名称" prop="name">
            <el-input v-model="detailFormData.name" />
          </el-form-item>
          <el-form-item label="商品价格" prop="price">
            <el-input-number v-model="detailFormData.price" :min="0" :max="9999999999" :precision="2" />
          </el-form-item>
          <el-form-item label="商品优惠价" prop="preferentialPrice">
            <el-input-number v-model="detailFormData.preferentialPrice" :min="0" :max="9999999999" :precision="2" />
          </el-form-item>
          <el-form-item label="状态" v-if="dialogType === 'edit'">
            <el-switch v-model="detailFormData.status" :active-value="1" :inactive-value="0" />
          </el-form-item>
          <el-form-item label="分类名称" prop="classifyName">
            <el-select v-model="detailFormData.classifyName" placeholder="请选择分类" @change="handleClassifyChange">
              <el-option v-for="item in classifyOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="品牌名称" prop="brandName">
            <el-select v-model="detailFormData.brandName" placeholder="请选择品牌" @change="handleBrandChange">
              <el-option v-for="item in brandOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="商品简介" prop="briefDescription">
            <el-input v-model="detailFormData.briefDescription" />
          </el-form-item>
          <el-form-item label="商品详情" prop="description">
            <el-input v-model="detailFormData.description" />
          </el-form-item>
          <!-- <el-form-item label="封面图片" prop="coverPicture">
                        <el-input v-model="detailFormData.coverPicture" />
                    </el-form-item> -->
          <el-form-item label="封面图片" prop="coverPicture">
            <el-image v-if="detailFormData.coverPicture" :src="detailFormData.coverPicture" fit="cover"
              @click="selectPicture('coverPicture')" />
            <el-icon v-else size="40" style="padding: 5px; border: 1px solid #ccc; border-radius: 5px"
              @click="selectPicture('coverPicture')">
              <Plus />
            </el-icon>
            <!-- <input type="file" ref="fileInputCoverPicture" @change="uploadPicture($event, 'coverPicture')"
                            accept="image/*" style="display: inline-block; width: 0; height: 0; opacity: 0;" /> -->
          </el-form-item>
          <!-- <el-form-item label="商品详情图片" prop="detailsPicture">
                        <el-image v-for="item in detailFormData.detailsPicture" :src="item" />
                        <el-icon  size="40" style="border: 1px solid #ccc; border-radius: 5px; padding: 5px;"
                            @click="selectPicture('detailsPicture')">
                            <Plus />
                        </el-icon>
                        <input type="file" ref="fileInputDetailsPicture" @change="uploadPicture($event, 'detailsPicture')"
                            accept="image/*" style="display: inline-block; width: 0; height: 0; opacity: 0;" />
                    </el-form-item> -->
          <el-upload v-model:file-list="fileList" class="upload-demo"
            action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15" :on-preview="handlePreview"
            :on-remove="handleRemove" list-type="picture">
            <el-button type="primary">点击上传商品详情图片</el-button>
            <template #tip>
              <div class="el-upload__tip"> 文件大小小于500kb 文件格式：jpg/png </div>
            </template>
          </el-upload>
        </el-form>
      </el-scrollbar>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="labelDialog" title="商品标签" width="30%">
      <div :style="{ maxHeight: '500px', overflowY: 'scroll' }">
        <el-checkbox v-for="item in allLabels" :label="item.name" v-model="item.checked"
          @change="handleLabelCheck(item, $event)" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/Form/ButtonMore.vue'
  import { ACCOUNT_TABLE_DATA } from '@/mock/formData'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { ProductService } from '@/api/productsApi'
  import { UserService } from '@/api/usersApi'

  const { t } = useI18n()

  const dialogType = ref('add')
  const dialogVisible = ref(false)

  const tableData = ref<any>([])
  const labelDialog = ref(false)
  const checkProductId = ref(0)
  const allLabels = ref<any[]>([])
  const checkedKeys = ref<number[]>([])

  const briefFormData = ref<any>({
    productId: null,
    number: '',
    name: '',
    price: 0,
    preferentialPrice: 0,
    stock: 0,
    sale: 0,
    status: 0,
    classifyId: null,
    classifyName: '',
    brandId: null,
    brandName: '',
    coverPicture: '',
    briefDescription: ''
  })

  const detailFormData = ref<any>({
    productId: null,
    number: '',
    name: '',
    price: 0,
    preferentialPrice: 0,
    sale: 0,
    status: 0,
    classifyId: null,
    classifyName: '',
    brandId: null,
    brandName: '',
    coverPicture: '',
    briefDescription: '',
    description: '',
    detailsPicture: new Set()
  })

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

  const formatStatus = (status: string) => {
    return statusOptions.find((option) => option.value === Number(status))?.label
  }

  const columns = reactive([
    { name: '商品ID', prop: 'productId', show: true },
    { name: '商品编号', prop: 'number', show: true },
    { name: '商品名称', prop: 'name', show: true },
    { name: '商品价格', prop: 'price', show: true },
    { name: '商品优惠价', prop: 'preferentialPrice', show: true },
    { name: '商品库存', prop: 'stock', show: true },
    { name: '商品销量', prop: 'sales', show: true },
    { name: '状态', prop: 'status', show: true },
    { name: '分类名称', prop: 'classifyName', show: true },
    { name: '品牌名称', prop: 'brandName', show: true },
    { name: '封面图片', prop: 'coverPicture', show: true },
    { name: '商品简介', prop: 'briefDescription', show: true },
    { name: '操作', show: true }
  ])

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    name: '',
    number: '',
    priceUp: 0,
    priceDown: 0,
    preferentialPriceUp: 0,
    preferentialPriceDown: 0,
    saleUp: 0,
    saleDown: 0
  })

  const classifyOptions = ref<any>([])
  const brandOptions = ref<any>([])

  const fetchClassify = async () => {
    const response = await ProductService.getClassify({
      name: ''
    })
    if (response.success) {
      classifyOptions.value = response.data.map((item: any) => ({
        value: item.classifyId,
        label: item.name
      }))
    } else {
      ElMessage.error('获取分类信息失败')
    }
  }

  const fetchBrand = async () => {
    const response = await ProductService.getBrands({
      name: ''
    })
    if (response.success) {
      brandOptions.value = response.data.map((item: any) => ({
        value: item.brandId,
        label: item.name
      }))
    } else {
      ElMessage.error('获取品牌信息失败')
    }
  }

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    fetchAllProduct(searchForm)
  }

const buttonMoreClick = (item: ButtonMoreItem, row: any) => {
  checkProductId.value = row.productId
    if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      deleteProduct(row)
    } else if (item.key === 'label') {
      showLabelDialog(row.productId)
    }
  }

const showLabelDialog = (productId: number) => {
  checkProductId.value = productId
  labelDialog.value = true
  fetchProductLabel(productId)
}

  const fetchAllLabels = async () => {
    const response = await UserService.getLabels({ name: '' })
    allLabels.value = response.data
  }

  const fetchProductLabel = async (productId: number) => {
    const response = await ProductService.fetchProductLabel(productId)
    checkedKeys.value = response.data.map((vo: any) => vo.labelId)
    allLabels.value = allLabels.value.map((i) => {
      if (checkedKeys.value.some((item) => item === i.labelId)) {
        i.checked = true
      } else {
        i.checked = false
      }
      return i
    })
  }

  const handleLabelCheck = (item: any, checked: any) => {
    if (checked) {
      ProductService.addProductLabel({
        productId: checkProductId.value,
        labelId: item.labelId
      })
    } else {
      ProductService.deleteProductLabel(checkProductId.value, item.labelId)
    }
  }

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      fetchProductDetail(row.productId)
    } else {
      detailFormData.value = {}
      fileList.value = []
    }
  }

  const deleteProduct = (row: any) => {
    ElMessageBox.confirm('确定要删除该商品吗？', '删除商品', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ProductService.deleteProduct(row.productId)
      ElMessage.success('删除商品成功')
      fetchAllProduct(searchForm)
    })
  }

  const search = () => {
    fetchAllProduct(searchForm)
  }

  const changeColumn = (list: any) => {
    columns.values = list
  }

  const filterTag = (value: number, row: any) => {
    return row.status === statusOptions[value].value
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

  const rules = reactive<FormRules>({
    number: [{ required: true, message: '请输入商品编号', trigger: 'blur' }],
    name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
    price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
    preferentialPrice: [{ required: true, message: '请输入商品优惠价', trigger: 'blur' }],
    classifyName: [{ required: true, message: '请选择分类', trigger: 'blur' }],
    brandName: [{ required: true, message: '请选择品牌', trigger: 'blur' }],
    coverPicture: [{ required: true, message: '请上传封面图片', trigger: 'blur' }],
    detailsPicture: [{ required: true, message: '请上传商品详情图片', trigger: 'blur' }]
  })

  const formRef = ref<FormInstance>()

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        if (dialogType.value === 'add') {
          let response = await ProductService.uploadProductDetailsPicture(
            fileList.value.map((item: any) => item.raw)
          )
          if (response.success) {
            detailFormData.value.detailsPicture = response.data
          } else {
            ElMessage.error('上传商品详情图片失败')
            return
          }
          response = await ProductService.createProduct(detailFormData.value)
          if (response.success) {
            ElMessage.success('新增商品成功')
            fetchAllProduct(searchForm)
          } else {
            ElMessage.error('新增商品失败')
          }
        } else if (dialogType.value === 'edit') {
          let response = await ProductService.uploadProductDetailsPicture(
            fileList.value.filter((item: any) => item.raw !== item.url).map((item: any) => item.raw)
          )
          detailFormData.value.detailsPicture = response.data
          detailFormData.value.detailsPicture.push(
            ...fileList.value
              .filter((item: any) => item.raw === item.url)
              .map((item: any) => item.url)
          )
          response = await ProductService.updateProduct(detailFormData.value)
          if (response.success) {
            ElMessage.success('修改商品成功')
            fetchAllProduct(searchForm)
          } else {
            ElMessage.error('修改商品失败')
          }
        }
      }
    })

    fileList.value = []
    dialogVisible.value = false
    formRef.value?.resetFields()
  }

  const fileInputCoverPicture = ref<HTMLInputElement | null>(null)
  const fileInputDetailsPicture = ref<HTMLInputElement | null>(null)

  const selectPicture = (type: string) => {
    if (type === 'coverPicture') {
      fileInputCoverPicture.value = document.createElement('input')
      fileInputCoverPicture.value.type = 'file'
      fileInputCoverPicture.value.accept = 'image/*'
      fileInputCoverPicture.value.style.display = 'inline-block'
      fileInputCoverPicture.value.style.width = '0'
      fileInputCoverPicture.value.style.height = '0'
      fileInputCoverPicture.value.style.opacity = '0'
      fileInputCoverPicture.value.addEventListener('change', (event: Event) => {
        uploadPicture(event, 'coverPicture')
      })
      fileInputCoverPicture.value.click()
    } else if (type === 'detailsPicture') {
      fileInputDetailsPicture.value?.click()
    }
  }

  const fileList = ref<any[]>([])

  const handlePreview = (file: any) => {}

  const handleRemove = (file: any, fileList: any) => {
    fileList.value = fileList.value.filter((item: any) => item.url !== file.url)
  }

  const uploadPicture = async (event: any, type: string) => {
    const file = event.target.files[0]
    const response = await ProductService.uploadProductPicture(file)
    if (response.success) {
      ElMessage.success('上传图片成功')
      if (type === 'coverPicture') {
        detailFormData.value.coverPicture = response.data[0]
      }
    } else {
      ElMessage.error('上传图片失败')
    }
  }

  const formatClassifyName = (value: number) => {
    return classifyOptions.value.find((item: any) => item.value === value)?.label
  }

  const formatBrandName = (value: number) => {
    return brandOptions.value.find((item: any) => item.value === value)?.label
  }

  const handleClassifyChange = (value: any) => {
    detailFormData.value.classifyId = value
    detailFormData.value.classifyName = formatClassifyName(value)
  }

  const handleBrandChange = (value: any) => {
    detailFormData.value.brandId = value
    detailFormData.value.brandName = formatBrandName(value)
  }



  const fetchAllProduct = async (params: any) => {
    const response = await ProductService.getProductsBrief(params)
    if (response.success) {
      tableData.value = response.data
    } else {
      ElMessage.error('获取商品信息失败')
    }
  }

  const fetchProductDetail = async (productId: number) => {
    const response = await ProductService.getProductsDetail(productId)
    if (response.success) {
      detailFormData.value = response.data
      fileList.value = response.data.detailsPicture.map((item: any) => ({
        url: item,
        raw: item
      }))
    } else {
      ElMessage.error('获取商品信息失败')
    }
  }

  onMounted(() => {
    fetchAllProduct(searchForm)
    fetchClassify()
    fetchBrand()
    fetchAllLabels()
  })
</script>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;

    .user {
      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 6px;
      }

      > div {
        margin-left: 10px;

        .user-name {
          font-weight: 500;
          color: var(--art-text-gray-800);
        }
      }
    }
  }
</style>
