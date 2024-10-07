<script setup lang="ts">
const { modalAccountOpen } = useModal();
const { web3Account } = useWeb3();

const emit = defineEmits(['next']);
</script>

<template>
  <div>
    <div class="px-4 md:px-0 mb-4">
      {{ $t('header.description') }}
    </div>

    <SetupMessageHelp />

    <div class="px-4 md:px-0">
      <router-link to="/polls.worldassociation.eth">
        <TuneButton
          primary
          class="float-right mt-4 w-full"
          @click="!web3Account && (modalAccountOpen = true)"
        >
          {{ $t('createAPoll') }}
        </TuneButton>
      </router-link>
      <router-link to="/petitions.worldassociation.eth">
        <TuneButton
          primary
          class="float-right mt-4 w-full"
          @click="!web3Account && (modalAccountOpen = true)"
        >
          {{ $t('createAPetition') }}
        </TuneButton>
      </router-link>
      <TuneButton
        primary
        class="float-right mt-4 w-full"
        @click="!web3Account ? (modalAccountOpen = true) : emit('next')"
      >
        {{ $t('createASpace') }}
      </TuneButton>
    </div>
  </div>
</template>
