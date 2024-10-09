<script setup lang="ts">
import { getInjected } from '@snapshot-labs/lock/src/utils';
import connectors from '@/helpers/connectors';

const props = defineProps<{
  open: boolean;
}>();

defineEmits(['login', 'close', 'openTerms']);

const { open } = toRefs(props);

const isShowingAllConnectors = ref(false);

const injected = computed(() => getInjected());

const filteredConnectors = computed(() => {
  const baseConnectors = ['injected', 'walletconnect', 'walletlink'];
  if (injected.value?.name === 'Coinbase') connectors.walletlink.hidden = true;
  if (isShowingAllConnectors.value) return Object.keys(connectors);
  return Object.keys(connectors).filter(cId => baseConnectors.includes(cId));
});

watch(open, () => {
  isShowingAllConnectors.value = false;
});
</script>

<template>
  <TuneModal :open="open" @close="$emit('close')">
    <TuneModalTitle as="h4" class="mx-3 mt-3">
      Log in to the World Association
    </TuneModalTitle>
    <div>
      <div class="m-3 space-y-2">
        <div v-for="cId in filteredConnectors" :key="cId" class="block" @click="$emit('login', connectors[cId].id)">
          <TuneButton v-if="cId === 'injected' && injected" class="flex w-full items-center justify-center"
            data-testid="button-connnect-wallet-injected">
            {{ injected.name }}
          </TuneButton>
          <TuneButton v-else-if="cId !== 'injected' && !connectors[cId].hidden"
            class="flex w-full items-center justify-center gap-2">
            <span>{{ connectors[cId].name }}</span>
          </TuneButton>
        </div>
      </div>
    </div>
  </TuneModal>
</template>
