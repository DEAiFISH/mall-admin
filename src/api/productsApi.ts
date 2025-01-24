import request from '@/utils/http'
import { R } from '@/types/axios'
import { BizService } from './bizApi'

export class ProductService {
  // 获取品牌列表
  static getBrands(params: any) {
    return request.get<R>({
      url: '/brand/v1/list',
      params: {
        name: params.name,
        number: params.number
      }
    })
  }

  // 创建品牌
  static createBrand(params: any) {
    return request.post<R>({
      url: '/brand/v1/add',
      params: {
        number: params.number,
        name: params.name,
        description: params.description,
        icon: params.icon,
        picture: params.picture
      }
    })
  }

  // 更新品牌
  static updateBrand(params: any) {
    return request.put<R>({
      url: '/brand/v1/update',
      params: {
        brandId: params.brandId,
        number: params.number,
        name: params.name,
        description: params.description,
        icon: params.icon,
        picture: params.picture
      }
    })
  }

  // 删除品牌
  static deleteBrand(brandId: number) {
    return request.del<R>({
      url: `/brand/v1/delete/${brandId}`
    })
  }

  // 上传品牌图片
  static uploadBrandPicture(file: File) {
    return BizService.upload('brand', file)
  }

  // 获取分类列表
  static getClassify(params: any) {
    return request.get<R>({
      url: '/classify/v1/list',
      params: {
        name: params.name
      }
    })
  }

  // 创建分类
  static createClassify(params: any) {
    return request.post<R>({
      url: '/classify/v1/add',
      params: {
        name: params.name,
        number: params.number,
        description: params.description,
        icon: params.icon
      }
    })
  }

  // 更新分类
  static updateClassify(params: any) {
    return request.put<R>({
      url: '/classify/v1/update',
      params: {
        classifyId: params.classifyId,
        name: params.name,
        number: params.number,
        description: params.description,
        icon: params.icon
      }
    })
  }

  // 删除分类
  static deleteClassify(classifyId: number) {
    return request.del<R>({
      url: `/classify/v1/delete/${classifyId}`
    })
  }

  // 上传分类图片
  static uploadClassifyPicture(file: File) {
    return BizService.upload('classify', file)
  }

  // 获取商品列表
  static getProductsBrief(params: any) {
    return request.get<R>({
      url: '/product/v1/list',
      params: {
        name: params.name,
        number: params.number,
        priceUp: params.priceUp,
        priceDown: params.priceDown,
        preferentialPriceUp: params.preferentialPriceUp,
        preferentialPriceDown: params.preferentialPriceDown,
        saleUp: params.saleUp,
        saleDown: params.saleDown
      }
    })
  }

  // 获取商品详细信息
  static getProductsDetail(productId: number) {
    return request.get<R>({
      url: `/product/v1/detail/${productId}`
    })
  }

  // 上传商品图片
  static uploadProductPicture(file: File) {
    if (file.size === 0) {
      return {
        success: true,
        data: []
      }
    }
    return BizService.upload('product', file)
  }

  // 上传商品详情图片
  static uploadProductDetailsPicture(files: File[]) {
    if (files.length === 0) {
      return {
        success: true,
        data: []
      }
    }
    return BizService.uploadBatch('product', files)
  }

  // 创建商品
  static createProduct(params: any) {
    return request.post<R>({
      url: '/product/v1/add',
      params: {
        productId: null,
        number: params.number,
        name: params.name,
        price: params.price,
        preferentialPrice: params.preferentialPrice,
        sale: 0,
        status: 1,
        classifyId: params.classifyId,
        classifyName: params.classifyName,
        brandId: params.brandId,
        brandName: params.brandName,
        coverPicture: params.coverPicture,
        briefDescription: params.briefDescription,
        description: params.description,
        detailsPicture: Array.from(params.detailsPicture)
      }
    })
  }

  // 更新商品
  static updateProduct(params: any) {
    return request.put<R>({
      url: '/product/v1/update',
      params: {
        productId: params.productId,
        number: params.number,
        name: params.name,
        price: params.price,
        preferentialPrice: params.preferentialPrice,
        sale: params.sale,
        status: params.status,
        classifyId: params.classifyId,
        classifyName: params.classifyName,
        brandId: params.brandId,
        brandName: params.brandName,
        coverPicture: params.coverPicture,
        briefDescription: params.briefDescription,
        description: params.description,
        detailsPicture: Array.from(params.detailsPicture)
      }
    })
  }

  // 删除商品
  static deleteProduct(productId: number) {
    return request.del<R>({
      url: `/product/v1/delete/${productId}`
    })
  }

  // 获取商品标签
  static fetchProductLabel(productId: number) {
    return request.get<R>({
      url: `/product-label/v1/list/product/${productId}`
    })
  }

  // 添加商品标签
  static addProductLabel(params: any) {
    return request.post<R>({
      url: '/product-label/v1/add',
      params: {
        productId: params.productId,
        labelId: params.labelId
      }
    })
  }

  // 删除商品标签
  static deleteProductLabel(pId: number,lId:number) {
    return request.del<R>({
      url: `/product-label/v1/delete/${pId}/${lId}`
    })
  }
}
