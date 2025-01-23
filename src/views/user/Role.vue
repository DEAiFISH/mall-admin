<template>
  <div class="page-content">
    <el-row>
      <el-col :xs="24" :sm="12" :lg="6">
        <el-input v-model="searchName" placeholder="角色名称"></el-input>
      </el-col>
      <div style="width: 12px"></div>
      <el-col :xs="24" :sm="12" :lg="6" class="el-col2">
        <el-button @click="fetchAllRoles()">搜索</el-button>
        <el-button @click="showDialog('add')">新增角色</el-button>
      </el-col>
    </el-row>

    <art-table :data="tableData" stripe>
      <template #default>
        <el-table-column label="角色ID" prop="roleId" />
        <el-table-column label="角色名称" prop="name" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="状态" prop="status">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'primary' : 'info'">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime" sortable>
          <template #default="scope">
            {{ formatDate(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" sortable>
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="nickName">
          <template #default="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100px">
          <template #default="scope">
            <el-row>
              <button-more
                :list="[
                  { key: 'permission', label: '菜单权限' },
                  { key: 'edit', label: '编辑角色' },
                  { key: 'delete', label: '删除角色' }
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
      :title="dialogType === 'add' ? '新增角色' : '编辑角色'"
      width="30%"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="角色ID" prop="roleId" v-if="false">
          <el-input v-model="form.roleId" />
        </el-form-item>
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.status" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit(formRef)">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model="permissionDialog" title="菜单权限" width="30%">
      <div :style="{ maxHeight: '500px', overflowY: 'scroll' }">
        <el-checkbox
          v-for="item in allPermissions"
          :label="item.name"
          v-model="item.checked"
          @change="handleCheck(item, $event)"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/Form/ButtonMore.vue'
  import { useMenuStore } from '@/store/modules/menu'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { UserService } from '@/api/usersApi'
  import { ref } from 'vue'

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const allPermissions = ref<any[]>([])
  const checkedKeys = ref<number[]>([])
  const formRef = ref<FormInstance>()
  const checkRoleId = ref(-1)

  const searchName = ref('')

  const rules = reactive<FormRules>({
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
  })

  const form = reactive({
    roleId: -1,
    name: '',
    description: '',
    status: true
  })

  const tableData = ref([])

  const dialogType = ref('add')

  const fetchAllRoles = async () => {
    const response = await UserService.getAllRoles({ name: searchName.value })
    tableData.value = response.data
  }

  const fetchAllPermissions = async () => {
    const response = await UserService.getAllPermissions({ name: searchName.value })
    allPermissions.value = response.data
  }

  const showDialog = async (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      form.roleId = row.roleId
      form.name = row.name
      form.description = row.description
      form.status = row.status === 1
    } else {
      form.roleId = -1
      form.name = ''
      form.description = ''
      form.status = true
    }
  }

  const fetchRolePermissions = async (roleId: number) => {
    console.log('checkedKeys', checkedKeys.value)
    const response = await UserService.getRolePermissions({ roleId })
    checkedKeys.value = response.data.map((vo: any) => vo.permissionId)
    allPermissions.value = allPermissions.value.map((i) => {
      if (checkedKeys.value.some((item) => item === i.permissionId)) {
        i.checked = true
      } else {
        i.checked = false
      }
      return i
    })
  }

  const handleCheck = (checkedKeys: any, event: any) => {
    if (event) {
      // 添加
      UserService.addRolePermission({
        roleId: checkRoleId.value,
        permissionId: checkedKeys.permissionId
      })
    } else {
      // 删除
      UserService.deleteRolePermission({
        roleId: checkRoleId.value,
        permissionId: checkedKeys.permissionId
      })
    }
  }

  const buttonMoreClick = (item: ButtonMoreItem, row: any) => {
    if (item.key === 'permission') {
      showPermissionDialog(row.roleId)
    } else if (item.key === 'edit') {
      showDialog('edit', row)
    } else if (item.key === 'delete') {
      deleteRole(row)
    }
  }

  const showPermissionDialog = (roleId: number) => {
    checkRoleId.value = roleId
    permissionDialog.value = true
    fetchRolePermissions(roleId)
  }

  const defaultProps = {
    children: 'children',
    label: (data: any) => data.name
  }

  const deleteRole = (row: any) => {
    ElMessageBox.confirm('确定删除该角色吗？', '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(async () => {
      const response = await UserService.deleteRole(row.roleId)
      if (response.success) {
        ElMessage.success('删除成功')
        fetchAllRoles()
      } else {
        ElMessage.error('删除失败')
        ElMessage.error(response.msg)
      }
    })
  }

  const handleSubmit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
      if (valid) {
        const data = {
          status: form.status ? 1 : 0,
          name: form.name,
          description: form.description,
          roleId: form.roleId
        }
        let response = null
        if (dialogType.value === 'add') {
          response = await UserService.createRole(data)
        } else {
          response = await UserService.updateRole(data)
        }

        if (response.success) {
          const message = dialogType.value === 'add' ? '新增成功' : '修改成功'
          ElMessage.success(message)
          fetchAllRoles()
        } else {
          ElMessage.error('操作失败，请重试')
          ElMessage.error(response.msg)
        }
        dialogVisible.value = false
        formEl.resetFields()
      }
    })
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

  fetchAllRoles()
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
