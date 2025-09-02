<script setup lang="ts">
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import DefaultLayout from "@/layouts/default.vue";

const router = useRouter();

const goToCreateAd = () => {
  router.push("/create-ad");
};
</script>
<template>
  <DefaultLayout>
    <div class="flex mt-[68px] mobile:mt-[40px]">
      <div class="flex flex-col w-full">
        <div class="font-medium text-[62px] leading-[100%]">
          <h1 class="text-gradient">Генератор объявлений</h1>
          <h1 class="text-white">для продвижения</h1>
          <h1 class="text-white">мессенджера MAX</h1>
        </div>
        <h4 class="text-white mt-[25px] text-[28px]">
          для самостоятельной печати
        </h4>
        <ul
          class="flex flex-col mt-[50px] list-disc list-outside text-gray-primary text-[24px] gap-4 pl-8"
        >
          <li class="font-light">Скачивайте готовые объявления.</li>
          <li class="max-w-[604px]">
            Создавайте который приведет пол канал, который приведет пользователя
            в ваш групповой чат, чат/бот или канал.
          </li>
        </ul>
        <Button
          variant="primary"
          class="max-w-[287px] w-full font-normal mt-[50px] mobile:mt-[30px] mobile:max-w-full"
          @click="goToCreateAd"
          >Создать объявление</Button
        >
      </div>
      <img src="/src/assets/main-image.svg" alt="main" class="mobile:hidden" />
    </div>
  </DefaultLayout>
</template>
