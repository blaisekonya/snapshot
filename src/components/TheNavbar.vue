<script setup lang="ts">
const { pendingTransactions, pendingTransactionsWithHash } = useTxStatus();
const { env, showSidebar, domain } = useApp();
const { web3Account } = useWeb3();

const showPendingTransactionsModal = ref(false);

watch(
  () => pendingTransactionsWithHash.value.length === 0,
  () => {
    showPendingTransactionsModal.value = false;
  }
);
</script>

<template>
  <div>
    <div class="px-2 sm:px-3">
      <div class="flex items-center py-2 sm:py-[12px]">
        <div class="flex flex-auto items-center">
          <BaseButtonRound
            v-if="!domain"
            class="sm:hidden border-none"
            @click="showSidebar = !showSidebar"
          >
            <i-ho-menu class="text-skin-link" />
          </BaseButtonRound>
          <router-link
            :to="{ name: 'home' }"
            class="items-center font-extrabold text-skin-primary ml-2 text-lg"
          >
            World Association
          </router-link>
          <span
            v-if="env === 'demo'"
            class="ml-1 hidden uppercase text-[12px] sm:block mb-1"
            v-text="'testnet'"
          />
          <Banner class="ml-3" />
        </div>
        <div :key="web3Account" class="flex sm:space-x-2">
          <div class="hidden sm:block">
            <NavbarAccount />
          </div>

          <NavbarNotifications v-if="web3Account && !domain" />

          <NavbarExtras />
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="pendingTransactions.length > 0"
    class="flex items-center justify-center gap-x-2 bg-skin-border py-2 text-center text-skin-link"
    :class="{
      'cursor-pointer': pendingTransactions.length > 0
    }"
    @click="
      pendingTransactionsWithHash.length
        ? (showPendingTransactionsModal = true)
        : null
    "
  >
    <TuneLoadingSpinner class="text-skin-link" />
    <span>
      {{ $t('setup.pendingTransactions') }}:
      {{ pendingTransactions.length }}
    </span>
  </div>
  <Teleport to="#modal">
    <ModalPendingTransactions
      :open="showPendingTransactionsModal"
      @close="showPendingTransactionsModal = false"
    />
  </Teleport>
</template>
