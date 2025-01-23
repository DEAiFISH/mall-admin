<template>
  <div class="page-content">
    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :lg="8">
        <el-input v-model="searchName" placeholder="权限名称"></el-input>
      </el-col>
      <el-col :xs="24" :sm="12" :lg="8" class="el-col2">
        <el-button @click="fetchAllPermissions">搜索</el-button>
        <el-button @click="showDialog('add')">新增权限</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe>
      <template #default>
        <el-table-column prop="permissionId" label="权限ID" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="updateTime" label="更新时间" sortable />
        <el-table-column prop="createTime" label="创建时间" sortable />
        <el-table-column prop="nickName" label="创建人" />

        <el-table-column fixed="right" label="操作" width="150px">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deletePermission" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加菜单权限' : '编辑菜单权限'"
      width="30%"
      @closed="resetForm"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="60px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import type { FormInstance, FormRules } from 'element-plus'

  const dialogType = ref('add')
  const dialogVisible = ref(false)

  const searchName = ref('')

  const formData = reactive({
    permissionId: -1,
    name: '',
    description: '1'
  })

  const tableData = ref([])

  const formRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [
      { required: true, message: '请输入描述', trigger: 'blur' },
      { max: 128, message: '长度在不能超过 127 个字符', trigger: 'blur' }
    ]
  })

  const resetForm = () => {
    formData.name = ''
    formData.description = ''
  }

  const showDialog = (type: string, row?: any) => {
    dialogType.value = type
    dialogVisible.value = true

    if (type === 'edit' && row) {
      formData.name = row.name
      formData.description = row.description
      formData.permissionId = row.permissionId
    } else {
      resetForm()
    }
  }

  const deletePermission = () => {
    ElMessageBox.confirm('确定要删除该菜单权限吗？', '删除菜单权限', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      UserService.deletePermission(formData.permissionId)
    })
  }

  const submitForm = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        const params = {
          permissionId: formData.permissionId,
          name: formData.name,
          description: formData.description
        }
        let res = null
        if (dialogType.value === 'add') {
          res = await UserService.createPermission(params)
        } else {
          res = await UserService.updatePermission(params)
        }
        if (res.success) {
          ElMessage.success(dialogType.value === 'add' ? '添加成功' : '修改成功')
          fetchAllPermissions()
        } else {
          ElMessage.error(res.msg)
        }
        dialogVisible.value = false
      }
    })
  }

  // Fetch all permissions when the component is mounted
  const fetchAllPermissions = async () => {
    const response = await UserService.getAllPermissions({
      name: searchName.value
    })
    tableData.value = response.data.map((data: any) => ({
      permissionId: data.permissionId,
      name: data.name,
      description: data.description,
      updateTime: data.updateTime,
      createTime: data.createTime,
      nickName: data.nickName,
      userId: data.userId
    }))
  }

  fetchAllPermissions()
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
