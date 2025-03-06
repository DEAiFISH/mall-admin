import request from '@/utils/http'
import { R } from '@/types/axios'
import { BizService } from './bizApi'

export class HomepageService {
  // 用户注册数据
  static fetchregisterNumber() {
    return request.get<R>({ url: '/homepage/v1/user/register/number' })
  }

  static getTableData(createTimeFrom: string, createTimeTo: string) {
    return request.get<R>({
      url: `/user/v1/get/all?createTimeFrom=${createTimeFrom}&createTimeTo=${createTimeTo}`
    })
  }

  static getChartData(year: string) {
    return request.get<R>({
      url: `/browse-history/v1/list/year/${year}`
    })
  }

  static getAllHistoryCount() {
    return request.get<R>({
      url: `/browse-history/v1/all/count`
    })
  }

  static getUserCount() {
    return request.get<R>({
      url: `/homepage/v1/user/count`
    })
  }
}
