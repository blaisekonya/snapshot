<script setup lang="ts">
import { shorten } from '@/helpers/utils';
import { getInstance } from '@snapshot-labs/lock/plugins/vue3';
import { useStorage } from '@vueuse/core';

const { login, web3, web3Account } = useWeb3();
const { profiles, loadProfiles } = useProfiles();
const { modalAccountOpen } = useModal();
const auth = getInstance();

const loading = ref(false);
const modalTermsOpen = ref(false);

const termsAccepted = useStorage('snapshot.termsAccepted', false);

async function handleLogin(connector) {
  modalAccountOpen.value = false;
  loading.value = true;
  termsAccepted.value = true;
  await login(connector);
  loading.value = false;
}

const profile = computed(() => profiles.value[web3Account.value]);
watch(
  () => web3Account,
  () => loadProfiles([web3Account.value]),
  { immediate: true }
);
</script>

<template>
  <template v-if="auth.isAuthenticated && web3Account">
    <MenuAccount
      :address="web3Account"
      @switch-wallet="modalAccountOpen = true"
    >
      <TuneButton
        :loading="web3.authLoading"
        class="flex items-center border-none p-2"
        data-testid="button-account-menu"
      >
        <AvatarUser :address="web3Account" size="21.59" />
      </TuneButton>
    </MenuAccount>
  </template>

  <TuneButton
    v-if="!auth.isAuthenticated.value"
    :loading="loading || web3.authLoading"
    :aria-label="$t('connectWallet')"
    data-testid="button-connect-wallet"
    @click="modalAccountOpen = true"
    class="border-none p-2"
  >
    <i-ho-user-circle class="block align-text-bottom text-[18px]" />
  </TuneButton>

  <teleport to="#modal">
    <ModalAccount
      :open="modalAccountOpen"
      :profile="profile"
      @close="modalAccountOpen = false"
      @login="handleLogin"
      @open-terms="modalTermsOpen = true"
    />
  </teleport>
  <ModalSnapshotTerms :open="modalTermsOpen" @close="modalTermsOpen = false" />
</template>
