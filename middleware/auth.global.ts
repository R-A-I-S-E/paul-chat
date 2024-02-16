let allowed = false

export default defineNuxtRouteMiddleware(async (to) => {
  const client = useKindeClient()
  const { data: access } = await useAsyncData(async () => {
    return (await client?.getPermission('useChat')) ?? {}
  })
  if (!allowed)
    allowed = access?.value?.isGranted || false

  if (!allowed && to.fullPath !== '/login')
    return navigateTo('/login')
  if (allowed && to.fullPath === '/login')
    return navigateTo('/')
})
