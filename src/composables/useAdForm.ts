import { ref, computed, watch } from "vue";
import axios from "axios";
import { SENSITIVE_REGEX, SWEAR_REGEX } from "@/utils/banRegular";
import type { Organization } from "@/components/ui/SearchableInput.vue";

// Интерфейсы
interface FrameObject {
  num: number;
  title: string;
  help: string;
  selectActive?: string | (() => string);
  selectData?: { name: string; label: string }[];
  inputValue?: string;
  error?: string;
}

interface Template {
  id: number;
  name: string;
  label: string;
  img: string;
  text: string;
}

// Данные шаблонов
const availableTemplates: Template[] = [
  {
    id: 1,
    name: "template1",
    label: "Универсальный шаблон",
    img: "/assets/template1.png",
    text: "максимум возможностей для общения",
  },
  {
    id: 2,
    name: "template2",
    label: "Универсальный шаблон 2",
    img: "/assets/template2.png",
    text: "российский мессенджер для миллионов людей",
  },
  {
    id: 3,
    name: "template3",
    label: "Шаблон для МФЦ",
    img: "/assets/template3.png",
    text: "Чат-бот МФЦ в российском мессенджере MAX",
  },
  {
    id: 4,
    name: "template4",
    label: "Шаблон для вузов",
    img: "/assets/template4.png",
    text: "Твой цифровой студенческий в мессенджере MAX",
  },
  {
    id: 5,
    name: "template5",
    label: "Шаблон для вузов 2",
    img: "/assets/template5.png",
    text: "Нужно подтвердить, что ты студент? Покажи MAX!",
  },
];

// Данные регионов
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
  "ДНР",
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
  "ЛНР",
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
  // Состояние
  const selectedTab = ref(0);
  const selectedTemplate = ref(availableTemplates[0]);
  const selectedRegion = ref("");
  const linkValue = ref("");
  const institutionValue = ref("");
  const selectedOrganization = ref<Organization | null>(null);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");
  const isFailedModalOpen = ref(false);

  // Вычисляемые свойства
  const selectedTemplateName = computed({
    get: () => selectedTemplate.value?.name || "",
    set: (value: string) => {
      const template = availableTemplates.find((t) => t.name === value);
      if (template) {
        selectedTemplate.value = template;
        console.log("Выбран шаблон:", template);
      }
    },
  });

  // Объекты полей формы
  const frameObjects = ref<FrameObject[]>([
    {
      num: 1,
      title: "Выберите необходимый шаблон объявления",
      help: "список доступных шаблонов",
      selectData: availableTemplates,
      selectActive: () => selectedTemplate.value?.name,
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

  // Функции
  const handleTabChange = (tab: number) => {
    selectedTab.value = tab;
    // Сбрасываем шаблон только при переключении на индивидуальный макет
    if (tab === 1) {
      selectedTemplate.value = availableTemplates[0];
    }
    clearAllErrors();
  };

  const handleOrganizationSelect = (organization: Organization) => {
    selectedOrganization.value = organization;
    console.log("Выбрана организация:", organization);
  };

  const clearAllErrors = () => {
    frameObjects.value.forEach((frame) => {
      frame.error = "";
    });
  };

  const validateForm = () => {
    clearAllErrors();
    let haveErrors = false;

    // Валидация для первого поля (заголовок или шаблон)
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
          SWEAR_REGEX.test(inputText) ||
          SENSITIVE_REGEX.test(inputText)
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
    // Валидация ссылки
    if (
      !linkValue.value ||
      linkValue.value.trim() === "" ||
      !linkValue.value.includes("https://max.ru")
    ) {
      frameObjects.value[1].error =
        "Поле заполнено неверно. Используйте ссылку МАХ";
      haveErrors = true;
    }

    // Валидация региона
    console.log(
      "Валидация региона - selectedRegion.value:",
      selectedRegion.value
    );
    if (!selectedRegion.value || selectedRegion.value.trim() === "") {
      console.log("Регион не выбран, устанавливаем ошибку");
      frameObjects.value[2].error = "Выберите регион";
      haveErrors = true;
    }

    // Валидация организации
    if (!institutionValue.value || institutionValue.value.trim() === "") {
      frameObjects.value[3].error = "Поле обязательно для заполнения";
      haveErrors = true;
    } else {
      const orgText = institutionValue.value.trim();
      if (SWEAR_REGEX.test(orgText) || SENSITIVE_REGEX.test(orgText)) {
        frameObjects.value[3].error = "Используйте нормативную лексику";
        haveErrors = true;
      }
    }

    return haveErrors;
  };

  const collectFormData = () => {
    return {
      templateType: selectedTab.value === 0 ? selectedTemplate.value.id : 0,
      title:
        selectedTab.value === 0
          ? selectedTemplate.value?.text || ""
          : frameObjects.value[0].inputValue || "",
      region: selectedRegion.value || "",
      link: linkValue.value || "",
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

      console.log("Отправляем данные:", formData);

      const response = await axios.post(
        "https://test333.na4u.ru/api/qr/create",
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

      console.log("Ответ от сервера:", response.data);
      return response.data;
    } catch (error) {
      console.error("Ошибка при отправке данных:", error);

      // Выбрасываем ошибку для обработки в AdForm.vue
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  // Watchers
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
    // Состояние
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

    // Вычисляемые свойства
    selectedTemplateName,

    // Данные
    availableTemplates,
    availableRegions,

    // Функции
    handleTabChange,
    handleOrganizationSelect,
    clearAllErrors,
    validateForm,
    collectFormData,
    submitForm,
  };
}
