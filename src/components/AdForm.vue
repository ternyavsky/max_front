<template>
  <div>
    <div class="mt-[50px]">
      <Tabs
        :tabs="tabs"
        v-model="props.selectedTab"
        @change="handleTabChange"
      />
    </div>
    <div
      class="bg-bg-frame rounded-[16px] w-full py-[44px] px-[60px] mobile:px-[20px] flex flex-col gap-[35px] mt-[20px] relative max-w-full overflow-x-hidden"
    >
      <div
        v-for="(frameObject, index) in props.frameObjects"
        :key="frameObject.num"
      >
        <AdFrame
          :num="frameObject.num"
          :title="frameObject.title"
          :help="frameObject.help"
          :selectActive="frameObject.selectActive"
          :selectData="frameObject.selectData"
          :selectedTab="props.selectedTab"
        />
        <div class="mt-2 max-w-[645px]">
          <div
            v-if="frameObject.num === 1 && props.selectedTab === 1"
            class="relative"
          >
            <Input
              :model-value="frameObject.inputValue || ''"
              @update:model-value="(value) => handleInputChange(index, value)"
              :error="frameObject.error"
              placeholder="Введите заголовок"
              maxlength="50"
              data-field-index="0"
            />
          </div>
          <Select
            v-else-if="frameObject.num === 1 && props.selectedTab === 0"
            :options="frameObject.selectData!"
            v-model="localSelectedTemplateName"
            :error="frameObject.error"
          />
          <SearchableSelect
            v-if="frameObject.num === 3"
            :options="availableRegions"
            v-model="selectedRegion"
            placeholder="Выберите регион"
            :error="frameObject.error"
            data-field-index="2"
          />
          <Input
            v-if="frameObject.num === 2"
            v-model="linkValue"
            placeholder="Введите ссылку на чат, канал или чат-бот"
            :error="frameObject.error"
            data-field-index="1"
          />
          <SearchableInput
            v-if="frameObject.num === 4"
            v-model="institutionValue"
            @select="handleOrganizationSelect"
            placeholder="Введите ИНН или название организации"
            :debounce-ms="500"
            :error="frameObject.error"
            data-field-index="3"
          />
        </div>
      </div>

      <!-- Предпросмотр для индивидуального макета -->
      <div
        class="flex flex-col absolute top-[122px] right-[74px] max-w-[450px] h-[330px] w-full mobile:static mobile:max-w-full mobile:h-[250px] mobile:min-w-[280px]"
        v-if="props.selectedTab === 1"
      >
        <div
          class="bg-[url('/assets/editable-frame.png')] bg-cover mobile:bg-contain bg-no-repeat bg-centerw-full h-full desktop:rounded-[8px] flex flex-col px-[20px] pt-[34px] pb-[19px] justify-between"
        >
          <h4
            class="text-[27px] font-bold max-w-[205px] text-white leading-[100%] flex flex-col break-words text-preview mobile:max-w-[150px] mobile:text-[16px]"
          >
            <span
              v-if="splitText.firstLine"
              class="text-gradient leading-[115%]"
              >{{ splitText.firstLine }}</span
            >
            <span v-if="splitText.restLines" class="text-white">{{
              splitText.restLines
            }}</span>
            <span
              v-if="!splitText.firstLine && !splitText.restLines"
              class="text-white opacity-50"
            >
              {{ props.selectedTab === 1 ? "Введите текст" : "Введите шаблон" }}
            </span>
          </h4>
          <!-- <div class="flex gap-[10px] items-center">
            <img
              :src="resData.pathImg || '/assets/preview.svg'"
              alt="Предпросмотр QR-кода"
              width="75"
              class="rounded"
            />
          </div> -->
        </div>
        <p class="text-tabs-inactive text-[14px] mx-auto">предпросмотр</p>
      </div>

      <!-- Предпросмотр для готовых шаблонов -->
      <div
        v-if="props.selectedTab !== 1"
        class="flex flex-col absolute top-[122px] right-[74px] max-w-[450px] h-[330px] w-full mobile:max-w-full mobile:static mobile:h-[250px]"
      >
        <div
          class="bg-contain bg-no-repeat bg-center w-full h-full rounded-[12px] overflow-hidden flex flex-col px-[20px] pt-[34px] pb-[19px] justify-between mobile:pt-[20px] mobile:pb-[10px]"
          :style="{
            backgroundImage: `url(${props.selectedTemplate.img})`,
          }"
        ></div>
        <p class="text-tabs-inactive text-[14px] mx-auto">предпросмотр</p>
      </div>

      <Button
        variant="primary"
        class="mobile:max-w-full max-w-[143px] w-full"
        @click="handleSubmit"
        :disabled="isLoading"
      >
        {{ isLoading ? "Создание..." : "Создать" }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabs from "@/components/ui/Tabs.vue";
import AdFrame from "@/components/AdFrame.vue";
import Select from "@/components/ui/Select.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import SearchableInput from "@/components/ui/SearchableInput.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { computed } from "vue";
import { useAdForm } from "@/composables/useAdForm";
import { usePdfGeneration } from "@/composables/usePdfGeneration";
import { useMobileScroll } from "@/composables/useMobileScroll";

// Props
interface Props {
  selectedTab: any;
  selectedTemplate: any;
  frameObjects: any;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  updateSelectedTab: [value: any];
  updateSelectedTemplate: [value: any];
  updateFrameObjects: [value: any];
  formSubmitted: [data: any];
  formError: [error: any];
}>();

const tabs = [
  { name: "tab1", label: "Готовые объявления" },
  { name: "tab2", label: "Индивидуальный макет" },
];

// Используем composables
const {
  selectedRegion,
  linkValue,
  institutionValue,
  isLoading,

  availableRegions,

  availableTemplates,
  handleOrganizationSelect,
  submitForm,
} = useAdForm();

// Используем composable для мобильного скролла
const { isMobile, scrollToFirstError } = useMobileScroll();

// Локальная функция для обработки смены вкладки
const handleTabChange = (tab: number) => {
  emit("updateSelectedTab", tab);
  // Сбрасываем шаблон только при переключении на индивидуальный макет
  if (tab === 1) {
    emit("updateSelectedTemplate", availableTemplates[0]);
  }
};

// Локальная функция для обработки изменения шаблона
const handleTemplateChange = (templateName: string) => {
  const template = availableTemplates.find((t) => t.name === templateName);
  if (template) {
    emit("updateSelectedTemplate", template);
    // Сбрасываем ошибки при изменении шаблона
    clearErrors();
  }
};

// Локальная версия selectedTemplateName
const localSelectedTemplateName = computed({
  get: () => props.selectedTemplate?.name || "",
  set: (value: string) => {
    handleTemplateChange(value);
  },
});

// Обработчик изменения поля ввода
const handleInputChange = (frameIndex: number, value: string) => {
  console.log("handleInputChange called:", { frameIndex, value });
  console.log("Current frameObjects:", props.frameObjects);

  const updatedFrameObjects = [...props.frameObjects];
  updatedFrameObjects[frameIndex] = {
    ...updatedFrameObjects[frameIndex],
    inputValue: value,
    error: "", // Сбрасываем ошибку при изменении поля
  };

  console.log("Updated frameObjects:", updatedFrameObjects);
  emit("updateFrameObjects", updatedFrameObjects);
};

// Импортируем функцию разделения текста
import { splitTextIntoLines } from "@/composables/useTextProcessing";
import { SENSITIVE_REGEX, SWEAR_REGEX } from "@/utils/banRegular";
import { watch } from "vue";

// Локальный computed для splitText
const splitText = computed(() => {
  console.log("AdForm splitText computed called");
  console.log("AdForm - selectedTab:", props.selectedTab);
  console.log("AdForm - frameObjects:", props.frameObjects);

  let text = "";
  if (props.selectedTab === 1) {
    text = props.frameObjects[0]?.inputValue || "";
    console.log("AdForm - inputText:", text);
  } else {
    text = props.selectedTemplate?.text || "";
  }

  return splitTextIntoLines(text);
});

// Отладочная информация
console.log("AdForm props:", {
  selectedTab: props.selectedTab,
  selectedTemplate: props.selectedTemplate,
  frameObjects: props.frameObjects,
  inputValue: props.frameObjects?.[0]?.inputValue,
});
const { resData } = usePdfGeneration();

// Функция для сброса ошибок
const clearErrors = () => {
  const updatedFrameObjects = [...props.frameObjects];
  updatedFrameObjects.forEach((frame, index) => {
    updatedFrameObjects[index] = {
      ...frame,
      error: "",
    };
  });
  emit("updateFrameObjects", updatedFrameObjects);
};

const validateForm = () => {
  let haveErrors = false;
  const errorFields: number[] = [];
  const updatedFrameObjects = [...props.frameObjects];

  // Отладочная информация
  console.log("Валидация формы:");
  console.log("selectedTab:", props.selectedTab);
  console.log("frameObjects:", props.frameObjects);
  console.log("Поле 0 (заголовок):", props.frameObjects[0]?.inputValue);
  console.log("Поле 1 (ссылка):", props.frameObjects[1]?.inputValue);
  console.log("Поле 3 (организация):", props.frameObjects[3]?.inputValue);

  // Валидация первого поля (заголовок) - только если выбран кастомный режим
  if (props.selectedTab === 1) {
    if (
      !props.frameObjects[0].inputValue ||
      props.frameObjects[0].inputValue.trim() === "" ||
      SWEAR_REGEX.test(props.frameObjects[0].inputValue) ||
      SENSITIVE_REGEX.test(props.frameObjects[0].inputValue)
    ) {
      updatedFrameObjects[0] = {
        ...updatedFrameObjects[0],
        error: "Используйте нормативную лексику",
      };
      haveErrors = true;
      errorFields.push(0);
    }
  }

  // Валидация второго поля (ссылка)
  if (!linkValue.value || !linkValue.value.includes("https://max.ru")) {
    updatedFrameObjects[1] = {
      ...updatedFrameObjects[1],
      error: "Поле заполнено неверно. Используйте ссылку МАХ",
    };
    haveErrors = true;
    errorFields.push(1);
  }

  // Валидация четвертого поля (организация)
  if (!institutionValue.value || institutionValue.value.trim() === "") {
    updatedFrameObjects[3] = {
      ...updatedFrameObjects[3],
      error: "Поле обязательно для заполнения",
    };
    haveErrors = true;
    errorFields.push(3);
  }

  // Обновляем frameObjects с ошибками
  if (haveErrors) {
    emit("updateFrameObjects", updatedFrameObjects);

    // Скроллим к первому полю с ошибкой на мобильных устройствах
    if (isMobile.value) {
      scrollToFirstError(errorFields);
    }
  }

  return haveErrors;
};

// Следим за изменениями полей и сбрасываем ошибки
watch(
  () => linkValue.value,
  () => {
    if (props.frameObjects[1]?.error) {
      const updatedFrameObjects = [...props.frameObjects];
      updatedFrameObjects[1] = {
        ...updatedFrameObjects[1],
        error: "",
      };
      emit("updateFrameObjects", updatedFrameObjects);
    }
  }
);

watch(
  () => institutionValue.value,
  () => {
    if (props.frameObjects[3]?.error) {
      const updatedFrameObjects = [...props.frameObjects];
      updatedFrameObjects[3] = {
        ...updatedFrameObjects[3],
        error: "",
      };
      emit("updateFrameObjects", updatedFrameObjects);
    }
  }
);

// Обработчик отправки формы
const handleSubmit = async () => {
  // Сначала валидируем локально
  const haveErrors = validateForm();
  if (haveErrors) {
    return;
  }

  try {
    const result = await submitForm();
    if (result) {
      // Сохраняем данные результата
      resData.value.pathImg = result.pathImg;
      resData.value.idLink = result.idLink;

      // Эмитим событие успешного создания
      emit("formSubmitted", result);
    }
  } catch (error) {
    // Эмитим событие ошибки
    emit("formError", error);
  }
};
</script>

<style scoped>
/* Дополнительные стили для точного контроля переноса текста */
/* .text-preview {
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 205px;
  width: 205px;
}

/* Убеждаемся, что текст не выходит за границы */
/* .text-preview span {
  display: block;
  max-width: 100%;
  word-break: break-word;
} */
</style>
