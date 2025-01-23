<template>
  <div class="login register">
    <div class="left-wrap">
      <left-view></left-view>
    </div>
    <div class="right-wrap">
      <div class="header">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#iconsys-zhaopian-copy"></use>
        </svg>
        <h1>{{ systemName }}</h1>
      </div>
      <div class="login-wrap">
        <div class="form">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>
          <div class="form-container">
            <el-form ref="formRef" :model="formData" :rules="rules" label-position="top">
              <el-form-item prop="wxId">
                <el-input
                  v-model.trim="formData.wxId"
                  :placeholder="$t('register.placeholder[0]')"
                  size="large"
                  @blur="checkWxId"
                />
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  v-model.trim="formData.password"
                  :placeholder="$t('register.placeholder[1]')"
                  size="large"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>

              <el-form-item prop="paymentPassword">
                <el-input
                  v-model.trim="formData.paymentPassword"
                  :placeholder="$t('register.placeholder[2]')"
                  size="large"
                  type="password"
                  autocomplete="off"
                />
              </el-form-item>

              <el-form-item prop="nickName">
                <el-input
                  v-model.trim="formData.nickName"
                  :placeholder="$t('register.placeholder[3]')"
                  size="large"
                />
              </el-form-item>

              <el-form-item prop="realName">
                <el-input
                  v-model.trim="formData.realName"
                  :placeholder="$t('register.placeholder[4]')"
                  size="large"
                />
              </el-form-item>

              <el-form-item prop="agreement">
                <el-checkbox v-model="formData.agreement">
                  {{ $t('register.agreeText') }}
                  <router-link
                    class="custom-text"
                    style="color: var(--main-color); text-decoration: none"
                    to="/privacy-policy"
                    >{{ $t('register.privacyPolicy') }}</router-link
                  >
                </el-checkbox>
              </el-form-item>

              <div style="margin-top: 15px">
                <el-button
                  class="register-btn"
                  size="large"
                  type="primary"
                  @click="register"
                  :loading="loading"
                >
                  {{ $t('register.submitBtnText') }}
                </el-button>
              </div>

              <div class="footer">
                <p>
                  {{ $t('register.hasAccount') }}
                  <router-link class="custom-text" to="/login">{{
                    $t('register.toLogin')
                  }}</router-link>
                </p>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import LeftView from '@/components/Pages/Login/LeftView.vue'
  import { SystemInfo } from '@/config/setting'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { ref, reactive } from 'vue'
  import { UserService } from '@/api/usersApi'

  const { t } = useI18n()

  const router = useRouter()
  const formRef = ref<FormInstance>()

  const systemName = SystemInfo.name
  const loading = ref(false)

  const formData = reactive({
    wxId: '',
    password: '',
    paymentPassword: '',
    nickName: '',
    realName: '',
    agreement: false
  })

  const rules = reactive<FormRules>({
    wxId: [
      { required: true, message: t('register.placeholder[0]'), trigger: 'blur' },
      {
        validator: (rule: any, value: string, callback: any) => {
          if (!value) {
            callback(new Error(t('register.placeholder[0]')))
          } else {
            UserService.checkUsername(value).then((response) => {
              if (response.data) {
                callback(new Error('用户名已存在，请选择其他用户名'))
              } else {
                callback()
              }
            })
          }
        },
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: t('register.placeholder[1]'), trigger: 'blur' },
      { min: 6, message: t('register.rule[3]'), trigger: 'blur' }
    ],
    paymentPassword: [
      { required: true, message: t('register.placeholder[2]'), trigger: 'blur' },
      { min: 6, max: 6, message: t('register.rule[3]'), trigger: 'blur' }
    ],
    nickName: [{ required: true, message: t('register.placeholder[3]'), trigger: 'blur' }],
    realName: [{ required: true, message: t('register.placeholder[4]'), trigger: 'blur' }],
    agreement: [
      {
        validator: (rule: any, value: boolean, callback: any) => {
          if (!value) {
            callback(new Error(t('register.placeholder[5]')))
          } else {
            callback()
          }
        },
        trigger: 'change'
      }
    ]
  })

  const checkWxId = async () => {
    if (!formData.wxId) return

    const response = await UserService.checkUsername(formData.wxId) // 调用检查用户名的 API
    if (response.data) {
      ElMessage.error('用户名已存在，请选择其他用户名')
    }
  }

  const register = async () => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      loading.value = true

      const response = await UserService.register(formData) // 调用注册 API
      loading.value = false

      if (response.success) {
        ElMessage.success('注册成功')
        toLogin()
      } else {
        ElMessage.error(response.msg || '注册失败，请重试')
      }
    } catch (error) {
      console.log('验证失败', error)
      loading.value = false
    }
  }

  const toLogin = () => {
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }
</script>

<style lang="scss" scoped>
  @use '../login/index' as login;
  @use './index' as register;
</style>
