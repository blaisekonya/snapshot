<script setup lang="ts">
import { useStorage } from '@vueuse/core';

const { domain, init, isReady, showSidebar } = useApp();
const route = useRoute();
const { restorePendingTransactions } = useTxStatus();

const { modalAccountOpen } = useModal();
const { web3Account } = useWeb3();

onMounted(async () => {
  await init();
  restorePendingTransactions();
});
const bannerClosed = useStorage('snapshot.v2-banner-closed', false);
const showBanner = computed(() => {
  return !bannerClosed.value;
});
const showAbout = computed(() => {
  const showInPages = [
    '/worldassociation.eth',
    '/worldassociation.eth/about',
    '/worldassociation.eth/settings'
  ];
  return showInPages.includes(route.path as string);
});

const isActive = (path: string) => route.path === path;
</script>

<template>
  <LoadingSpinner v-if="!isReady" class="overlay big animate-fade-in" />
  <div v-else class="flex min-h-screen">
    <div v-if="!domain" id="sidebar" class="flex flex-col">
      <div
        class="sticky top-0 z-40 h-screen overflow-hidden bg-skin-bg transition-all sm:w-[60px]"
        :class="{ 'max-w-0 sm:max-w-none': !showSidebar }"
      >
        <TheSidebar class="border-r border-skin-border" />
      </div>
    </div>
    <div
      class="relative flex w-screen min-w-0 shrink-0 flex-col sm:w-auto sm:shrink sm:grow"
    >
      <div
        class="absolute bottom-0 left-0 right-0 top-0 z-50 bg-skin-bg opacity-60"
        :class="{ hidden: !showSidebar }"
        @click="showSidebar = false"
      />
      <div
        id="navbar"
        class="sticky top-0 z-40 border-b border-skin-border bg-skin-bg"
      >
        <TheNavbar />
      </div>
      <div
        v-if="showBanner"
        class="relative flex items-center justify-center gap-2 bg-skin-border px-4 py-[10px]"
      >
        <a
          class="flex gap-2"
          target="_blank"
          href="https://snapshot.box/#/home"
        >
          <i-ho-speakerphone class="shrink-0" />
          <div class="leading-6">
            Public preview. Available for demonstration and test purposes.
          </div>
        </a>
        <button class="xs:absolute xs:right-3" @click="bannerClosed = true">
          <i-ho-x />
        </button>
      </div>
      <div
        v-if="showAbout"
        class="flex w-full max-w-5xl mx-auto sm:flex-row p-4 sm:px-[30px]"
      >
        <h2>Organization</h2>
      </div>
      <div
        class="flex flex-col max-w-5xl mx-auto sm:flex-row sm:gap-5 sm:px-[30px]"
      >
        <div
          v-if="showAbout"
          class="relative items-center justify-center border-y sm:border border-skin-border sm:rounded-xl gap-2 p-4 pt-3"
        >
          <div>
            <h3 class="mb-2">Global Voter ID</h3>
          </div>
          <div>
            Create your Global Voter ID by verifying your identity through
            facial scanning.
          </div>
          <ButtonClaimID />
        </div>
        <div
          v-if="showAbout"
          class="relative items-center justify-center border-b sm:border border-skin-border sm:rounded-xl gap-2 p-4 pt-3"
        >
          <div>
            <h3 class="mb-2">Global Basic Income</h3>
          </div>
          <div>
            Get our official currency, the world drachma, flow into your account
            every second.
          </div>
          <TuneButton
            primary
            class="mt-4"
            @click="!web3Account && (modalAccountOpen = true)"
          >
            Set up basic income
          </TuneButton>
        </div>
      </div>
      <div id="content" class="pb-[70px] pt-5">
        <router-view v-slot="{ Component }">
          <KeepAlive :include="['ExploreView', 'RankingView']">
            <component :is="Component" :key="route.path" />
          </KeepAlive>
        </router-view>
      </div>
      <div id="action-bar" />
    </div>
  </div>
  <nav
    class="fixed bottom-0 left-0 right-0 bg-skin-bg border-t px-3 border-skin-border z-50 sm:hidden"
  >
    <ul class="flex justify-between items-center h-14">
      <li>
        <router-link
          to="/"
          class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/') }"
        >
          <i-ho-home />
        </router-link>
      </li>
      <li>
        <router-link
          to="/explore"
          class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/explore') }"
        >
          <i-ho-search />
        </router-link>
      </li>
      <li>
        <router-link
          to="/setup"
          class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/setup') }"
        >
          <i-ho-plus />
        </router-link>
      </li>
      <li>
        <router-link
          to="/worldassociation.eth"
          class="flex flex-col items-center p-2"
          :class="{ 'text-skin-primary': isActive('/worldassociation.eth') }"
        >
          <i-ho-globe />
        </router-link>
      </li>
      <BottomNavAccount />
    </ul>
  </nav>
  <TheFlashNotification />
  <TheModalNotification />
</template>
