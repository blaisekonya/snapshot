<script setup lang="ts">
import connectors from '@/helpers/connectors';
import { useStorage } from '@vueuse/core';

const props = defineProps<{
  open: boolean;
}>();

const emit = defineEmits(['close', 'openTerms']);
const { login } = useWeb3();

const { open } = toRefs(props);
const loading = ref(false);
const termsAccepted = useStorage('snapshot.termsAccepted', false);

const isShowingAllConnectors = ref(false);

watch(open, () => {
  isShowingAllConnectors.value = false;
});

async function handleLogin(connector) {
  try {
    loading.value = true;
    termsAccepted.value = true;
    await login(connector);
    emit('close');
  } catch (e) {
    console.error('Login error:', e);
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <TuneModal :open="open" @close="$emit('close')">
    <TuneModalTitle as="h4" class="mx-3 mt-3">
      Sign in to the World Association
    </TuneModalTitle>
    <div>
      <div class="m-3 space-y-2">
        <div class="block">
          <TuneButton primary class="flex w-full items-center justify-center" :loading="loading"
            @click="handleLogin(connectors.walletlink.id)">
            Log in
          </TuneButton>
        </div>
        <div class="block">
          <TuneButton class="flex w-full items-center justify-center" :loading="loading"
            @click="handleLogin(connectors.walletlink.id)">
            Sign up
          </TuneButton>
        </div>
      </div>
    </div>
  </TuneModal>
</template>
