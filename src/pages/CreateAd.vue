<template>
  <DefaultLayout>
    <!-- Экран формы -->
    <img
      class="absolute top-[-220px] left-[464px] z-[-1] mobile:hidden rotate-45 w-[987px] h-[878px]"
      src="/assets/ad-right-bg.svg"
      alt="shape-1"
    />
    <img
      class="fixed top-[403px] left-[-169px] z-[-1] mobile:hidden rotate-45 w-[987px] h-[878px]"
      src="/assets/ad-left-bg.png"
      alt="shape-1"
    />
    <AdForm
      v-if="currentScreen === 'form'"
      :selectedTab="selectedTab"
      :selectedTemplate="selectedTemplate"
      :frameObjects="frameObjects"
      @formSubmitted="handleFormSubmitted"
      @updateSelectedTab="selectedTab = $event"
      @updateSelectedTemplate="selectedTemplate = $event"
      @updateFrameObjects="
        (value) => {
          console.log('CreateAd received frameObjects update:', value);
          frameObjects = value;
        }
      "
    />

    <!-- Экран результата -->
    <AdResult
      v-if="currentScreen === 'result'"
      :selectedTab="selectedTab"
      :selectedTemplate="selectedTemplate"
      :frameObjects="frameObjects"
      :resData="resData"
      @goBack="goBackToForm"
    />

    <!-- Модалки -->
    <SuccessModal :isOpen="isSuccessModalOpen" @close="closeModal" />
    <FailedModal :isOpen="isFailedModalOpen" @close="closeModal" />
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from "@/layouts/default.vue";
import AdForm from "@/components/AdForm.vue";
import AdResult from "@/components/AdResult.vue";
import SuccessModal from "@/components/ui/SuccessModal.vue";
import FailedModal from "@/components/ui/FailedModal.vue";
import { ref } from "vue";
import { useAdForm } from "@/composables/useAdForm";
import { usePdfGeneration } from "@/composables/usePdfGeneration";

// Используем composables
const { selectedTab, selectedTemplate, frameObjects, clearAllErrors } =
  useAdForm();

const { resData } = usePdfGeneration();

// Состояние экранов
const currentScreen = ref<"form" | "result">("form");

// Состояние модалки
const isSuccessModalOpen = ref(false);
const isFailedModalOpen = ref(false);

// Функция для возврата к форме
const goBackToForm = () => {
  currentScreen.value = "form";
  // Сбрасываем сгенерированное изображение
  resData.value.pathImg = "";
  resData.value.idLink = "";
  // Сбрасываем все ошибки
  clearAllErrors();
};

// Функция для закрытия модалки
const closeModal = () => {
  isSuccessModalOpen.value = false;
  isFailedModalOpen.value = false;
};

// Обработчик успешной отправки формы
const handleFormSubmitted = (data: any) => {
  resData.value.pathImg = data.pathImg;
  resData.value.idLink = data.idLink;
  currentScreen.value = "result";
  isSuccessModalOpen.value = true;
};
</script>
