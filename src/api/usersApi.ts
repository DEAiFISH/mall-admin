import request from '@/utils/http'
import { R } from '@/types/axios'
import { LoginParams } from './model/loginModel'
import { permission } from 'process'
import { BizService } from './bizApi'
export class UserService {
  // 登录
  static login(params: LoginParams) {
    return request.post<R>({
      url: 'doLogin',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      params
    })
  }

  // 获取用户信息
  static getUserInfo(userId: number) {
    return request.get<R>({
      url: `/user/v1/get/${userId}`
    })
  }

  // 更新用户信息
  static updateUserInfo(userId: number, userData: any) {
    return request.put<R>({
      url: `/user/v1/update`,
      params: {
        userId,
        ...userData
      }
    })
  }

  // 修改密码
  static updatePassword(userId: number, passwordData: { oldPassword: string; password: string }) {
    return request.put<R>({
      url: '/user/v1/set-password',
      params: {
        userId,
        ...passwordData
      }
    })
  }

  // 用户注册
  static register(userData: any) {
    return request.post<R>({
      url: '/user/v1/sign-up',
      params: userData
    })
  }

  // 检查用户名是否存在
  static checkUsername(username: string) {
    return request.get<R>({
      url: `/user/v1/get/exists/${username}`
    })
  }

  // 上传头像
  static uploadAvatar(file: File) {
    return BizService.upload('avatar', file)
  }

  // 保存用户头像
  static setAvatar(userId: number, avatarUrl: string) {
    return request.put<R>({
      url: `/user/v1/set/avatar?id=${userId}&avatar=${encodeURIComponent(avatarUrl)}`
    })
  }

  // 获取所有用户
  static getAllUsers(params?: any) {
    return request.get<R>({
      url: '/user/v1/get/all',
      params
    })
  }

  // 注销用户
  static deleteUser(userId: number) {
    return request.del<R>({
      url: `/user/v1/delete/${userId}`
    })
  }

  // 获取所有角色
  static getAllRoles(params: any) {
    return request.get<R>({
      url: '/role/v1/list',
      params
    })
  }

  // 删除角色
  static deleteRole(roleId: number) {
    return request.del<R>({
      url: `/role/v1/delete/${roleId}`
    })
  }

  // 创建角色
  static createRole(data: any) {
    return request.post<R>({
      url: '/role/v1/add',
      params: {
        name: data.name,
        description: data.description,
        status: data.status
      }
    })
  }

  // 更新角色
  static updateRole(data: any) {
    return request.put<R>({
      url: `/role/v1/update`,
      params: {
        name: data.name,
        description: data.description,
        status: data.status,
        roleId: data.roleId
      }
    })
  }

  // 获取所有权限
  static getAllPermissions(params: any) {
    return request.get<R>({
      url: '/permission/v1/list',
      params: {
        name: params.name
      }
    })
  }

  // 获取角色权限
  static getRolePermissions(params: any) {
    return request.get<R>({
      url: `/role-permission/v1/list`,
      params: {
        roleId: params.roleId,
        permissionId: params.permissionId
      }
    })
  }

  // 添加角色权限
  static addRolePermission(params: any) {
    return request.post<R>({
      url: '/role-permission/v1/add',
      params: {
        roleId: params.roleId,
        permissionId: params.permissionId
      }
    })
  }

  // 删除角色权限
  static deleteRolePermission(params: any) {
    return request.del<R>({
      url: '/role-permission/v1/delete',
      params: {
        roleId: params.roleId,
        permissionId: params.permissionId
      }
    })
  }

  // 创建菜单权限
  static createPermission(params: any) {
    return request.post<R>({
      url: '/permission/v1/add',
      params: {
        name: params.name,
        description: params.description
      }
    })
  }

  // 更新菜单权限
  static updatePermission(params: any) {
    return request.put<R>({
      url: '/permission/v1/update',
      params: {
        name: params.name,
        description: params.description,
        permissionId: params.permissionId
      }
    })
  }

  // 删除菜单权限
  static deletePermission(permissionId: number) {
    return request.del<R>({
      url: `/permission/v1/delete/${permissionId}`
    })
  }

  // 获取所有标签
  static getLabels(params: any) {
    return request.get<R>({
      url: '/user-label/v1/list',
      params: {
        name: params.name
      }
    })
  }

  // 创建标签
  static createLabel(params: any) {
    return request.post<R>({
      url: '/user-label/v1/add',
      params: {
        name: params.name,
        description: params.description,
        weights: params.weights
      }
    })
  }

  // 更新标签
  static updateLabel(params: any) {
    return request.put<R>({
      url: '/user-label/v1/update',
      params: {
        name: params.name,
        description: params.description,
        weights: params.weights,
        labelId: params.labelId
      }
    })
  }

  // 删除标签
  static deleteLabel(labelId: number) {
    return request.del<R>({
      url: `/user-label/v1/delete/${labelId}`
    })
  }

  // 获取用户兴趣标签
  static getUserLabels(userId: number) {
    return request.get<R>({
      url: `/user-label/v1/interest/list/${userId}`
    })
  }
}
