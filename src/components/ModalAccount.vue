<script setup lang="ts">
import connectors from '@/helpers/connectors';

const props = defineProps<{
  open: boolean;
}>();

defineEmits(['login', 'close', 'openTerms']);

const { open } = toRefs(props);

const isShowingAllConnectors = ref(false);

watch(open, () => {
  isShowingAllConnectors.value = false;
});
</script>

<template>
  <TuneModal :open="open" @close="$emit('close')">
    <TuneModalTitle as="h4" class="mx-3 mt-3">
      Sign in to the World Association
    </TuneModalTitle>
    <div>
      <div class="m-3 space-y-2">
        <div class="block" @click="$emit('login', connectors.walletlink.id)">
          <TuneButton primary class="flex w-full items-center justify-center">
            Log in
          </TuneButton>
        </div>
        <div class="block" @click="$emit('login', connectors.walletlink.id)">
          <TuneButton class="flex w-full items-center justify-center">
            Sign up
          </TuneButton>
        </div>
      </div>
    </div>
  </TuneModal>
</template>
