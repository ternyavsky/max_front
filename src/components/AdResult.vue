<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { usePdfGeneration } from "@/composables/usePdfGeneration";
import { splitTextIntoLines } from "@/composables/useTextProcessing";
import { computed, ref, watch, onMounted } from "vue";

interface Props {
  selectedTab: any;
  selectedTemplate: any;
  frameObjects: any;
  resData: any;
}

const props = defineProps<Props>();

// SVG content loading
const templateSvgContent = ref("");
const individualTemplateSvgContent = ref("");

const loadSvgContent = async (svgPath: string) => {
  try {
    const response = await fetch(svgPath);
    if (response.ok) {
      const svgText = await response.text();
      // Remove white margins and make SVG fill the container completely
      templateSvgContent.value = svgText.replace(
        /<svg([^>]*)>/,
        '<svg$1 class="w-full h-full" style="display: block;" preserveAspectRatio="xMidYMid meet">'
      );
    }
  } catch (error) {
    console.error("Failed to load SVG:", error);
    templateSvgContent.value = "";
  }
};

// Load editable-frame.svg for individual templates
const loadIndividualTemplateSvg = async () => {
  try {
    const response = await fetch("/assets/editable-frame.svg");
    if (response.ok) {
      const svgText = await response.text();
      individualTemplateSvgContent.value = svgText.replace(
        /<svg([^>]*)>/,
        '<svg$1 class="w-full h-full" style="display: block;" preserveAspectRatio="xMidYMid meet">'
      );
    }
  } catch (error) {
    console.error("Failed to load individual template SVG:", error);
    individualTemplateSvgContent.value = "";
  }
};

// Watch for template changes and load SVG
watch(
  () => props.selectedTemplate?.svgImage,
  (newSvgImage: string | undefined) => {
    if (newSvgImage) {
      loadSvgContent(newSvgImage);
    } else {
      templateSvgContent.value = "";
    }
  },
  { immediate: true }
);

// Load individual template SVG on mount
onMounted(() => {
  loadIndividualTemplateSvg();
});

// Отладочная информация
console.log("AdResult props:", props);
console.log("resData:", props.resData);
console.log("selectedTemplate:", props.selectedTemplate);

const splitText = computed(() => {
  let text = "";
  if (props.selectedTab === 1) {
    text = props.frameObjects[0]?.inputValue || "";
  } else {
    text =
      props.selectedTemplate?.description || props.selectedTemplate?.text || "";
  }

  // Отладочная информация
  console.log("AdResult - selectedTemplate:", props.selectedTemplate);
  console.log("AdResult - selectedTab:", props.selectedTab);
  console.log("AdResult - text:", text);

  return splitTextIntoLines(text);
});

const { downloadImage, handleImageError } = usePdfGeneration();

const handleDownload = async () => {
  try {
    await downloadImage({
      value: props.selectedTab,
      idLink: props.resData.idLink,
      template: props.selectedTemplate,
    });
    emit("downloadSuccess");
  } catch (error) {}
};

const handleGoBack = () => {
  emit("goBack");
};

const emit = defineEmits<{
  goBack: [];
  downloadSuccess: [];
}>();
</script>

<template>
  <div>
    <div
      class="bg-bg-frame rounded-[16px] w-full py-[44px] mobile:px-[20px] flex flex-col gap-[35px] mt-[20px] relative max-w-full overflow-x-hidden"
    >
      <h3 class="mx-auto text-[28px] mobile:text-[20px]">
        Ваше объявление готово
      </h3>

      <div
        class="rounded-[18px] w-[947px] h-[655px] mx-auto relative mobile:h-[250px] mobile:w-[280px]"
        v-if="props.selectedTab === 1"
        id="pdf-block"
      >
        <!-- SVG Background for individual templates -->
        <div
          class="w-full h-full relative rounded-[18px]"
          style="margin: 0; padding: 0; line-height: 0"
          v-html="individualTemplateSvgContent"
        ></div>

        <!-- Content overlay -->
        <div
          class="absolute inset-0 flex flex-col pt-[72px] pb-[40px] justify-between mobile:pt-[20px] mobile:pb-[10px] mobile:gap-[10px]"
        >
          <h4
            class="text-[57px] font-bold max-w-[430px] text-white leading-[115%] flex flex-col mobile:text-[15px] mobile:max-w-[135px] mobile:mt-[32px] ml-[42px] mobile:ml-[12px]"
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
                props.selectedTab === 1
                  ? "Введите заголовок"
                  : "Выберите шаблон"
              }}
            </span>
          </h4>
          <img
            :src="resData.pathImg || '/assets/preview.svg'"
            alt="qr-code"
            class="absolute bottom-[61px] left-[42px] rounded-[8px] mobile:bottom-[45px] mobile:left-[12px] mobile:w-[45px] mobile:h-[45px] z-10"
            width="155"
            height="155"
            @error="handleImageError"
          />
        </div>
      </div>

      <div
        v-if="props.selectedTab !== 1"
        class="rounded-[18px] w-[947px] h-[655px] mx-auto relative mobile:h-[250px] mobile:w-[280px]"
        id="pdf-block"
      >
        <!-- SVG Template Background -->
        <div
          v-if="props.selectedTemplate?.svgImage"
          class="w-full h-full relative rounded-[18px] bg-transparent"
          style="margin: 0; padding: 0; line-height: 0"
          v-html="templateSvgContent"
        ></div>

        <!-- Fallback to PNG background for templates without SVG -->
        <div
          v-else
          class="bg-no-repeat bg-center bg-cover mobile:bg-contain rounded-[18px] w-full h-full relative"
          :style="{
            backgroundImage: `url(${
              props.selectedTemplate?.image || props.selectedTemplate?.img
            })`,
          }"
        ></div>

        <!-- QR Code positioned on top -->
        <img
          :src="resData.pathImg || '/assets/preview.svg'"
          alt="qr-code"
          class="absolute bottom-[61px] left-[42px] rounded-[8px] mobile:bottom-[45px] mobile:left-[12px] mobile:w-[45px] mobile:h-[45px] z-10"
          width="155"
          height="155"
          @error="handleImageError"
        />
      </div>

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
