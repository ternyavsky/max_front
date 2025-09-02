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
    class="w-full flex justify-between items-center"
    :class="{
      'flex-row-reverse': route.path === '/create-ad',
    }"
  >
    <img
      src="/src/assets/Max.png"
      alt="logo"
      @click="goToMain"
      class="cursor-pointer"
    />
    <h4
      v-if="route.path === '/create-ad'"
      class="text-white text-[40px] font-medium"
    >
      Создание объявления
    </h4>
  </header>
</template>

<style scoped></style>
