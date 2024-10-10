<script setup lang="ts">
import { useStorage } from '@vueuse/core';
const { domain, init, isReady, showSidebar } = useApp();
const route = useRoute();
const { restorePendingTransactions } = useTxStatus();
const { web3Account } = useWeb3();
const { modalAccountOpen } = useModal();

onMounted(async () => {
  await init();
  restorePendingTransactions();
});
const bannerClosed = useStorage(
  'worldassociation.sign-up-banner-closed',
  false
);
const showBanner = computed(() => {
  return !bannerClosed.value;
});

const isActive = (path: string) => route.path === path;
</script>

<template>
  <LoadingSpinner v-if="!isReady" class="overlay big animate-fade-in" />
  <div v-else class="flex min-h-screen">
    <div v-if="!domain" id="sidebar" class="flex flex-col">
      <div class="sticky top-0 z-40 h-screen overflow-hidden bg-skin-bg transition-all sm:w-[60px]"
        :class="{ 'max-w-0 sm:max-w-none': !showSidebar }">
        <TheSidebar class="border-r border-skin-border" />
      </div>
    </div>
    <div class="relative flex w-screen min-w-0 shrink-0 flex-col sm:w-auto sm:shrink sm:grow">
      <div class="absolute bottom-0 left-0 right-0 top-0 z-50 bg-skin-bg opacity-60" :class="{ hidden: !showSidebar }"
        @click="showSidebar = false" />
      <div id="navbar" class="border-b border-skin-border bg-skin-bg">
        <TheNavbar />
      </div>
      <div v-if="!web3Account && showBanner" @click="modalAccountOpen = true"
        class="relative flex cursor-pointer items-center justify-center gap-2 bg-skin-border px-4 py-[10px]">
        <div class="flex gap-2">
          <div class="leading-6">
            Sign up to claim your basic income and experiment with global
            democracy.
          </div>
        </div>
        <button class="xs:absolute xs:right-3" @click="bannerClosed = true">
          <i-ho-x />
        </button>
      </div>
      <div id="content" class="pb-[70px] pt-4">
        <router-view v-slot="{ Component }">
          <KeepAlive :include="['ExploreView', 'RankingView']">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </router-view>
      </div>
      <div id="action-bar" />
    </div>
  </div>
  <nav class="fixed bottom-0 left-0 right-0 bg-skin-bg border-t px-3 border-skin-border z-50 sm:hidden">
    <ul class="flex justify-between items-center h-14">
      <li>
        <router-link to="/" class="flex flex-col items-center p-2" :class="{ 'text-skin-primary': isActive('/') }">
          <i-ho-home class="text-[18px]" />
        </router-link>
      </li>
      <li>
        <router-link to="/explore" class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/explore') }">
          <i-ho-search class="text-[18px]" />
        </router-link>
      </li>
      <li>
        <router-link to="/setup" class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/setup') }">
          <i-ho-plus class="text-[18px]" />
        </router-link>
      </li>
      <li>
        <router-link to="/worldassociation.eth" class="flex flex-col items-center p-2">
          <div class="box-border h-[18px] w-[18px] rounded-full border-[3px] border-skin-link" :class="{
            'border-skin-primary': isActive('/worldassociation.eth')
          }"></div>
        </router-link>
      </li>
      <BottomNavAccount />
    </ul>
  </nav>
  <TheFlashNotification />
  <TheModalNotification />
</template>
