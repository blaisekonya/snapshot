<script setup lang="ts">
import pkg from '@/../package.json';
import { PopoverButton } from '@headlessui/vue';

const { domain } = useApp();
const router = useRouter();

const commitSha =
  import.meta.env.VITE_COMMIT_SHA || import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;

const navigationItems = [
  {
    name: 'Timeline',
    link: '/'
  },
  {
    name: 'Explore',
    link: '/explore'
  },
  {
    name: 'Create',
    link: '/setup'
  },
  {
    name: 'Organization',
    link: '/worldassociation.eth'
  }
];

function clickNavigationItem(item: any) {
  if (domain) window.open(`https://snapshot.org/#/${item.link}`, '_blank');
  else router.replace({ path: item.link });
}
</script>

<template>
  <BasePopover>
    <template #button>
      <BaseButtonRound class="relative max-sm:border-none">
        <i-ho-dots-horizontal class="text-skin-link" />
      </BaseButtonRound>
    </template>
    <template #content>
      <div>
        <div class="m-4 flex justify-between">
          <div>
            <ButtonTheme v-if="!domain" />
          </div>
          <MenuLanguages class="!h-[42px]" />
        </div>
        <div class="group m-4 my-[30px]">
          <PopoverButton
            v-for="item in navigationItems"
            :key="item.name"
            as="button"
            class="block w-full cursor-pointer py-[6px] text-left text-xl text-skin-link hover:!text-skin-link hover:!opacity-100 group-hover:text-skin-text group-hover:opacity-70"
            @click="clickNavigationItem(item)"
          >
            {{ item.name }}
          </PopoverButton>
        </div>

        <div class="mt-4 border-t">
          <div class="m-4 flex items-center justify-between">
            <FooterSocials class="inline-flex justify-start !pt-0" />
            <div class="text-sm leading-4 opacity-40">
              <BaseLink
                v-if="commitSha"
                :link="`https://github.com/${pkg.repository}/tree/${commitSha}`"
              >
                v{{ pkg.version }}#{{ commitSha.slice(0, 7) }}
              </BaseLink>
              <span v-else v-text="`v${pkg.version}`" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </BasePopover>
</template>
