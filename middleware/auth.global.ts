export default defineNuxtRouteMiddleware(async (to) => {
  const client = useKindeClient()
  const p = await useAsyncData(async () => {
    const { permissions } = (await client.getPermissions()) ?? {}
    return permissions
  })
  const permission = p?.data?.value?.includes('useChat') || false

  if (!permission && to.path !== '/login')
    return navigateTo('/login')
  else if (permission && to.path === '/login')
    return navigateTo('/')
})
