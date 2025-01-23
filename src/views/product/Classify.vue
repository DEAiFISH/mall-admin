<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input v-model="searchName" placeholder="分类名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button @click="fetchAllClassify()">搜索</el-button>
        <el-button @click="showDialog('add')">新增分类</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe showHeaderBackground>
      <template #default>
        <el-table-column label="分类ID" prop="classifyId" width="100px" />
        <el-table-column label="分类编号" prop="number" width="240px" />
        <el-table-column label="分类名称" prop="name" width="200px" />
        <el-table-column label="描述" prop="description" show-overflow-tooltip />
        <el-table-column label="图标" prop="icon" width="200px">
          <template #default="scope">
            <el-image :src="scope.row.icon" fit="cover" />
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'edit', label: '编辑分类' },
                  { key: 'delete', label: '删除分类' }
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
      :title="dialogType === 'add' ? '新增分类' : '编辑分类'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="分类ID" prop="classifyId" v-if="false">
          <el-input v-model="form.classifyId" />
        </el-form-item>
        <el-form-item label="分类编号" prop="number">
          <el-input v-model="form.number" />
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-image v-if="form.icon" :src="form.icon" fit="cover" @click="selectIcon" />
          <el-icon
            v-else
            size="40"
            style="padding: 5px; border: 1px solid #ccc; border-radius: 5px"
            @click="selectIcon"
          >
            <Plus />
          </el-icon>
          <!-- <input type="file" ref="fileInputIcon" @change="uploadPicture($event, 'icon')" accept="image/*"
                        style="display: inline-block; width: 0; height: 0; opacity: 0;" /> -->
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
  import { ref } from 'vue'

  const tableData = ref([])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const formRef = ref<FormInstance>()
  const form = reactive({
    classifyId: -1,
    name: '',
    number: '',
    description: '',
    icon: ''
  })

  const searchName = ref('')

  const fileInputIcon = ref<HTMLInputElement | null>(null)

  const selectIcon = () => {
    fileInputIcon.value = document.createElement('input')
    fileInputIcon.value.type = 'file'
    fileInputIcon.value.accept = 'image/*'
    fileInputIcon.value.style.display = 'inline-block'
    fileInputIcon.value.style.width = '0'
    fileInputIcon.value.style.height = '0'
    fileInputIcon.value.style.opacity = '0'
    fileInputIcon.value.addEventListener('change', (event: Event) => {
      uploadPicture(event, 'icon')
    })
    fileInputIcon.value.click()
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
    number: [
      { required: true, message: '请输入分类编号', trigger: 'blur' },
      { min: 2, max: 32, message: '分类编号长度在2到32个字符', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入分类名称', trigger: 'blur' },
      { min: 2, max: 32, message: '分类名称长度在2到32个字符', trigger: 'blur' }
    ],
    description: [{ max: 512, message: '分类描述最多512个字符', trigger: 'blur' }]
  })

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
      if (valid) {
        let response = null

        if (dialogType.value === 'add') {
          response = await ProductService.createClassify({
            number: form.number,
            name: form.name,
            description: form.description,
            icon: form.icon
          })
        } else {
          response = await ProductService.updateClassify({
            classifyId: form.classifyId,
            number: form.number,
            name: form.name,
            description: form.description,
            icon: form.icon
          })
        }

        if (response.success) {
          const message = dialogType.value === 'add' ? '新增成功' : '修改成功'
          ElMessage.success(message)
          fetchAllClassify()
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
      deleteBrand(row)
    }
  }

  const deleteBrand = (row: any) => {
    ElMessageBox.confirm('确定删除该分类吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      ProductService.deleteClassify(row.classifyId)
        .then(() => {
          fetchAllClassify()
        })
        .catch(() => {
          ElMessage.error('删除失败')
        })
    })
  }

  // 上传分类图片
  const uploadPicture = async (event: Event, type: string) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const response = await ProductService.uploadClassifyPicture(file)
      if (response.success) {
        const pictureUrl = response.data[0]
        if (type === 'icon') {
          form.icon = pictureUrl
        }
      } else {
        ElMessage.error('保存图片失败，请重试')
      }
    }
  }

  const showDialog = async (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.classifyId = row.classifyId
      form.number = row.number
      form.name = row.name
      form.description = row.description
      form.icon = row.icon
    } else {
      form.classifyId = -1
      form.number = ''
      form.name = ''
      form.description = ''
      form.icon = ''
    }
  }

  const searchForm = reactive({
    name: ''
  })

  const search = () => {
    fetchAllClassify()
  }

  const fetchAllClassify = async () => {
    const response = await ProductService.getClassify(searchForm)

    tableData.value = response.data
  }
  fetchAllClassify()
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
