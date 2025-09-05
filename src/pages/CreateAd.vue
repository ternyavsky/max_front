<template>
  <DefaultLayout>
    <!-- Экран формы -->
    <div class="max-w-[1440px] mx-auto">
      <img
        src="/assets/bg.svg"
        alt="bg-mobile"
        class="mobile:block hidden desktop:hidden absolute top-0 z-[-1] w-screen"
      />
      <img
        class="fixed top-[-220px] left-[464px] z-[-1] mobile:hidden rotate-45 w-[987px] h-[878px]"
        src="/assets/bg.svg"
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
        @formError="handleFormError"
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
        @downloadSuccess="handleDownloadSuccess"
      />

      <!-- Модалки -->
      <SuccessModal :isOpen="isSuccessModalOpen" @close="closeModal" />
      <FailedModal :isOpen="isFailedModalOpen" @close="closeModal" />
    </div>
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
const {
  selectedTab,
  selectedTemplate,
  frameObjects,
  clearAllErrors,
  isFailedModalOpen,
} = useAdForm();

const { resData } = usePdfGeneration();

// Состояние экранов
const currentScreen = ref<"form" | "result">("form");

// Состояние модалки
const isSuccessModalOpen = ref(false);

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
};

// Обработчик ошибки формы
const handleFormError = (error: any) => {
  console.error("Ошибка формы:", error);
  isFailedModalOpen.value = true;
};

// Обработчик успешного скачивания
const handleDownloadSuccess = () => {
  isSuccessModalOpen.value = true;
};
</script>
