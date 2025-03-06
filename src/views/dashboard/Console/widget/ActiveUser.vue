<template>
  <div class="region active-user art-custom-card">
    <div class="chart" ref="chartRef"></div>
    <div class="text">
      <h3 class="custom-text box-title">用户注册量</h3>
      <p class="custom-text subtitle">比上周 <span>+23%</span></p>
    </div>
    <div class="list">
      <div v-for="(item, index) in list" :key="index">
        <p>{{ item.num }}</p>
        <p class="custom-text subtitle">{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import * as echarts from 'echarts'
  import { useECharts } from '@/utils/echarts/useECharts'
  import { useSettingStore } from '@/store/modules/setting'
  import { HomepageService } from '@/api/homepageApi'
  const chartRef = ref<HTMLDivElement | null>(null)
  const { setOptions, removeResize, resize } = useECharts(chartRef as Ref<HTMLDivElement>)
  const settingStore = useSettingStore()
  const menuOpen = computed(() => settingStore.menuOpen)
  import { getCssVariable } from '@/utils/utils'

  // 收缩菜单时，重新计算图表大小
  watch(menuOpen, () => {
    const delays = [100, 200, 300]
    delays.forEach((delay) => {
      setTimeout(resize, delay)
    })
  })

  const store = useSettingStore()
  const isDark = computed(() => store.isDark)
  const allHistoryCount = ref(0)
  const userCount = ref(0)

  const list = ref([
    { name: '总用户量', num: userCount },
    { name: '总访问量', num: allHistoryCount }
  ])

  const getAllHistoryCount = async () => {
    const res = await HomepageService.getAllHistoryCount()
    allHistoryCount.value = res.data
  }

  const getUserCount = async () => {
    const res = await HomepageService.getUserCount()
    userCount.value = res.data
  }

    // const registerNumber = ref([])
    const registerNumberData = reactive({
    x: [],
    y: []
  })

  const fetchregisterNumber = async () => {
    let response = await HomepageService.fetchregisterNumber()
    if (response.success) {
      registerNumberData.x = response.data.x
      registerNumberData.y = response.data.y
    }
  }

  const createChart = () => {
    setOptions({
      grid: {
        left: '0',
        right: '4%',
        bottom: '0%',
        top: '5px',
        containLabel: true
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          show: true,
          color: '#999',
          fontSize: 13
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
            width: 1,
            type: 'dashed'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
            width: 1
          }
        }
      },
      xAxis: {
        type: 'category',
        data: registerNumberData.x,
        boundaryGap: [0, 0.01],
        splitLine: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: isDark.value ? 'rgba(255, 255, 255, 0.1)' : '#EFF1F3',
            width: 1
          }
        },
        axisLabel: {
          show: true,
          color: '#999',
          fontSize: 13
        }
      },
      series: [
        {
          data: registerNumberData.y,
          type: 'bar',
          barMaxWidth: 36,
          itemStyle: {
            borderRadius: [6, 6, 6, 6],
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: getCssVariable('--el-color-primary-light-4')
              },
              {
                offset: 1,
                color: getCssVariable('--el-color-primary')
              }
            ])
          }
        }
      ]
    })
  }

  onMounted(() => {
    
    getUserCount();
    getAllHistoryCount();
    fetchregisterNumber().then(() => {
      createChart()
    })
    
  })

  onUnmounted(() => {
    removeResize()
  })
</script>

<style lang="scss" scoped>
  .dark {
    .region {
      .chart {
        background: none;
      }
    }
  }

  .region {
    box-sizing: border-box;
    width: 42%;
    height: 420px;
    padding: 16px;

    .chart {
      box-sizing: border-box;
      width: 100%;
      height: 220px;
      padding: 20px 0 20px 20px;
      // 跟随系统主色
      // background-image: linear-gradient(
      //   90deg,
      //   var(--el-color-primary-light-1),
      //   var(--el-color-primary-light-3),
      //   var(--el-color-primary-light-1)
      // );
      border-radius: calc(var(--custom-radius) / 2 + 4px) !important;
    }

    .text {
      margin-left: 3px;

      h3 {
        margin-top: 20px;
        font-size: 18px;
        font-weight: 500;
      }

      p {
        margin-top: 5px;
        font-size: 14px;

        span {
          color: rgb(82 196 26) !important;
        }

        &:last-of-type {
          height: 42px;
          margin-top: 5px;
        }
      }
    }

    .list {
      display: flex;
      justify-content: space-between;
      margin-left: 3px;

      > div {
        flex: 1;

        p {
          font-weight: 400;

          &:first-of-type {
            font-size: 24px;
            color: var(--art-gray-900);
          }

          &:last-of-type {
            font-size: 13px;
          }
        }
      }
    }
  }

  @media screen and (max-width: $device-phone) {
    .dark {
      .active-user {
        .chart {
          padding: 15px 0 0 !important;
        }
      }
    }
  }
</style>
