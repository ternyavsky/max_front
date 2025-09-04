<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();

const goToMain = () => {
  window.open("https://max.ru/", "_blank");
};
</script>
<template>
  <header
    class="w-full flex justify-between items-center mobile:flex-col mobile:items-start gap-[30px]"
    :class="{
      'flex-row-reverse': route.path === '/create-ad',
      'mobile:flex-row mobile:items-center mobile:flex': route.path === '/',
    }"
  >
    <img
      src="/assets/Max.svg"
      alt="logo"
      @click="goToMain"
      class="cursor-pointer mobile:w-[80px] my-auto"
    />
    <div
      v-if="route.path === '/'"
      @click="goToMain"
      class="rounded-[14px] max-w-fit w-full px-[15px] py-[10px] border-1 border-white/30 desktop:hidden"
    >
      <h4 class="text-white text-[16px] font-medium">Скачать Max</h4>
    </div>
    <h4
      v-if="route.path === '/create-ad'"
      class="text-white text-[40px] font-medium mobile:text-[29px]"
    >
      Создание объявления
    </h4>
  </header>
</template>

<style scoped></style>
