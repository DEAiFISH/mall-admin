import request from '@/utils/http'
import { R } from '@/types/axios'
import { BizService } from './bizApi'

export class MallManagementService {
  // 获取轮播图
  static fetchAllCarousel(productName: string) {
    return request.get<R>({ url: '/homepage-carousel/v1/list', params: { productName } })
  }

  // 新增轮播图
  static addCarousel(params: any) {
    return request.post<R>({
      url: '/homepage-carousel/v1/add',
      params: {
        productId: params.productId,
        productName: params.productName,
        picture: params.picture
      }
    })
  }

  // 编辑轮播图
  static updateCarousel(params: any) {
    return request.put<R>({
      url: '/homepage-carousel/v1/update',
      params: {
        chartId: params.chartId,
        productId: params.productId,
        productName: params.productName,
        picture: params.picture,
        status: params.status
      }
    })
  }

  // 删除轮播图
  static deleteCarousel(carouselId: number) {
    return request.del<R>({ url: `/homepage-carousel/v1/delete/${carouselId}` })
  }

  // 上传轮播图图片
  static uploadCarouselPicture(file: File) {
    console.log('file:', file)
    return BizService.upload('carousel', file)
  }

  // 获取优惠卷
  static fetchAllVoucher(name: string) {
    return request.get<R>({ url: '/voucher/v1/list', params: { name } })
  }

  // 新增优惠卷
  static addVoucher(params: any) {
    return request.post<R>({
      url: '/voucher/v1/add',
      params: {
        name: params.name,
        description: params.description,
        price: params.price,
        amount: params.amount,
        status: 1
      }
    })
  }

  // 编辑优惠卷
  static updateVoucher(params: any) {
    return request.put<R>({
      url: '/voucher/v1/update',
      params: {
        voucherId: params.voucherId,
        name: params.name,
        description: params.description,
        price: params.price,
        amount: params.amount,
        status: params.status
      }
    })
  }

  // 删除优惠卷
  static deleteVoucher(voucherId: number) {
    return request.del<R>({ url: `/voucher/v1/delete/${voucherId}` })
  }

  // 获取订单
  static fetchAllOrder(params: any) {
    return request.get<R>({
      url: '/order/v1/list',
      params: {
        userId: params.userId,
        moneyMax: params.moneyMax,
        moneyMin: params.moneyMin,
        paymentMethod: params.paymentMethod,
        status: params.status,
        payTimeFrom: params.payTimeFrom,
        payTimeTo: params.payTimeTo,
        shippingTimeFrom: params.shippingTimeFrom,
        shippingTimeTo: params.shippingTimeTo,
        finishTimeFrom: params.finishTimeFrom,
        finishTimeTo: params.finishTimeTo,
        cancelTimeFrom: params.cancelTimeFrom,
        cancelTimeTo: params.cancelTimeTo,
        isPay: params.isPay,
        cancelReason: params.cancelReason
      }
    })
  }

  // 订单发货
  static sendOrder(courierNumber: string, orderId: number) {
    return request.put<R>({
      url: `/order/v1/send/${orderId}?courierNumber=${courierNumber}`
    })
  }

  // 取消订单
  static cancelOrder(orderId: number) {
    return request.put<R>({
      url: `/order/v1/cancel/${orderId}?cancelReason=3`
    })
  }
}
