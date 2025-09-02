<script setup lang="ts">
import DefaultLayout from "@/layouts/default.vue";
import Tabs from "@/components/ui/Tabs.vue";
import AdFrame from "@/components/AdFrame.vue";
import Select from "@/components/ui/Select.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import SearchableInput from "@/components/ui/SearchableInput.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { ref, watch, computed } from "vue";
import axios from "axios";
import type { Organization } from "@/components/ui/SearchableInput.vue";

const tabs = [
  { name: "tab1", label: "Готовые объявления" },
  { name: "tab2", label: "Индивидуальный макет" },
];

const selectedTab = ref(0);
interface FrameObject {
  num: number;
  title: string;
  help: string;
  selectActive?: string;
  selectData?: { name: string; label: string }[];
  inputValue?: string;
}

const availableTemplates = [
  {
    name: "template1",
    label: "Универсальный шаблон",
    text: "максимум возможностей для общения",
  },
  {
    name: "template1",
    label: "Универсальный шаблон 2",
    text: "российский мессенджер для миллионов людей",
  },

  {
    name: "template2",
    label: "Шаблон для МФЦ",
    text: "Чат-бот МФЦ в российском мессенджере MAX",
  },
  {
    name: "template3",
    label: "Шаблон для вузов",
    text: "Твой цифровой студенческий в мессенджере MAX",
  },
  {
    name: "template4",
    label: "Шаблон для вузов 2",
    text: "Нужно подтвердить, что ты студент? Покажи MAX!",
  },
];
const selectedTemplate = ref(availableTemplates[0].name);

// Функция для разделения текста на первую визуальную строку и остальные
function splitTextIntoLines(text: string) {
  // Обрабатываем пустые строки и строки только с пробелами
  if (!text || text.trim() === "") {
    return { firstLine: "", restLines: "" };
  }

  const words = text.trim().split(" ");
  if (words.length <= 1) {
    return { firstLine: text.trim(), restLines: "" };
  }

  // Контейнер: max-w-[205px], font-size: 27px, font-weight: bold
  // Примерная ширина одного символа в пикселях для шрифта 27px bold ≈ 16px
  const charWidth = 16;
  const maxWidth = 205;
  const maxCharsPerLine = Math.floor(maxWidth / charWidth);

  let currentLength = 0;
  let firstLineWords = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordLength = word.length;

    // Добавляем пробел перед словом (кроме первого)
    const spaceLength = i > 0 ? 1 : 0;
    const totalLength = currentLength + spaceLength + wordLength;

    // Если слово помещается в строку
    if (totalLength <= maxCharsPerLine) {
      currentLength = totalLength;
      firstLineWords = i + 1;
    } else {
      // Если слово не помещается, останавливаемся
      break;
    }
  }

  // Если ни одно слово не поместилось, берем хотя бы первое
  if (firstLineWords === 0) {
    firstLineWords = 1;
  }

  const firstLine = words.slice(0, firstLineWords).join(" ");
  const restLines = words.slice(firstLineWords).join(" ");

  return { firstLine, restLines };
}

// Вычисляемое свойство для текущего текста шаблона
const currentTemplateText = computed(() => {
  if (selectedTab.value === 1) {
    // Для индивидуального макета берем текст из инпута
    const inputText = frameObjects.value[0].inputValue || "";
    console.log("Current input text:", inputText);
    return inputText;
  }
  // Для готовых объявлений берем текст из выбранного шаблона
  const template = availableTemplates.find(
    (template) => template.name === selectedTemplate.value
  );
  return template?.text || "";
});

// Вычисляемое свойство для разделенного текста
const splitText = computed(() => {
  return splitTextIntoLines(currentTemplateText.value);
});

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
const selectedRegion = ref();

// Реактивные ссылки для полей ввода
const linkValue = ref("");
const institutionValue = ref("");
const selectedOrganization = ref<Organization | null>(null);

// Состояние загрузки и ошибок
const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const generatedImageUrl = ref("");

// Обработчик выбора организации
const handleOrganizationSelect = (organization: Organization) => {
  selectedOrganization.value = organization;
  console.log("Выбрана организация:", organization);
};

const frameObjects = ref<FrameObject[]>([
  {
    num: 1,
    title: "Выберите необходимый шаблон объявления",

    help: "список доступных шаблонов",
    selectData: availableTemplates,
    selectActive: selectedTemplate.value,
    inputValue: "",
  },
  {
    num: 2,
    title: "Вставьте ссылку на чат, канал или чат-бот",
    help: "поле для ссылки",
    inputValue: "",
  },
  {
    num: 3,
    title: "Выберите регион",
    help: "список регионов",
    selectData: availableRegions.map((region) => ({
      name: region,
      label: region,
    })),
    selectActive: selectedRegion.value,
  },
  {
    num: 4,
    title: "Укажите наименование учреждения или ИНН",
    help: "поле для названия или ИНН",
    inputValue: "",
  },
]);

const handleTabChange = (tab: number) => {
  selectedTab.value = tab;
  selectedTemplate.value = availableTemplates[0].name;
};

// Функция валидации формы
const validateForm = () => {
  const errors = [];

  // Проверяем, что выбран тип объявления
  if (selectedTab.value === 0) {
    if (!selectedTemplate.value) {
      errors.push("Выберите шаблон объявления");
    }
  } else {
    if (!frameObjects.value[0].inputValue?.trim()) {
      errors.push("Введите заголовок объявления");
    }
  }

  // Проверяем регион
  if (!selectedRegion.value) {
    errors.push("Выберите регион");
  }

  return errors;
};

// Функция для сбора всех данных формы
const collectFormData = () => {
  const formData = {
    // Основные настройки
    templateType: selectedTab.value === 0 ? "1" : "2",

    // Данные шаблона или кастомного текста
    title:
      selectedTab.value === 0
        ? availableTemplates.find((t) => t.name === selectedTemplate.value)
            ?.text || ""
        : frameObjects.value[0].inputValue || "",

    // Региональные настройки
    region: selectedRegion.value || "",
    link: linkValue.value || "",
    // Организация
    organization: selectedOrganization.value || { name: "", inn: "" },
  };

  return formData;
};

// Функция для отправки данных на бэкенд
const submitForm = async () => {
  try {
    // Сбрасываем предыдущие сообщения
    errorMessage.value = "";
    successMessage.value = "";

    // Валидируем форму
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      errorMessage.value = validationErrors.join(", ");
      return;
    }

    isLoading.value = true;

    const formData = collectFormData();

    console.log("Отправляем данные:", formData);

    // Отправляем POST запрос на бэкенд
    const response = await axios.post(
      "https://test333.na4u.ru/api/qr/create",
      {
        title: formData.title,
        link: formData.link,
        region: formData.region,
        companyName: formData.organization.name,
        companyInn: formData.organization.inn,
        templateType: formData.templateType,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Ответ от сервера:", response.data);

    // Сохраняем URL сгенерированного изображения
    if (response.data.pathImg) {
      generatedImageUrl.value = response.data.pathImg;
    }

    // Показываем сообщение об успехе
    successMessage.value = "Объявление успешно создано!";

    // Очищаем форму через 2 секунды
    setTimeout(() => {
      successMessage.value = "";
    }, 3000);

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных:", error);

    // Показываем сообщение об ошибке
    if (axios.isAxiosError(error)) {
      errorMessage.value =
        error.response?.data?.message ||
        "Произошла ошибка при создании объявления";
    } else {
      errorMessage.value = "Произошла неизвестная ошибка";
    }

    // Очищаем сообщение об ошибке через 5 секунд
    setTimeout(() => {
      errorMessage.value = "";
    }, 5000);
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
</script>
<template>
  <DefaultLayout>
    <div class="mt-[50px]">
      <Tabs :tabs="tabs" v-model="selectedTab" @change="handleTabChange" />
    </div>
    <div
      class="bg-bg-frame rounded-[16px] w-full py-[44px] px-[60px] flex flex-col gap-[35px] mt-[20px] relative"
    >
      <div
        class="flex flex-col absolute top-[122px] right-[74px] max-w-[450px] max-h-[291px] w-full h-full"
      >
        <div
          class="bg-[url('/src/assets/editable-frame.svg')] bg-cover w-full h-full rounded-[8px] flex flex-col px-[20px] pt-[34px] pb-[19px] justify-between"
        >
          <h4
            class="text-[27px] font-bold max-w-[205px] text-white leading-[100%] flex flex-col"
          >
            <span v-if="splitText.firstLine" class="text-gradient">{{
              splitText.firstLine
            }}</span>
            <span v-if="splitText.restLines" class="text-white">{{
              splitText.restLines
            }}</span>
            <span
              v-if="!splitText.firstLine && !splitText.restLines"
              class="text-white opacity-50"
            >
              {{ selectedTab === 1 ? "Введите заголовок" : "Выберите шаблон" }}
            </span>
          </h4>
          <div class="flex gap-[10px] items-center">
            <img
              :src="generatedImageUrl || '/src/assets/preview.svg'"
              alt="Предпросмотр QR-кода"
              width="71"
              class="rounded"
            />
            <div class="flex flex-col leading-[120%]">
              <p class="text-white text-[19px] max-w-[100px]">скачайте тут</p>
            </div>
          </div>
        </div>
        <p class="text-tabs-inactive text-[14px] mx-auto">предпросмотр</p>
      </div>
      <div v-for="frameObject in frameObjects" :key="frameObject.num">
        <AdFrame
          :num="frameObject.num"
          :title="frameObject.title"
          :help="frameObject.help"
          :selectActive="frameObject.selectActive"
          :selectData="frameObject.selectData"
          :selectedTab="selectedTab"
        />
        <div class="mt-2 max-w-[645px]">
          <Input
            v-if="frameObject.num === 1 && selectedTab === 1"
            v-model="frameObject.inputValue!"
            placeholder="Введите заголовок"
          />
          <Select
            v-else-if="frameObject.num === 1 && selectedTab === 0"
            :options="frameObject.selectData!"
            v-model="selectedTemplate"
          />
          <SearchableSelect
            v-if="frameObject.num === 3"
            :options="availableRegions"
            v-model="selectedRegion"
            placeholder="Выберите регион"
          />
          <Input
            v-if="frameObject.num === 2"
            v-model="linkValue"
            placeholder="Введите ссылку на чат, канал или чат-бот"
          />
          <SearchableInput
            v-if="frameObject.num === 4"
            v-model="institutionValue"
            @select="handleOrganizationSelect"
            placeholder="Введите ИНН или название организации"
            :debounce-ms="500"
          />
        </div>
      </div>

      <!-- Сообщения об успехе и ошибках -->
      <div
        v-if="successMessage"
        class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded"
      >
        {{ successMessage }}
      </div>
      <div
        v-if="errorMessage"
        class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        {{ errorMessage }}
      </div>

      <Button
        variant="primary"
        class="mobile:max-w-full max-w-[143px] w-full"
        @click="submitForm"
        :disabled="isLoading"
      >
        {{ isLoading ? "Создание..." : "Создать" }}
      </Button>
    </div>
  </DefaultLayout>
</template>

<style scoped></style>
