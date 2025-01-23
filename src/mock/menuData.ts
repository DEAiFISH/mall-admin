import { MenuListType } from '@/types/menu'
import { upgradeLogList } from './upgradeLog'

export const menuData: MenuListType[] = [
  {
    id: 10,
    name: 'Product',
    path: '/product',
    meta: {
      title: '商品管理',
      title_en: 'Product manguage',
      icon: '&#xe764;'
    },
    children: [
      {
        id: 10001,
        path: '/product/product',
        meta: {
          title: '商品信息',
          title_en: 'product info',
          keepAlive: true
        }
      },
      {
        id: 10002,
        path: '/product/brand',
        meta: {
          title: '品牌信息',
          title_en: 'Account manguage',
          keepAlive: true
        }
      },
      {
        id: 10003,
        path: '/product/classify',
        meta: {
          title: '分类管理',
          title_en: 'classify manguage',
          keepAlive: true
        }
      },
      {
        id: 10004,
        path: '/product/label',
        meta: {
          title: '标签信息',
          title_en: 'label manguage',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 11,
    name: 'MallManagement',
    path: '/mallmanagement',
    meta: {
      title: '商城管理',
      title_en: 'Mall management',
      icon: '&#xe764;'
    },
    children: [
      {
        id: 11001,
        path: '/mallmanagement/carousel',
        meta: {
          title: '轮播图管理',
          title_en: 'carousel management',
          keepAlive: true
        }
      },
      {
        id: 11002,
        path: '/mallmanagement/voucher',
        meta: {
          title: '优惠券管理',
          title_en: 'voucher management',
          keepAlive: true
        }
      },
      {
        id: 11003,
        path: '/mallmanagement/order',
        meta: {
          title: '订单管理',
          title_en: 'order management',
          keepAlive: true
        }
      }
    ]
  },
  {
    id: 2,
    name: 'User',
    path: '/user',
    meta: {
      title: '用户管理',
      title_en: 'User manguage',
      icon: '&#xe86e;'
    },
    children: [
      {
        id: 301,
        path: '/user/user',
        meta: {
          title: '个人中心',
          title_en: 'User center',
          isHide: true,
          keepAlive: true,
          isHideTab: true
        }
      },
      {
        id: 302,
        path: '/user/account',
        meta: {
          title: '账号管理',
          title_en: 'Account manguage',
          keepAlive: true
        }
      },
      {
        id: 304,
        path: '/user/role',
        meta: {
          title: '角色权限',
          title_en: 'Roles',
          keepAlive: true
        }
      },
      {
        id: 303,
        path: '/user/UserPermission',
        meta: {
          title: '菜单权限',
          title_en: 'UserPermission manguage',
          keepAlive: true
        }
      }
    ]
  }
]
