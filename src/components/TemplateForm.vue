<script setup lang="ts">
import { computed, watch } from "vue";
import axios from "axios";
import { SENSITIVE_REGEX, SWEAR_REGEX } from "@/utils/banRegular";
import Tabs from "@/components/ui/Tabs.vue";
import { useDeviceDetection } from "@/composables/useDeviceDetection";
import AdFrame from "@/components/AdFrame.vue";
import TemplateSelector from "@/components/TemplateSelector.vue";
import TemplateFieldRenderer from "@/components/TemplateFieldRenderer.vue";
import Button from "@/components/ui/Button.vue";
import Input from "@/components/ui/Input.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import SearchableInput from "@/components/ui/SearchableInput.vue";
import { useAdForm } from "@/composables/useAdForm";
import { usePdfGeneration } from "@/composables/usePdfGeneration";
import { useMobileScroll } from "@/composables/useMobileScroll";
import { splitTextIntoLines } from "@/composables/useTextProcessing";

interface Props {
  selectedTab: any;
  selectedTemplate: any;
  frameObjects: any;
}

const props = defineProps<Props>();

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

const {
  selectedRegion,
  linkValue,
  institutionValue,
  selectedOrganization,
  isLoading,
  availableRegions,
  availableTemplates,
  templateForm,
  handleOrganizationSelect,
} = useAdForm();

const { scrollToFirstError } = useMobileScroll();
const { resData, handleImageError } = usePdfGeneration();
const { isMobile } = useDeviceDetection();

const handleTabChange = (tab: number) => {
  emit("updateSelectedTab", tab);
  if (tab === 1) {
    emit("updateSelectedTemplate", availableTemplates[0]);
  }
  clearErrors();
};

const handleTemplateChange = (templateName: string) => {
  const template = availableTemplates.find((t) => t.name === templateName);
  if (template) {
    emit("updateSelectedTemplate", template);
    templateForm.initializeForm(template);
    clearErrors();
  }
};

const localSelectedTemplateName = computed({
  get: () => props.selectedTemplate?.name || "",
  set: (value: string) => {
    handleTemplateChange(value);
  },
});

const handleInputChange = (frameIndex: number, value: string) => {
  const updatedFrameObjects = [...props.frameObjects];
  updatedFrameObjects[frameIndex] = {
    ...updatedFrameObjects[frameIndex],
    inputValue: value,
    error: "",
  };
  emit("updateFrameObjects", updatedFrameObjects);
};

const splitText = computed(() => {
  let text = "";
  if (props.selectedTab === 1) {
    text = props.frameObjects[0]?.inputValue || "";
  } else {
    text = props.selectedTemplate?.description || "";
  }
  return splitTextIntoLines(text);
});

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

  if (props.selectedTab === 1) {
    if (
      !props.frameObjects[0].inputValue ||
      props.frameObjects[0].inputValue.trim() === ""
    ) {
      updatedFrameObjects[0] = {
        ...updatedFrameObjects[0],
        error: "Поле обязательно для заполнения",
      };
      haveErrors = true;
      errorFields.push(0);
    } else {
      const inputText = props.frameObjects[0].inputValue.trim();
      const textWithoutSpaces = inputText.replace(/\s/g, "");

      if (textWithoutSpaces.length > 50) {
        updatedFrameObjects[0] = {
          ...updatedFrameObjects[0],
          error: "Максимальная длина текста 50 символов",
        };
        haveErrors = true;
        errorFields.push(0);
      } else if (
        SWEAR_REGEX.test(textWithoutSpaces) ||
        SENSITIVE_REGEX.test(textWithoutSpaces)
      ) {
        updatedFrameObjects[0] = {
          ...updatedFrameObjects[0],
          error: "Используйте нормативную лексику",
        };
        haveErrors = true;
        errorFields.push(0);
      }
    }
  }

  // Validation for link field
  const linkPattern = /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/;
  if (props.selectedTab === 1) {
    // For custom template - link is required and must match pattern
    if (
      !linkValue.value ||
      linkValue.value.trim() === "" ||
      !linkPattern.test(linkValue.value.trim())
    ) {
      updatedFrameObjects[1] = {
        ...updatedFrameObjects[1],
        error:
          "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
      };
      haveErrors = true;
      errorFields.push(1);
    }
  } else if (props.selectedTab === 0) {
    // For predefined template - link is optional, but if provided must match pattern
    if (
      linkValue.value &&
      linkValue.value.trim() !== "" &&
      !linkPattern.test(linkValue.value.trim())
    ) {
      updatedFrameObjects[1] = {
        ...updatedFrameObjects[1],
        error:
          "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
      };
      haveErrors = true;
      errorFields.push(1);
    }
  }

  if (!selectedRegion.value || selectedRegion.value.trim() === "") {
    updatedFrameObjects[2] = {
      ...updatedFrameObjects[2],
      error: "Выберите регион",
    };
    haveErrors = true;
    errorFields.push(2);
  }

  if (!institutionValue.value || institutionValue.value.trim() === "") {
    updatedFrameObjects[3] = {
      ...updatedFrameObjects[3],
      error: "Поле обязательно для заполнения",
    };
    haveErrors = true;
    errorFields.push(3);
  }

  if (haveErrors) {
    emit("updateFrameObjects", updatedFrameObjects);
    scrollToFirstError(errorFields);
  }

  return haveErrors;
};

const handleSubmit = async () => {
  const haveErrors = validateForm();
  if (haveErrors) {
    return;
  }

  try {
    // Собираем данные из новой системы шаблонов
    let formData;
    if (props.selectedTab === 0 && templateForm.isFormInitialized) {
      // Для готовых шаблонов используем данные из templateForm
      formData = {
        templateType: props.selectedTemplate?.serverId || 0,
        title: props.selectedTemplate?.description || "",
        region: templateForm.getFieldValue("region") || selectedRegion.value,
        link:
          templateForm.getFieldValue("link") ||
          linkValue.value ||
          "https://max.ru/",
        organization: selectedOrganization.value || { name: "", inn: "" },
      };
    } else {
      // Для индивидуального макета используем старую логику
      formData = {
        templateType: 0,
        title: props.frameObjects[0]?.inputValue || "",
        region: selectedRegion.value,
        link: linkValue.value || "https://max.ru/",
        organization: selectedOrganization.value || { name: "", inn: "" },
      };
    }

    // Отправляем данные напрямую
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/qr/create`,
      {
        title: formData.title,
        link: formData.link,
        region: formData.region,
        companyName: formData.organization.name,
        companyInn: Number(formData.organization.inn),
        templateType: Number(formData.templateType),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.qrCodeBase64) {
      const base64Data = response.data.qrCodeBase64;
      response.data.pathImg = base64Data;
    }

    console.log("Response data:", response.data);
    console.log("Form data sent:", formData);

    resData.value.pathImg = response.data.pathImg;
    resData.value.idLink = response.data.idLink;
    emit("formSubmitted", response.data);
  } catch (error) {
    emit("formError", error);
  }
};

// Watchers для очистки ошибок
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
  () => selectedRegion.value,
  () => {
    if (props.frameObjects[2]?.error) {
      const updatedFrameObjects = [...props.frameObjects];
      updatedFrameObjects[2] = {
        ...updatedFrameObjects[2],
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
</script>

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
      <!-- Поле выбора шаблона или ввода заголовка -->
      <div>
        <AdFrame
          :num="1"
          :title="
            props.selectedTab === 0
              ? 'Выберите необходимый шаблон объявления'
              : 'Введите заголовок'
          "
          :help="
            props.selectedTab === 0
              ? 'список доступных шаблонов'
              : 'например, «вступайте в чат первокурсника»'
          "
        />
        <div class="mt-2 max-w-[645px]">
          <!-- Индивидуальный макет -->
          <Input
            v-if="props.selectedTab === 1"
            :model-value="props.frameObjects[0]?.inputValue || ''"
            @update:model-value="(value: any) => handleInputChange(0, value)"
            :error="props.frameObjects[0]?.error"
            placeholder="Введите заголовок"
            maxlength="50"
            data-field-index="0"
          />
          <!-- Готовые шаблоны -->
          <TemplateSelector
            v-else
            :templates="availableTemplates"
            v-model="localSelectedTemplateName"
            :error="props.frameObjects[0]?.error"
          />
        </div>
      </div>

      <!-- Динамические поля шаблона -->
      <div
        v-if="
          props.selectedTab === 0 &&
          templateForm.isFormInitialized &&
          Array.isArray(templateForm.templateFields)
        "
      >
        <div
          v-for="(field, index) in templateForm.templateFields"
          :key="field.id"
        >
          <AdFrame
            :num="index + 2"
            :title="field.label"
            :help="field.help || ''"
          />
          <div class="mt-2 max-w-[645px]">
            <TemplateFieldRenderer
              :field="field"
              :model-value="templateForm.getFieldValue(field.id)"
              @update:model-value="
                (value: any) => templateForm.setFieldValue(field.id, value)
              "
              @select="handleOrganizationSelect"
              :error="templateForm.getFieldError(field.id)"
              :available-regions="
                availableRegions.map((region: any) => ({
                  name: region,
                  label: region,
                }))
              "
            />
          </div>
        </div>
      </div>

      <!-- Статические поля для готовых шаблонов -->
      <template v-if="props.selectedTab === 0">
        <!-- Ссылка -->
        <div>
          <AdFrame
            :num="2"
            title="Вставьте ссылку на чат, канал или чат-бот"
            help="поле для ссылки"
          />
          <div class="mt-2 max-w-[645px]">
            <Input
              v-model="linkValue"
              placeholder="Введите ссылку на чат, канал или чат-бот"
              :error="props.frameObjects[1]?.error"
              data-field-index="1"
            />
          </div>
        </div>

        <!-- Регион -->
        <div>
          <AdFrame :num="3" title="Выберите регион" help="список регионов" />
          <div class="mt-2 max-w-[645px]">
            <SearchableSelect
              :options="availableRegions"
              v-model="selectedRegion"
              placeholder="Введите название региона"
              :error="props.frameObjects[2]?.error"
              data-field-index="2"
            />
          </div>
        </div>

        <!-- Организация -->
        <div>
          <AdFrame
            :num="4"
            title="Укажите наименование учреждения или ИНН"
            help="поле для названия или ИНН"
          />
          <div class="mt-2 max-w-[645px]">
            <SearchableInput
              v-model="institutionValue"
              @select="handleOrganizationSelect"
              placeholder="Введите ИНН или название организации"
              :debounce-ms="500"
              :error="props.frameObjects[3]?.error"
              data-field-index="3"
            />
          </div>
        </div>
      </template>

      <!-- Статические поля для индивидуального макета -->
      <template v-if="props.selectedTab === 1">
        <!-- Ссылка -->
        <div>
          <AdFrame
            :num="2"
            title="Вставьте ссылку на чат, канал или чат-бот"
            help="поле для ссылки"
          />
          <div class="mt-2 max-w-[645px]">
            <Input
              v-model="linkValue"
              placeholder="Введите ссылку на чат, канал или чат-бот"
              :error="props.frameObjects[1]?.error"
              data-field-index="1"
            />
          </div>
        </div>

        <!-- Регион -->
        <div>
          <AdFrame :num="3" title="Выберите регион" help="список регионов" />
          <div class="mt-2 max-w-[645px]">
            <SearchableSelect
              :options="availableRegions"
              v-model="selectedRegion"
              placeholder="Введите название региона"
              :error="props.frameObjects[2]?.error"
              data-field-index="2"
            />
          </div>
        </div>

        <!-- Организация -->
        <div>
          <AdFrame
            :num="4"
            title="Укажите наименование учреждения или ИНН"
            help="поле для названия или ИНН"
          />
          <div class="mt-2 max-w-[645px]">
            <SearchableInput
              v-model="institutionValue"
              @select="handleOrganizationSelect"
              placeholder="Введите ИНН или название организации"
              :debounce-ms="500"
              :error="props.frameObjects[3]?.error"
              data-field-index="3"
            />
          </div>
        </div>
      </template>

      <!-- Предпросмотр -->
      <div
        class="flex flex-col absolute top-[122px] right-[74px] max-w-[450px] h-[330px] w-full mobile:static mobile:h-[250px] mobile:w-[280px] mobile:mx-auto"
        v-if="props.selectedTab === 1"
      >
        <div
          class="bg-[url('/assets/editable-frame.png')] bg-cover mobile:bg-contain bg-no-repeat bg-centerw-full h-full desktop:rounded-[8px] flex flex-col px-[20px] pt-[34px] pb-[19px] justify-between mobile:relative"
        >
          <h4
            class="font-bold text-white leading-[100%] flex flex-col break-words text-preview mobile:max-w-[130px] mobile:text-[16px] -ml-[2px] mobile:-ml-[8px]"
            :style="{
              fontSize: `${
                isMobile
                  ? props.selectedTemplate?.design?.textPosition?.mobile
                      ?.fontSize || 16
                  : props.selectedTemplate?.design?.textPosition?.desktop
                      ?.fontSize || 27
              }px`,
              maxWidth: `${
                isMobile
                  ? props.selectedTemplate?.design?.textPosition?.mobile
                      ?.maxWidth || 130
                  : props.selectedTemplate?.design?.textPosition?.desktop
                      ?.maxWidth || 205
              }px`,
              color: isMobile
                ? props.selectedTemplate?.design?.textPosition?.mobile?.color ||
                  '#ffffff'
                : props.selectedTemplate?.design?.textPosition?.desktop
                    ?.color || '#ffffff',
            }"
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
          <div class="flex gap-[10px] items-center">
            <img
              :src="resData.pathImg || '/assets/preview.svg'"
              alt="Предпросмотр QR-кода"
              class="rounded absolute mobile:w-[45px] mobile:h-[45px] mobile:left-[12px] mobile:bottom-[53px]"
              :style="{
                width: `${isMobile ? 45 : 75}px`,
                height: `${isMobile ? 45 : 75}px`,
                bottom: `${isMobile ? 53 : 44}px`,
                left: `${isMobile ? 12 : 22}px`,
              }"
              @error="handleImageError"
            />
          </div>
        </div>
        <p class="text-tabs-inactive text-[14px] mx-auto">предпросмотр</p>
      </div>

      <div
        v-if="props.selectedTab !== 1"
        class="flex flex-col absolute top-[122px] right-[74px] max-w-[450px] h-[330px] w-full mobile:static mobile:h-[250px] mobile:w-[280px] mobile:mx-auto"
      >
        <div
          class="bg-contain bg-no-repeat bg-center w-full h-full rounded-[12px] flex flex-col px-[20px] justify-between mobile:relative"
          :style="{
            backgroundImage: `url(${props.selectedTemplate?.image})`,
          }"
        >
          <div class="flex gap-[10px] items-center">
            <img
              :src="resData.pathImg || '/assets/preview.svg'"
              alt="Предпросмотр QR-кода"
              class="rounded absolute mobile:w-[45px] mobile:h-[45px] mobile:left-[12px] mobile:bottom-[40px]"
              :style="{
                width: `${
                  isMobile
                    ? props.selectedTemplate?.design?.qrCodePosition?.mobile
                        ?.width || 45
                    : props.selectedTemplate?.design?.qrCodePosition?.desktop
                        ?.width || 75
                }px`,
                height: `${
                  isMobile
                    ? props.selectedTemplate?.design?.qrCodePosition?.mobile
                        ?.height || 45
                    : props.selectedTemplate?.design?.qrCodePosition?.desktop
                        ?.height || 75
                }px`,
                bottom: `${
                  isMobile
                    ? props.selectedTemplate?.design?.qrCodePosition?.mobile
                        ?.y || 40
                    : props.selectedTemplate?.design?.qrCodePosition?.desktop
                        ?.y || 44
                }px`,
                left: `${
                  isMobile
                    ? props.selectedTemplate?.design?.qrCodePosition?.mobile
                        ?.x || 12
                    : props.selectedTemplate?.design?.qrCodePosition?.desktop
                        ?.x || 22
                }px`,
              }"
              @error="handleImageError"
            />
          </div>
        </div>
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
