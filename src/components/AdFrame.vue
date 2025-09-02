<template>
  <div class="flex flex-col">
    <div class="flex gap-[14px] items-center">
      <div
        class="rounded-full bg-step min-w-[25px] min-h-[25px] text-white flex items-center justify-center"
      >
        {{ num }}
      </div>
      <h4 class="font-medium text-[24px]">{{ title }}</h4>
    </div>
    <h4 v-if="num === 2" class="text-[20px] text-[#49494B] mt-2">
      <div v-if="selectedTab === 0">
        если ссылки нет, универсальный QR будет вести на скачивание MAX
      </div>
      <div v-else>нажмите на аватар чата или канала и скопируйте ссылку</div>
    </h4>
    <p class="text-[14px] text-tabs-inactive mt-[10px]">{{ help }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  num: number;
  title: string;
  help: string;
  selectedTab?: number;
}>();
</script>

<style scoped></style>
