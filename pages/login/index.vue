<script setup>
</script>

<template>
  <div v-if="!$auth.loggedIn" class="flex justify-center w-full h-full items-center">
    <NuxtLink
      to="/api/login" external class="uppercase text-gray-300 dark:text-gray-700 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-xl font-medium mr-4"
    >
      Sign in
    </NuxtLink>
    <NuxtLink to="/api/register" external class="uppercase text-gray-300 dark:text-gray-700 border-2 border-gray-300 dark:border-gray-700 py-2 px-4 rounded-3xl text-xl font-medium">
      Sign up
    </NuxtLink>
  </div>
  <div v-else class="flex justify-center w-full h-full items-center flex-col uppercase text-xl">
    <strong class="text-red-700">
      You have no access to the Database
    </strong>
    <p> An admin can give you access</p>
  </div>
</template>
