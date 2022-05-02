import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

/**
 * @exports
 * Just a bare template for nested children.
 */
export const BareTemplate = {
  template: `<router-view />`
}

export interface RouteMeta {
  meta?: {
    title: string
    hidden?: boolean
    isPrivate?: boolean
    order?: number
  }
}

export type RouterExtension = { [key: string]: Route[] };

export type Route = RouteMeta & RouteRecordRaw & {
  children?: Route[];
  components?: any;
}

/**
 * @exports
 * Non authenticated routes.
 */
export const publicRoutes: Route[] = [
  {
    path: '/',
    name: 'landing',
    redirect: '/signin',
    meta: { title: 'Página inicial', hidden: true, }
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('components/views/sv-signin/sv-signin.vue'),
    meta: { title: 'Autenticação', hidden: true, }
  }
]

/**
 * @exports
 * Authenticated routes.
 */
export const privateRoutes: Route[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('components/templates/sv-dashboard/sv-dashboard.vue'),
    redirect: { name: 'dashboard-home' },
    meta: { title: 'Dashboard' },
    children: [
      {
        path: 'c/:module?',
        name: 'dashboard-crud',
        component: () => import('components/views/sv-dashboard/sv-crud-view/sv-crud-view.vue'),
        meta: { title: '%viewTitle%', hidden: true, }
      },
      {
        path: 'access-edit',
        name: 'dashboard-access-edit',
        component: () => import('components/views/sv-dashboard/sv-access-profile/sv-access-profile-edit.vue'),
        meta: { title: 'Editar preset de acesso', hidden: true }
      },
      {
        path: 'user-profile',
        name: 'dashboard-user-profile',
        component: () => import('components/views/sv-dashboard/sv-user/sv-profile/sv-profile.vue'),
        meta: { title: 'Meu perfil', hidden: true }
      },
      {
        path: 'user-changepass',
        name: 'dashboard-user-changepass',
        component: () => import('components/views/sv-dashboard/sv-user/sv-password-change/sv-password-change.vue'),
        meta: { title: 'Mudar senha', hidden: true }
      }
    ]
  }
]

/**
 * @function
 * Recursively labels routes.
 */
const labelRoute = (target: Route, meta: any): Route => {
  const route = Object.assign({}, target)
  Object.assign(route, meta)

  if( route.children && Array.isArray(route.children) ) {
    route.children = route.children.map((child: Route) => labelRoute(child, meta))
  }

  return route;
}

/**
 * @exports
 */
export const makeRoutes = (publicRoutes: Route[], privateRoutes: Route[]) => {
  return [
    ...publicRoutes.map((route: Route) => labelRoute(route, { isPrivate: false })),
    ...privateRoutes.map((route: Route) => labelRoute(route, { isPrivate: true })),
  ]
}

/**
 * @exports
 * All routes. You may import it for using in whatever component.
 */
export const routes = makeRoutes(publicRoutes, privateRoutes)

/**
 * @exports
 * The router instance.
 */
export const instance = (store: any) => {
  const router = createRouter({
    history: createWebHistory(),
    routes
  })

  // eslint-disable-next-line
  router.beforeEach(async (to, from, next: (props?: any) => void) => {

    /**
     * @remarks
     * Will wait for module registration if necessary.
     */
    if( !(store.state.meta?.globalDescriptions?.length > 0) ) {
      await new Promise((resolve) => {
        /**
         * @event __storeCreated
         * Will fire as soon as modules are dinamically registered.
         */
        window.removeEventListener('__storeCreated', resolve)
        window.addEventListener('__storeCreated', resolve)
      })
    }

    store.dispatch('meta/setViewTitle', to.meta.title)
    if( process.env.NODE_ENV === 'development' ) {
      return next()
    }

    if( to.meta.isPrivate && !store.getters['user/token'] ) {
      next({ name: 'signin' })
    }

    else next()
  })


  router.afterEach(() => {
    window.scrollTo(0, 0)
  })

  return router
}

export const extendRouter = (router: any, routerExtension: RouterExtension) => {
  Object.entries(routerExtension)
    .forEach(([parentName, routes]: [string, Route[]]) => {
      routes.forEach((route: Route) => router.addRoute(parentName, route))
    })
}