<template>
  <div>
    <div
      class="bg-bg-frame rounded-[16px] w-full py-[44px] mobile:px-[20px] flex flex-col gap-[35px] mt-[20px] relative max-w-full overflow-x-hidden"
    >
      <!-- Предпросмотр объявления -->
      <h3 class="mx-auto text-[28px] mobile:text-[20px]">
        Ваше объявление готово
      </h3>

      <!-- Индивидуальный макет -->
      <div
        class="bg-[url('/assets/editable-frame.png')] bg-cover mobile:bg-contain mobile:bg-no-repeat mobile:bg-center rounded-[18px] flex flex-col px-[42px] pt-[72px] pb-[40px] justify-between w-[947px] h-[655px] mx-auto mobile:h-[250px] mobile:px-[20px] mobile:pt-[20px] mobile:pb-[10px] relative mobile:w-[280px]"
        v-if="props.selectedTab === 1"
        id="pdf-block"
      >
        <h4
          class="text-[57px] font-bold max-w-[430px] text-white leading-[115%] flex flex-col mobile:text-[15px] mobile:max-w-[135px] mobile:mt-[32px]"
        >
          <span
            v-if="splitText.firstLine"
            class="text-gradient"
            id="first-line"
            >{{ splitText.firstLine }}</span
          >
          <span v-if="splitText.restLines" class="text-white">{{
            splitText.restLines
          }}</span>
          <span
            v-if="!splitText.firstLine && !splitText.restLines"
            class="text-white opacity-50"
          >
            {{
              props.selectedTab === 1 ? "Введите заголовок" : "Выберите шаблон"
            }}
          </span>
        </h4>
        <div class="flex gap-[10px] items-center">
          <img
            :src="resData.pathImg || '/assets/preview.svg'"
            crossorigin="anonymous"
            alt="qr-code"
            width="155"
            height="155"
            class="absolute bottom-[61px] left-[42px] rounded-[8px] mobile:bottom-[45px] mobile:left-[12px] mobile:w-[45px] mobile:h-[45px] z-10"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Готовые шаблоны -->
      <div
        v-if="props.selectedTab !== 1"
        class="bg-no-repeat bg-center bg-cover mobile:bg-contain rounded-[18px] px-[42px] pt-[72px] pb-[40px] w-[947px] h-[655px] mx-auto relative mobile:h-[250px] mobile:w-[280px]"
        :style="{ backgroundImage: `url(${props.selectedTemplate.img})` }"
        id="pdf-block"
      >
        <img
          :src="resData.pathImg || '/assets/preview.svg'"
          alt="qr-code"
          class="absolute bottom-[61px] left-[42px] rounded-[8px] mobile:bottom-[45px] mobile:left-[12px] mobile:w-[45px] mobile:h-[45px] z-10"
          width="155"
          height="155"
        />
      </div>

      <!-- Кнопки действий -->
      <div
        class="flex justify-center gap-[22px] mt-[30px] mobile:mt-[30px] mobile:flex-col mobile:gap-4"
      >
        <Button
          variant="primary"
          class="max-w-[139px] w-full font-normal mobile:max-w-full"
          @click="handleDownload"
          >Скачать</Button
        >
        <Button
          variant="outline"
          @click="handleGoBack"
          class="max-w-[280px] w-full font-normal mobile:max-w-full"
          >Вернуться назад</Button
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { usePdfGeneration } from "@/composables/usePdfGeneration";
import { splitTextIntoLines } from "@/composables/useTextProcessing";
import { computed } from "vue";

// Props
interface Props {
  selectedTab: any;
  selectedTemplate: any;
  frameObjects: any;
  resData: any;
}

const props = defineProps<Props>();

// Локальный computed для splitText
const splitText = computed(() => {
  console.log("AdResult splitText computed called");
  console.log("AdResult - selectedTab:", props.selectedTab);
  console.log("AdResult - frameObjects:", props.frameObjects);

  let text = "";
  if (props.selectedTab === 1) {
    text = props.frameObjects[0]?.inputValue || "";
    console.log("AdResult - inputText:", text);
  } else {
    text = props.selectedTemplate?.text || "";
  }

  return splitTextIntoLines(text);
});

// Отладочная информация
console.log("AdResult props:", {
  selectedTab: props.selectedTab,
  templateName: props.selectedTemplate?.name,
  templateId: props.selectedTemplate?.id,
});

const { downloadImage, handleImageError } = usePdfGeneration();

// Обработчики
const handleDownload = () => {
  downloadImage({ value: props.selectedTab, idLink: props.resData.idLink });
};

const handleGoBack = () => {
  emit("goBack");
};

// Эмиты
const emit = defineEmits<{
  goBack: [];
}>();
</script>
