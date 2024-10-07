<script setup lang="ts">
import { ref, watch } from 'vue';
import { ZkMeWidget } from '@zkmelabs/widget';
import { Engine } from '@thirdweb-dev/engine';
import { CHAIN, GLOBAL_VOTER_ID_ZKME_ADDRESS } from '../helpers/constants';
import { useBalance } from '@wagmi/vue';

const { modalAccountOpen } = useModal();

const ZKME_API_KEY = import.meta.env.VITE_ZKME_API_KEY;

const THIRDWEB_ENGINE_URL = import.meta.env.VITE_THIRDWEB_ENGINE_URL;
const THIRDWEB_ENGINE_ACCESS_TOKEN = import.meta.env
  .VITE_THIRDWEB_ENGINE_ACCESS_TOKEN;
const THIRDWEB_BACKEND_WALLET_ADDRESS = import.meta.env
  .VITE_THIRDWEB_BACKEND_WALLET_ADDRESS;
const THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS = import.meta.env
  .VITE_THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS;

const { web3Account } = useWeb3();
const { data: balanceData } = useBalance({
  address: web3Account.value as `0x${string}`,
  token: GLOBAL_VOTER_ID_ZKME_ADDRESS
});

const showResultDialog = ref(false);
const resultDialogContent = ref({ title: '', description: '' });
const isProcessing = ref(false);
const widget = ref<ZkMeWidget | null>(null);

async function mintMembershipZkMe(address: string) {
  console.log('mintMembershipZkMe called with address:', address);
  const engine = new Engine({
    url: THIRDWEB_ENGINE_URL as string,
    accessToken: THIRDWEB_ENGINE_ACCESS_TOKEN as string
  });

  try {
    console.log('Minting membership...');
    await engine.erc20.mintTo(
      CHAIN,
      GLOBAL_VOTER_ID_ZKME_ADDRESS,
      THIRDWEB_BACKEND_WALLET_ADDRESS as string,
      {
        toAddress: address,
        amount: '1.0'
      },
      false,
      '',
      THIRDWEB_BACKEND_SMART_ACCOUNT_ADDRESS
    );
    console.log('Minting successful');
  } catch (error) {
    console.error('Error during minting:', error);
    throw new Error('Failed to mint membership SBT');
  }
}

async function getZkMeToken() {
  console.log('getZkMeToken called');
  if (!ZKME_API_KEY) {
    console.error('ZKME_API_KEY is missing');
    throw new Error('ZKME_API_KEY is missing');
  }

  const response = await fetch('https://nest-api.zk.me/api/token/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'User-Agent': 'World Association'
    },
    body: JSON.stringify({
      apiKey: ZKME_API_KEY,
      appId: 'M2024053066119595336406774111128',
      apiModePermission: 1,
      lv: 2
    })
  });

  if (!response.ok) {
    console.error('Failed to fetch zkMe token');
    throw new Error('Failed to fetch zkMe token');
  }

  const data = await response.json();
  console.log('Fetched zkMe token:', data.data.accessToken);
  return data.data.accessToken;
}

const initializeWidget = async () => {
  console.log('initializeWidget called');
  if (!web3Account.value) {
    console.log('No web3Account found, setting widget to null');
    widget.value = null;
    return;
  }

  try {
    const accessToken = await getZkMeToken();
    console.log('Access token obtained:', accessToken);

    const newProvider = {
      async getAccessToken() {
        return accessToken;
      },
      async getUserAccounts() {
        return [web3Account.value];
      }
    };

    widget.value = new ZkMeWidget(
      'M2024053066119595336406774111128',
      'World Association',
      '0x2105',
      newProvider,
      {
        lv: 'MeID',
        mode: 'wallet'
      }
    );
    console.log('Widget initialized:', widget.value);
  } catch (error) {
    console.error('Error initializing widget:', error);
    widget.value = null;
  }
};

const launchWidget = () => {
  console.log('launchWidget called');
  if (widget.value) {
    try {
      console.log('Widget before launch:', widget.value);
      // Add a check for the launch method
      if (typeof widget.value.launch !== 'function') {
        throw new Error('Widget launch method is not a function');
      }
      widget.value.launch();
      console.log('Widget launched successfully');
      widget.value.on('meidFinished', async results => {
        console.log('meidFinished event received:', results);
        if (results.isGrant) {
          await mintMembership();
        }
      });
    } catch (error) {
      console.error('Error launching widget:', error);
      console.log('Widget details:', JSON.stringify(widget.value, null, 2));
      resultDialogContent.value = {
        title: 'Error',
        description: `Failed to launch the widget: ${
          (error as Error).message || 'Unknown error'
        }. Please try again later or contact support.`
      };
      showResultDialog.value = true;
    }
  } else {
    console.error('Widget is not initialized');
    resultDialogContent.value = {
      title: 'Error',
      description:
        'Widget is not initialized. Please refresh the page and try again.'
    };
    showResultDialog.value = true;
  }
};

const mintMembership = async () => {
  console.log('mintMembership called');
  if (
    !web3Account ||
    (balanceData &&
      balanceData.value !== undefined &&
      balanceData.value.value > 0)
  ) {
    console.log('Membership minting skipped due to conditions not met');
    return;
  }

  isProcessing.value = true;
  showResultDialog.value = true;

  try {
    await mintMembershipZkMe(web3Account.value);
    resultDialogContent.value = {
      title: 'Success',
      description: 'Your voter ID has been successfully created!'
    };
  } catch (error) {
    console.error('Error minting membership SBT:', error);
    resultDialogContent.value = {
      title: 'Error',
      description: 'There was an error while creating your voter ID.'
    };
  } finally {
    isProcessing.value = false;
  }
};

const closeResultDialog = () => {
  console.log('closeResultDialog called');
  showResultDialog.value = false;
};

const viewProposals = () => {
  console.log('viewProposals called');
  window.open('https://snapshot.org/#/worldassociation.eth', '_blank');
};

console.log('Setting up watch for web3Account');
watch(() => web3Account, initializeWidget, { immediate: true });
</script>

<template>
  <div class="mt-4">
    <TuneButton v-if="!web3Account" primary @click="modalAccountOpen = true">
      Claim your voter ID
    </TuneButton>
    <TuneButton
      v-else
      v-if="balanceData && balanceData.value > 0"
      @click="viewProposals"
    >
      See current proposals
    </TuneButton>
    <TuneButton v-else primary @click="launchWidget">
      Claim your voter ID
    </TuneButton>

    <Teleport to="body">
      <BaseModal
        v-model="showResultDialog"
        :open="showResultDialog"
        @close="closeResultDialog"
      >
        <template v-if="isProcessing">
          <LoadingSpinner class="overlay big animate-fade-in" />
          <p class="text-sm text-muted-foreground">Creating voter ID...</p>
        </template>
        <template v-else>
          <div class="flex flex-col space-y-2 text-center">
            <p class="text-lg font-semibold">{{ resultDialogContent.title }}</p>
            <p class="text-sm text-muted-foreground">
              {{ resultDialogContent.description }}
            </p>
          </div>
          <div class="flex flex-row items-center justify-center">
            <TuneButton @click="closeResultDialog" class="w-40" variant="white">
              Close
            </TuneButton>
            <a
              href="https://snapshot.org/#/worldassociation.eth"
              target="_blank"
              rel="noopener noreferrer"
              class="w-40 sm:w-auto"
            >
              <TuneButton class="w-40"> View proposals </TuneButton>
            </a>
          </div>
        </template>
      </BaseModal>
    </Teleport>
  </div>
</template>
