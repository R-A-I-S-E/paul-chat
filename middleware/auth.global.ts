export default defineNuxtRouteMiddleware(async (to, from) => {
  const client = useKindeClient()
  const p = await useAsyncData(async () => {
    const { permissions } = (await client.getPermissions()) ?? {}
    return permissions
  })
  const permission = p?.data?.value?.includes('useChat') || false
  /*  if (!permission && to.path !== '/login' && from.path !== '/login')
    return navigateTo('/login')
  else if (permission && to.path === '/login')
    return navigateTo('/')
  else if (permission && to.path === '/login' && from.path === '/login')
    return navigateTo('/')
  else */
  // return navigateTo(to.path)
})
