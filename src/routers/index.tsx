/*
 * @Author: nicky
 * @Date: 2023-02-01 17:43:03
 * @LastEditors: nicky
 * @LastEditTime: 2023-02-18 18:42:32
 * @FilePath: /vite-project/src/routers/index.tsx
 * @Description:
 *
 * Copyright (c) 2023 by 穿越, All Rights Reserved.
 */
import { lazy } from 'react';
import { RouteObject } from '@/routers/interface';
import { Navigate, useRoutes } from 'react-router-dom';
import lazyLoad from '@/components/lazyLoad/';
import { generateTree } from '@/utils/';

// 导入所有router
const metaRouters: Record<string, any> = import.meta.glob('./modules/*.tsx', { eager: true });
console.log('metaRouters', metaRouters);
// * 处理路由
export const routerArray: RouteObject[] = [];
Object.keys(metaRouters).forEach((item: any) => {
  Object.keys(metaRouters[item]).forEach((key: any) => {
    routerArray.push(...metaRouters[item][key]);
  });
});
routerArray.sort((a: any, b: any) => a.meta.sort - b.meta.sort);
console.log('routerArray', routerArray);

// * 递归routerArray，生成树形结构
export const treePermissions = generateTree(routerArray);

export const rootRouter: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" />
  },
  {
    path: '/login',
    element: lazyLoad(lazy(() => import('@/views/login'))),
    meta: {
      requiresAuth: false,
      title: '登录页',
      key: 'login'
    }
  },
  ...routerArray,
  {
    path: '/404',
    element: lazyLoad(lazy(() => import('@/views/notFound')))
  },
  {
    path: '*',
    element: <Navigate to="/404" />
  }
];

const Router = () => {
  const routes = useRoutes(rootRouter as any);
  return routes;
};

export default Router;
