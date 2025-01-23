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
            <form-input label="微信ID" prop="wxId" v-model="searchForm.wxId" />
            <form-input label="手机号" prop="phone" v-model="searchForm.phone" />
            <form-input label="邮箱" prop="email" v-model="searchForm.email" />
          </el-row>
          <el-row :gutter="20">
            <form-input label="昵称" prop="nickName" v-model="searchForm.nickName" />
          </el-row>
        </el-form>
      </template>
      <template #bottom>
        <el-button @click="showDialog('add')">添加用户</el-button>
      </template>
    </table-bar>

    <art-table :data="tableData" stripe>
      <template #default>
        <el-table-column label="用户ID" prop="userId" v-if="columns[0].show" />
        <el-table-column label="微信ID" prop="wxId" v-if="columns[1].show" />
        <el-table-column label="姓名" prop="realName" v-if="columns[2].show" />
        <el-table-column label="性别" prop="gender" v-if="columns[3].show" />
        <el-table-column label="生日" prop="birthday" v-if="columns[4].show" />
        <el-table-column label="最后登录" prop="lastLogin" v-if="columns[5].show" sortable />
        <el-table-column
          label="状态"
          prop="status"
          :filters="statusFilters"
          :filter-method="filterTag"
          filter-placement="bottom-end"
          v-if="columns[6].show"
        >
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.status)">
              {{ formatStatus(scope.row.status) }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="积分" prop="integral" v-if="columns[7].show" sortable />
        <el-table-column label="角色ID" prop="roleId" v-if="columns[8].show" />
        <el-table-column label="角色名称" prop="roleName" v-if="columns[9].show" />
        <el-table-column fixed="right" label="操作" width="150px" v-if="columns[10].show">
          <template #default="scope">
            <button-table type="edit" @click="showDialog('edit', scope.row)" />
            <button-table type="delete" @click="deleteUser(scope.row)" />
          </template>
        </el-table-column>
      </template>
    </art-table>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item v-if="dialogType === 'edit'" label="用户ID" prop="userId">
          <el-input v-model="formData.userId" disabled />
        </el-form-item>
        <el-form-item label="微信号" prop="wxId">
          <el-input
            v-model="formData.wxId"
            @blur="checkWxId(formData.wxId, dialogType)"
            :disabled="dialogType === 'edit'"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="formData.nickName" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="真实姓名" prop="realName">
          <el-input v-model="formData.realName" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'edit'" label="性别" prop="gender">
          <el-select v-model="formData.gender" placeholder="请选择性别">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="密码" prop="password">
          <el-input v-model="formData.password" type="password" />
        </el-form-item>
        <el-form-item v-if="dialogType === 'add'" label="支付密码" prop="paymentPassword">
          <el-input v-model="formData.paymentPassword" type="password" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
  import { ACCOUNT_TABLE_DATA } from '@/mock/formData'
  import { FormInstance } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import type { FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { UserService } from '@/api/usersApi'

  const { t } = useI18n()

  const dialogType = ref('add')
  const dialogVisible = ref(false)

  const formData = reactive({
    wxId: '',
    password: '',
    paymentPassword: '',
    nickName: '',
    realName: '',
    userId: null,
    gender: '',
    status: ''
  })

  const sexOptions = [
    {
      value: 0,
      label: '女'
    },
    {
      value: 1,
      label: '男'
    },
    {
      value: 2,
      label: '未知'
    }
  ]

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

  const formatGender = (gender: string) => {
    return sexOptions.find((option) => option.value === Number(gender))?.label
  }

  const formatStatus = (status: string) => {
    return statusOptions.find((option) => option.value === Number(status))?.label
  }

  const columns = reactive([
    { name: '用户ID', prop: 'userId', show: true },
    { name: '微信ID', prop: 'wxId', show: true },
    { name: '昵称', prop: 'nickName', show: true },
    { name: '性别', prop: 'gender', show: true },
    { name: '生日', prop: 'birthday', show: true },
    { name: '最后登录', prop: 'lastLogin', show: true },
    { name: '状态', prop: 'status', show: true },
    { name: '积分', prop: 'integral', show: true },
    { name: '角色ID', prop: 'roleId', show: false },
    { name: '角色名称', prop: 'roleName', show: true },
    { name: '操作', show: true }
  ])

  const searchFormRef = ref<FormInstance>()
  const searchForm = reactive({
    nickName: '',
    phone: '',
    email: '',
    wxId: ''
  })

  const resetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
    fetchAllUsers()
  }

  const tableData = ref([])

  const fetchAllUsers = async (params?: any) => {
    const response = await UserService.getAllUsers(params)
    if (response.success) {
      tableData.value = response.data.map((user: any) => ({
        userId: user.userId,
        wxId: user.wxId,
        nickName: user.nickName,
        gender: user.gender,
        birthday: user.birthday,
        lastLogin: user.lastLogin,
        status: user.status,
        integral: user.integral,
        roleId: user.roleId,
        roleName: user.roleName
      }))
    } else {
      ElMessage.error('获取用户信息失败')
    }
  }

  fetchAllUsers()

  const showDialog = (type: string, row?: any) => {
    dialogVisible.value = true
    dialogType.value = type

    if (type === 'edit' && row) {
      formData.wxId = row.wxId
      formData.nickName = row.nickName
      formData.realName = row.realName
      formData.userId = row.userId
      formData.gender = row.gender
      formData.status = row.status
    } else {
      formData.wxId = ''
      formData.nickName = ''
      formData.realName = ''
      formData.userId = null
      formData.gender = ''
      formData.status = ''
      formData.password = ''
      formData.paymentPassword = ''
    }
  }

  const deleteUser = (row: any) => {
    ElMessageBox.confirm('确定要注销该用户吗？', '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      UserService.deleteUser(row.userId)
      ElMessage.success('注销成功')
      fetchAllUsers()
    })
  }

  const search = () => {
    console.log(searchForm)
    fetchAllUsers({
      nickName: searchForm.nickName,
      phone: searchForm.phone,
      email: searchForm.email,
      wxId: searchForm.wxId
    })
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
    wxId: [{ required: true, message: t('register.placeholder[0]'), trigger: 'blur' }],
    password: [
      { required: true, message: t('register.placeholder[1]'), trigger: 'blur' },
      { min: 6, max: 13, message: t('register.placeholder[6]'), trigger: 'blur' }
    ],
    paymentPassword: [
      { required: true, message: t('register.placeholder[2]'), trigger: 'blur' },
      { min: 6, max: 6, message: t('register.placeholder[7]'), trigger: 'blur' }
    ],
    nickName: [{ required: true, message: t('register.placeholder[3]'), trigger: 'blur' }],
    realName: [{ required: true, message: t('register.placeholder[4]'), trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  })

  const formRef = ref<FormInstance>()

  // 校验微信ID是否存在
  const checkWxId = async (wxId: string, type?: string) => {
    if (!wxId || type === 'edit') return false
    const response = await UserService.checkUsername(wxId)
    return response.data
  }

  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate(async (valid) => {
      if (valid) {
        if (dialogType.value === 'add') {
          const wxIdExists = await checkWxId(formData.wxId)
          if (wxIdExists) {
            ElMessage.error('微信ID已存在，请使用其他微信ID')
            return // 终止提交
          }
          const response = await UserService.register({
            wxId: formData.wxId,
            nickName: formData.nickName,
            realName: formData.realName,
            password: formData.password,
            paymentPassword: formData.paymentPassword
          })
          if (response.success) {
            ElMessage.success('用户添加成功')
            dialogVisible.value = false
            fetchAllUsers()
          } else {
            ElMessage.error('添加用户失败，请重试')
          }
        } else if (dialogType.value === 'edit') {
          const response = await UserService.updateUserInfo(formData.userId || -1, {
            wxId: formData.wxId,
            nickName: formData.nickName,
            realName: formData.realName,
            gender: formData.gender,
            status: formData.status
          })
          if (response.success) {
            ElMessage.success('用户信息更新成功')
            dialogVisible.value = false
            fetchAllUsers()
          } else {
            ElMessage.error('更新用户信息失败，请重试')
          }
        }
      }
    })
  }
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
