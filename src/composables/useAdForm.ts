import { ref, computed, watch } from "vue";
import axios from "axios";
import { SENSITIVE_REGEX, SWEAR_REGEX } from "@/utils/banRegular";
import type { Organization } from "@/components/ui/SearchableInput.vue";
import { useTemplateForm } from "./useTemplateForm";
import { useTemplateRegistry } from "./useTemplateRegistry";
import type { Template } from "@/types/template";

interface FrameObject {
  num: number;
  title: string;
  help: string;
  selectActive?: string | (() => string);
  selectData?: { name: string; label: string }[];
  inputValue?: string;
  error?: string;
}

const availableRegions = [
  "Алтайский край",
  "Амурская область",
  "Архангельская область",
  "Астраханская область",
  "Белгородская область",
  "Брянская область",
  "Владимирская область",
  "Волгоградская область",
  "Вологодская область",
  "Воронежская область",
  "Донецкая Народная Республика",
  "Еврейская автономная область",
  "Забайкальский край",
  "Запорожская область",
  "Ивановская область",
  "Иркутская область",
  "Кабардино-Балкарская Республика",
  "Калининградская область",
  "Калужская область",
  "Камчатский край",
  "Кемеровская область",
  "Кировская область",
  "Костромская область",
  "Краснодарский край",
  "Красноярский край",
  "Курганская область",
  "Курская область",
  "Ленинградская область",
  "Липецкая область",
  "Луганская Народная Республика",
  "Магаданская область",
  "Москва",
  "Московская область",
  "Мурманская область",
  "Ненецкий автономный округ",
  "Нижегородская область",
  "Новгородская область",
  "Новосибирская область",
  "Омская область",
  "Оренбургская область",
  "Орловская область",
  "Пензенская область",
  "Пермский край",
  "Приморский край",
  "Псковская область",
  "Республика Адыгея",
  "Республика Алтай",
  "Республика Башкортостан",
  "Республика Бурятия",
  "Республика Дагестан",
  "Республика Ингушетия",
  "Республика Калмыкия",
  "Республика Карачаево-Черкесская",
  "Республика Карелия",
  "Республика Коми",
  "Республика Крым",
  "Республика Марий Эл",
  "Республика Мордовия",
  "Республика Саха (Якутия)",
  "Республика Северная Осетия - Алания",
  "Республика Татарстан",
  "Республика Тыва",
  "Республика Хакасия",
  "Ростовская область",
  "Рязанская область",
  "Самарская область",
  "Санкт-Петербург",
  "Саратовская область",
  "Сахалинская область",
  "Свердловская область",
  "Севастополь",
  "Смоленская область",
  "Ставропольский край",
  "Тамбовская область",
  "Тверская область",
  "Томская область",
  "Тульская область",
  "Тюменская область",
  "Удмуртская Республика",
  "Ульяновская область",
  "Хабаровский край",
  "Ханты-Мансийский автономный округ - Югра",
  "Херсонская область",
  "Челябинская область",
  "Чеченская Республика",
  "Чувашская Республика",
  "Чукотский автономный округ",
  "Ямало-Ненецкий автономный округ",
  "Ярославская область",
];

export function useAdForm() {
  const templateForm = useTemplateForm();
  const templateRegistry = useTemplateRegistry();

  const selectedTab = ref(0);
  const selectedTemplate = ref<Template | null>(null);
  const selectedRegion = ref("");
  const linkValue = ref("");
  const institutionValue = ref("");
  const selectedOrganization = ref<Organization | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  const isFailedModalOpen = ref(false);

  const selectedTemplateName = computed({
    get: () => selectedTemplate.value?.name || "",
    set: (value: string) => {
      const template =
        templateRegistry.getTemplateById(value) ||
        templateRegistry.getAllTemplates().find((t) => t.name === value);
      if (template) {
        selectedTemplate.value = template;
        templateForm.initializeForm(template);
      }
    },
  });

  // Инициализируем первый шаблон по умолчанию
  const defaultTemplate = templateRegistry.getAllTemplates()[0];
  if (defaultTemplate && !selectedTemplate.value) {
    selectedTemplate.value = defaultTemplate;
    templateForm.initializeForm(defaultTemplate);
  }

  const frameObjects = ref<FrameObject[]>([
    {
      num: 1,
      title: "Выберите необходимый шаблон объявления",
      help: "список доступных шаблонов",
      selectData: templateRegistry.getAllTemplates().map((t) => ({
        name: t.name,
        label: t.label,
      })),
      selectActive: () => selectedTemplate.value?.name || "",
      inputValue: "",
      error: "",
    },
    {
      num: 2,
      title: "Вставьте ссылку на чат, канал или чат-бот",
      help: "поле для ссылки",
      inputValue: "",
      error: "",
    },
    {
      num: 3,
      title: "Выберите регион",
      help: "список регионов",
      selectData: availableRegions.map((region) => ({
        name: region,
        label: region,
      })),
      selectActive: () => selectedRegion.value,
      error: "",
    },
    {
      num: 4,
      title: "Укажите наименование учреждения или ИНН",
      help: "поле для названия или ИНН",
      inputValue: "",
      error: "",
    },
  ]);

  const handleTabChange = (tab: number) => {
    selectedTab.value = tab;
    if (tab === 1) {
      const defaultTemplate = templateRegistry.getAllTemplates()[0];
      if (defaultTemplate) {
        selectedTemplate.value = defaultTemplate;
        templateForm.initializeForm(defaultTemplate);
      }
    }
    clearAllErrors();
  };

  const handleOrganizationSelect = (organization: Organization) => {
    selectedOrganization.value = organization;
  };

  const clearAllErrors = () => {
    frameObjects.value.forEach((frame) => {
      frame.error = "";
    });
  };

  const validateForm = () => {
    clearAllErrors();
    let haveErrors = false;

    if (selectedTab.value === 1) {
      if (
        !frameObjects.value[0].inputValue ||
        frameObjects.value[0].inputValue.trim() === ""
      ) {
        frameObjects.value[0].error = "Поле обязательно для заполнения";
        haveErrors = true;
      } else {
        const inputText = frameObjects.value[0].inputValue.trim();
        const textWithoutSpaces = inputText.replace(/\s/g, "");

        if (textWithoutSpaces.length > 50) {
          frameObjects.value[0].error = "Максимальная длина текста 50 символов";
          haveErrors = true;
        } else if (
          SWEAR_REGEX.test(textWithoutSpaces) ||
          SENSITIVE_REGEX.test(textWithoutSpaces)
        ) {
          frameObjects.value[0].error = "Используйте нормативную лексику";
          haveErrors = true;
        }
      }
    } else {
      if (!selectedTemplate.value) {
        frameObjects.value[0].error = "Выберите шаблон объявления";
        haveErrors = true;
      }
    }
    // Validation for link field
    const linkPattern = /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/;
    if (selectedTab.value === 1) {
      // For custom template - link is required and must match pattern
      if (
        !linkValue.value ||
        linkValue.value.trim() === "" ||
        !linkPattern.test(linkValue.value.trim())
      ) {
        frameObjects.value[1].error =
          "Неправильный формат ссылки. Введите адрес вида https://max.ru/...";
        haveErrors = true;
      }
    } else if (selectedTab.value === 0) {
      // For predefined template - link is optional, but if provided must match pattern
      if (
        linkValue.value &&
        linkValue.value.trim() !== "" &&
        !linkPattern.test(linkValue.value.trim())
      ) {
        frameObjects.value[1].error =
          "Неправильный формат ссылки. Введите адрес вида https://max.ru/...";
        haveErrors = true;
      }
    }

    if (!selectedRegion.value || selectedRegion.value.trim() === "") {
      frameObjects.value[2].error = "Выберите регион";
      haveErrors = true;
    }

    if (!institutionValue.value || institutionValue.value.trim() === "") {
      frameObjects.value[3].error = "Поле обязательно для заполнения";
      haveErrors = true;
    } else {
      const orgText = institutionValue.value.trim();
      const orgTextWithoutSpaces = orgText.replace(/\s/g, "");
      if (
        SWEAR_REGEX.test(orgTextWithoutSpaces) ||
        SENSITIVE_REGEX.test(orgTextWithoutSpaces)
      ) {
        frameObjects.value[3].error = "Используйте нормативную лексику";
        haveErrors = true;
      }
    }

    return haveErrors;
  };

  const collectFormData = () => {
    const link =
      selectedTab.value === 0
        ? linkValue.value || "https://max.ru/"
        : linkValue.value || "";

    return {
      templateType:
        selectedTab.value === 0 ? selectedTemplate.value?.id || 0 : 0,
      title:
        selectedTab.value === 0
          ? selectedTemplate.value?.description || ""
          : frameObjects.value[0].inputValue || "",
      region: selectedRegion.value || "",
      link: link,
      organization: selectedOrganization.value || { name: "", inn: "" },
    };
  };

  const submitForm = async () => {
    try {
      errorMessage.value = "";
      successMessage.value = "";

      const haveErrors = validateForm();
      if (haveErrors) {
        return;
      }

      isLoading.value = true;
      const formData = collectFormData();

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

      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);

      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  watch(selectedTab, (newVal) => {
    frameObjects.value[0].title =
      newVal === 0
        ? "Выберите необходимый шаблон объявления"
        : "Введите заголовок";

    frameObjects.value[0].help =
      newVal === 0
        ? "список доступных шаблонов"
        : "например, «вступайте в чат первокурсника»";
  });

  watch(linkValue, () => {
    if (frameObjects.value[1].error) {
      frameObjects.value[1].error = "";
    }
  });

  watch(selectedRegion, () => {
    if (frameObjects.value[2].error) {
      frameObjects.value[2].error = "";
    }
  });

  watch(institutionValue, () => {
    if (frameObjects.value[3].error) {
      frameObjects.value[3].error = "";
    }
  });

  watch(selectedTemplate, () => {
    if (frameObjects.value[0].error) {
      frameObjects.value[0].error = "";
    }
  });

  return {
    selectedTab,
    selectedTemplate,
    selectedRegion,
    linkValue,
    institutionValue,
    selectedOrganization,
    isLoading,
    errorMessage,
    successMessage,
    frameObjects,
    isFailedModalOpen,
    selectedTemplateName,
    availableTemplates: templateRegistry.getAllTemplates(),
    availableRegions,
    categories: templateRegistry.categories,
    templateForm,
    templateRegistry,
    handleTabChange,
    handleOrganizationSelect,
    clearAllErrors,
    validateForm,
    collectFormData,
    submitForm,
  };
}
