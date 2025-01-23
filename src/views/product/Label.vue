<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input v-model="searchName" placeholder="标签名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button @click="fetchAllLabels()">搜索</el-button>
        <el-button @click="showDialog('add')">新增标签</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe showHeaderBackground>
      <template #default>
        <el-table-column label="标签ID" prop="labelId" />
        <el-table-column label="标签名称" prop="name" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="权重" prop="weights" />
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'edit', label: '编辑标签' },
                  { key: 'delete', label: '删除标签' }
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
      :title="dialogType === 'add' ? '新增标签' : '编辑标签'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标签ID" prop="labelId" v-if="false">
          <el-input v-model="form.labelId" />
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="权重" prop="description">
          <el-input-number v-model="form.weights" :min="1" :max="999" />
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
  import { UserService } from '@/api/usersApi'
  import { ref } from 'vue'

  const searchName = ref('')
  const tableData = ref([])
  const dialogVisible = ref(false)
  const dialogType = ref('add')
  const formRef = ref<FormInstance>()
  const form = reactive({
    labelId: -1,
    name: '',
    description: '',
    weights: -1
  })

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
    weights: [
      { required: true, message: '请输入权重', trigger: 'blur' },
      { min: 1, max: 999, message: '权重在 1 到 999 之间', trigger: 'blur' }
    ],
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [{ required: true, message: '请输入标签描述', trigger: 'blur' }]
  })

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
      if (valid) {
        const data = {
          name: form.name,
          description: form.description,
          weights: form.weights,
          labelId: form.labelId
        }
        let response = null
        if (dialogType.value === 'add') {
          response = await UserService.createLabel(data)
        } else {
          response = await UserService.updateLabel(data)
        }

        if (response.success) {
          const message = dialogType.value === 'add' ? '新增成功' : '修改成功'
          ElMessage.success(message)
          fetchAllLabels()
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
      deleteLabel(row)
    }
  }

  const deleteLabel = (row: any) => {
    ElMessageBox.confirm('确定删除该标签吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      UserService.deleteLabel(row.labelId)
        .then(() => {
          fetchAllLabels()
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
      form.labelId = row.labelId
      form.name = row.name
      form.description = row.description
      form.weights = row.weights
    } else {
      form.labelId = -1
      form.name = ''
      form.description = ''
      form.weights = -1
    }
  }

  const fetchAllLabels = async () => {
    const response = await UserService.getLabels({ name: searchName.value })

    tableData.value = response.data
  }
  fetchAllLabels()
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
