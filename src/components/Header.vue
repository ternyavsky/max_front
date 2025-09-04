<script setup lang="ts">
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const router = useRouter();

const route = useRoute();
const goToMain = () => {
  router.push("/");
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
      src="/src/assets/Max.png"
      alt="logo"
      @click="goToMain"
      class="cursor-pointer mobile:w-[80px] my-auto"
    />
    <div
      v-if="route.path === '/'"
      class="rounded-[14px] max-w-fit w-full px-[15px] py-[10px] border-1 border-white/30 desktop:hidden"
    >
      <h4 class="text-white text-[16px] font-medium">Скачать Max</h4>
    </div>
    <h4
      v-if="route.path === '/create-ad'"
      class="text-white text-[40px] font-medium mobile:text-[30px]"
    >
      Создание объявления
    </h4>
  </header>
</template>

<style scoped></style>
