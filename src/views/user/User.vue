<template>
  <div class="page-content user">
    <div class="content">
      <div class="left-wrap">
        <div class="user-wrap box-style">
          <img class="bg" src="@imgs/user/bg.png" />
          <img class="avatar" :src="userInfo.avatar" @click="selectAvatar" />
          <input
            type="file"
            ref="fileInput"
            @change="uploadAvatar"
            accept="image/*"
            style="display: none"
          />
          <h2 class="name">{{ userInfo.nickName }}</h2>

          <div class="outer-info">
            <div>
              <i class="iconfont-sys">&#xe7f3;</i>
              <span>{{ userInfo.wxId }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe6eb;</i>
              <span>{{ userInfo.realName }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe72e;</i>
              <span>{{ userInfo.email }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe776;</i>
              <span>{{ userInfo.phone }}</span>
            </div>
            <div>
              <i class="iconfont-sys">&#xe608;</i>
              <span>{{ userInfo.birthday }}</span>
            </div>
          </div>

          <div class="lables">
            <h3>标签</h3>
            <div>
              <div v-for="item in lableList" :key="item">
                {{ item }}
              </div>
            </div>
          </div>
        </div>

        <!-- <el-carousel class="gallery" height="160px"
          :interval="5000"
          indicator-position="none"
        >
          <el-carousel-item class="item" v-for="item in galleryList" :key="item">
            <img :src="item"/>
          </el-carousel-item>
        </el-carousel> -->
      </div>
      <div class="right-wrap">
        <div class="info box-style">
          <h1 class="title">基本设置</h1>

          <el-form
            :model="form"
            class="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="86px"
            label-position="top"
          >
            <el-row>
              <el-form-item label="姓名" prop="realName">
                <el-input v-model="form.realName" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="性别" prop="sex" class="right-input">
                <el-select v-model="form.sex" placeholder="Select" :disabled="!isEdit">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-row>

            <el-row>
              <el-form-item label="昵称" prop="nikeName">
                <el-input v-model="form.nikeName" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="邮箱" prop="email" class="right-input">
                <el-input v-model="form.email" :disabled="!isEdit" />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="form.mobile" :disabled="!isEdit" />
              </el-form-item>
              <el-form-item label="角色" prop="roleName" class="right-input">
                <el-input v-model="form.roleName" disabled />
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="form.birthday" type="date" :disabled="!isEdit" />
              </el-form-item>
            </el-row>

            <el-form-item label="个人介绍" prop="des" :style="{ height: '130px' }">
              <el-input type="textarea" :rows="4" v-model="form.des" :disabled="!isEdit" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" @click="saveUserInfo">
                {{ isEdit ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>

        <div class="info box-style" style="margin-top: 20px">
          <h1 class="title">更改密码</h1>

          <el-form :model="pwdForm" class="form" label-width="86px" label-position="top">
            <el-form-item label="当前密码" prop="currentPassword">
              <el-input v-model="pwdForm.currentPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="新密码" prop="newPassword">
              <el-input v-model="pwdForm.newPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmPassword">
              <el-input v-model="pwdForm.confirmPassword" type="password" :disabled="!isEditPwd" />
            </el-form-item>

            <div class="el-form-item-right">
              <el-button type="primary" style="width: 90px" @click="updatePassword">
                {{ isEditPwd ? '保存' : '编辑' }}
              </el-button>
            </div>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, computed } from 'vue'
  import { useUserStore } from '@/store/modules/user'
  import { UserService } from '@/api/usersApi'
  import { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  const userStore = useUserStore()
  const userInfo = ref({
    userId: -1,
    avatar: '',
    wxId: '',
    nickName: '',
    gender: 0,
    email: '',
    phone: '',
    birthday: '',
    roleName: '',
    realName: '',
    message: '',
    address: '',
    status: -1
  }) // 初始化用户信息

  const isEdit = ref(false)
  const isEditPwd = ref(false)
  const date = ref('')
  const fileInput = ref<HTMLInputElement | null>(null)
  const form = reactive({
    wxId: '',
    realName: '',
    nikeName: '',
    email: '',
    mobile: '',
    address: '',
    sex: 2,
    des: '',
    birthday: '',
    roleName: ''
  })

  const pwdForm = reactive({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const ruleFormRef = ref<FormInstance>()

  const rules = reactive<FormRules>({
    realName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    nikeName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 50, message: '长度在 2 到 30 个字符', trigger: 'blur' }
    ],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^[1][3-9][0-9]{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ],
    sex: [{ type: 'array', required: true, message: '请选择性别', trigger: 'blur' }]
  })

  const options = [
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

  const lableList = ref<Array<string>>([])

  const fetchUserInfo = async () => {
    const userId = userStore.getUserInfo.id // 假设用户 ID 存储在 userStore 中
    const response = await UserService.getUserInfo(userId || -1)

    if (response.success) {
      // 检查请求是否成功
      form.wxId = response.data.wxId
      userInfo.value = response.data // 获取用户数据
      // 更新表单数据
      form.realName = userInfo.value.realName
      form.nikeName = userInfo.value.nickName // 使用 nickName
      form.email = userInfo.value.email
      form.mobile = userInfo.value.phone // 使用 phone
      form.address = userInfo.value.address || '' // 如果没有地址，设置为空
      form.sex = userInfo.value.gender
      form.des = userInfo.value.message || '' // 使用 message 作为描述
      form.birthday = userInfo.value.birthday || '' // 获取生日信息
      form.roleName = userInfo.value.roleName || '' // 获取角色信息
    }
  }

  const saveUserInfo = async () => {
    if (isEdit.value) {
      isEdit.value = false // 退出编辑模式
      const response = await UserService.updateUserInfo(userInfo.value.userId, {
        wxId: form.wxId,
        nickName: form.nikeName,
        realName: form.realName,
        gender: form.sex,
        birthday: form.birthday,
        phone: form.mobile,
        message: form.des,
        email: form.email,
        status: userInfo.value.status
      }) // 调用更新用户信息的 API
      if (response.success) {
        // 处理成功逻辑，例如提示用户信息已更新
        ElMessage.success('用户信息已更新')
        userStore.getUserInfo.avatar = response.data.avatar
      } else {
        // 处理失败逻辑，例如提示错误信息
        ElMessage.error('更新失败，请重试')
      }
    } else {
      isEdit.value = true
    }
  }

  const selectAvatar = () => {
    fileInput.value?.click()
  }

  const uploadAvatar = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) {
      const response = await UserService.uploadAvatar(file) // 上传头像
      console.log('response:', response)
      if (response.success) {
        const avatarUrl = response.data[0] // 获取返回的头像 URL
        console.log('avatarUrl:', avatarUrl)
        const saveResponse = await UserService.setAvatar(userInfo.value.userId, avatarUrl) // 保存头像到后端
        if (saveResponse.success) {
          userInfo.value.avatar = avatarUrl // 更新用户头像
          ElMessage.success('头像更新成功')
        } else {
          ElMessage.error('头像更新失败，请重试')
        }
      } else {
        ElMessage.error('保存头像失败，请重试')
      }
    }
  }

  const updatePassword = async () => {
    if (isEditPwd.value) {
      isEditPwd.value = false
      const response = await UserService.updatePassword(userInfo.value.userId, {
        oldPassword: pwdForm.currentPassword,
        password: pwdForm.newPassword
      }) // 调用更新密码的 API
      if (response.success) {
        ElMessage.success('密码修改成功')
        pwdForm.currentPassword = ''
        pwdForm.newPassword = ''
        pwdForm.confirmPassword = ''
      } else {
        ElMessage.error('密码修改失败，请重试')
      }
    } else {
      isEditPwd.value = true
    }
  }

  const fetchUserLabels = async () => {
    const response = await UserService.getUserLabels(userStore.getUserInfo.id || -1)
    lableList.value = response.data.map((item: any) => item.label)
  }

  onMounted(() => {
    fetchUserInfo() // 在组件挂载时获取用户信息
    getDate()
    fetchUserLabels()
  })

  const getDate = () => {
    const d = new Date()
    const h = d.getHours()
    let text = ''

    if (h >= 6 && h < 9) {
      text = '早上好'
    } else if (h >= 9 && h < 11) {
      text = '上午好'
    } else if (h >= 11 && h < 13) {
      text = '中午好'
    } else if (h >= 13 && h < 18) {
      text = '下午好'
    } else if (h >= 18 && h < 24) {
      text = '晚上好'
    } else if (h >= 0 && h < 6) {
      text = '很晚了，早点睡'
    }

    date.value = text
  }

  const edit = () => {
    isEdit.value = !isEdit.value
  }

  const editPwd = () => {
    isEditPwd.value = !isEditPwd.value
  }
</script>

<style lang="scss">
  .user {
    .icon {
      width: 1.4em;
      height: 1.4em;
      overflow: hidden;
      vertical-align: -0.15em;
      fill: currentcolor;
    }
  }
</style>

<style lang="scss" scoped>
  .page-content {
    width: 100%;
    height: 100%;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;

    $box-radius: calc(var(--custom-radius) + 4px);

    .box-style {
      border: 1px solid var(--art-border-color);
    }

    .content {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: 10px;

      .left-wrap {
        width: 450px;
        margin-right: 25px;

        .user-wrap {
          position: relative;
          height: 600px;
          padding: 35px 40px;
          overflow: hidden;
          text-align: center;
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            object-fit: cover;
          }

          .avatar {
            position: relative;
            z-index: 10;
            width: 80px;
            height: 80px;
            margin-top: 120px;
            object-fit: cover;
            border: 2px solid #fff;
            border-radius: 50%;
          }

          .name {
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
          }

          .des {
            margin-top: 20px;
            font-size: 14px;
          }

          .outer-info {
            width: 300px;
            margin: auto;
            margin-top: 30px;
            text-align: left;

            > div {
              margin-top: 10px;

              span {
                margin-left: 8px;
                font-size: 14px;
              }
            }
          }

          .lables {
            margin-top: 40px;

            h3 {
              font-size: 15px;
              font-weight: 500;
            }

            > div {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              margin-top: 15px;

              > div {
                padding: 3px 6px;
                margin: 0 10px 10px 0;
                font-size: 12px;
                background: var(--art-main-bg-color);
                border: 1px solid var(--art-border-color);
                border-radius: 2px;
              }
            }
          }
        }

        .gallery {
          margin-top: 25px;
          border-radius: 10px;

          .item {
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
      }

      .right-wrap {
        flex: 1;
        overflow: hidden;
        border-radius: $box-radius;

        .info {
          background: var(--art-main-bg-color);
          border-radius: $box-radius;

          .title {
            padding: 15px 25px;
            font-size: 20px;
            font-weight: 400;
            color: var(--art-text-gray-800);
            border-bottom: 1px solid var(--art-border-color);
          }

          .form {
            box-sizing: border-box;
            padding: 30px 25px;

            > .el-row {
              .el-form-item {
                width: calc(50% - 10px);
              }

              .el-input,
              .el-select {
                width: 100%;
              }
            }

            .right-input {
              margin-left: 20px;
            }

            .el-form-item-right {
              display: flex;
              align-items: center;
              justify-content: end;

              .el-button {
                width: 110px !important;
              }
            }
          }
        }
      }
    }
  }

  @media only screen and (max-width: $device-ipad-vertical) {
    .page-content {
      .content {
        display: block;
        margin-top: 5px;

        .left-wrap {
          width: 100%;
        }

        .right-wrap {
          width: 100%;
          margin-top: 15px;
        }
      }
    }
  }
</style>
