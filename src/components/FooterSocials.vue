<script setup lang="ts">
const socials = [
  {
    icon: 'discord',
    link: 'https://discord.gg/J9A4g6axjR'
  },
  {
    icon: 'github',
    link: `https://github.com/worldassociation`
  },
  {
    icon: 'x',
    link: 'https://x.com/worldassociatio'
  }
];
</script>

<template>
  <div
    class="flex items-center justify-center space-x-[20px] pt-2 md:mt-4 md:justify-start lg:mt-0 lg:justify-end"
  >
    <span v-for="social in socials" :key="social.icon">
      <BaseLink :link="social.link" hide-external-icon>
        <FooterSocialsItem v-if="social.icon === 'github'">
          <i-s-github class="text-[20px]" />
        </FooterSocialsItem>
        <FooterSocialsItem v-else-if="social.icon === 'x'">
          <i-s-x class="text-[20px]" />
        </FooterSocialsItem>
        <FooterSocialsItem v-else-if="social.icon === 'discord'">
          <i-s-discord class="text-[20px]" />
        </FooterSocialsItem>
      </BaseLink>
    </span>
  </div>
</template>
