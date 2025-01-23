import request from '@/utils/http'
import { R } from '@/types/axios'

export class BizService {
  // 上传图片
  static upload(dir: string, file: File) {
    // return request.uploadPricture([file], 'avatar', token)

    const formData = new FormData()
    formData.append('files', file)
    return request.post<R>({
      url: `/biz/v1/oss/upload?dir=${dir}`,
      transformRequest: [
        function (data, headers) {
          delete headers['Content-Type']
          return data
        }
      ],
      params: formData // 使用 FormData
      // headers: {
      //   // 不需要手动设置 Content-Type，浏览器会自动处理
      //   // 'Content-Type': 'multipart/form-data'
      // }
    })
  }

  // 批量上传图片
  static uploadBatch(dir: string, files: File[]) {
    // return request.uploadPricture([file], 'avatar', token)

    const formData = new FormData()
    files.forEach((item) => {
      formData.append('files', item)
    })
    return request.post<R>({
      url: `/biz/v1/oss/upload?dir=${dir}`,
      transformRequest: [
        function (data, headers) {
          delete headers['Content-Type']
          return data
        }
      ],
      params: formData // 使用 FormData
      // headers: {
      //   // 不需要手动设置 Content-Type，浏览器会自动处理
      //   // 'Content-Type': 'multipart/form-data'
      // }
    })
  }
}
