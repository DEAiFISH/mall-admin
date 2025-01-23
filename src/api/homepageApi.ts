import request from '@/utils/http'
import { R } from '@/types/axios'
import { BizService } from './bizApi'

export class HomepageService {
  // 用户注册数据
  static fetchregisterNumber() {
    return request.get<R>({ url: '/homepage/v1/user/register/number' })
  }
}
