<template>
  <div class="region new-user art-custom-card">
    <div class="card-header">
      <div class="title">
        <h4 class="custom-text box-title">新用户</h4>
        <p class="custom-text subtitle">这个月增长<span>+20%</span></p>
      </div>
      <el-radio-group   >
        <el-radio-button value="本月" label="本月" @change="getTableData('本月')"></el-radio-button>
        <el-radio-button value="上月" label="上月" @change="getTableData('上月')"></el-radio-button>
        <el-radio-button value="今年" label="今年" @change="getTableData('今年')"></el-radio-button>
      </el-radio-group>
    </div>
    <art-table :data="tableData" :pagination="false">
      <template #default>
        <el-table-column label="昵称" prop="nickName" width="150px">
          <template #default="scope">
            <div style="display: flex; align-items: center">
              <span class="user-name">{{ scope.row.nickName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="roleName" />
        <el-table-column label="性别" prop="avatar">
          <template #default="scope">
            <div style="display: flex; align-items: gender">
              <span style="margin-left: 10px">{{ scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '未知' }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="loginTime" width="240">
          <template #default="scope">
            <span>{{ scope.row.lastLogin }}</span>
          </template>
        </el-table-column>
      </template>
    </art-table>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue-demi'
  import { HomepageService } from '@/api/homepageApi'
  const createTimeFrom = ref('')
  const createTimeTo = ref('')

  const tableData = ref([])

  onMounted(() => {
    getTableData('本月')
  })

  const getTableData = async (radio: string) => {
    if (radio === '本月') {
      const now = new Date();
      createTimeFrom.value = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
      createTimeTo.value = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];
    } else if (radio === '上月') {
      const now = new Date();
      createTimeFrom.value = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0];
      createTimeTo.value = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0];
    } else if (radio === '今年') {
      const now = new Date();
      createTimeFrom.value = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];
      createTimeTo.value = new Date(now.getFullYear(), 11, 31).toISOString().split('T')[0];
    }
    let response = await HomepageService.getTableData(createTimeFrom.value, createTimeTo.value)
    if (response.success) {
      tableData.value = response.data
    }
  }
</script>

<style lang="scss">
  .region {
    // 进度动画
    .el-progress-bar__inner {
      transition: all 1s !important;
    }

    .el-radio-button__original-radio:checked + .el-radio-button__inner {
      color: var(--el-color-primary) !important;
      background: transparent !important;
    }

    .any-table {
      .el-table {
        thead {
          tr {
            height: 55px !important;
          }
        }

        tr {
          height: 55px !important;
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .region {
    width: 50%;

    .any-table {
      box-shadow: none;
    }

    .card-header {
      padding-left: 25px !important;
    }

    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 6px;
    }

    .user-name {
      margin-left: 10px;
    }
  }

  @media screen and (max-width: $device-notebook) {
    .region {
      width: 46%;
    }
  }
</style>
