// Примеры новых шаблонов для демонстрации расширяемости системы
import type { Template } from "@/types/template";

// Шаблон для канала московского долголетия
export const moscowLongevityTemplate: Template = {
  id: "moscow-longevity",
  name: "moscow-longevity",
  label: "Канал московского долголетия",
  description: "Активная жизнь в любом возрасте с MAX",
  category: "government",
  image: "/assets/template1.png",
  serverId: 6,
  design: {
    id: "moscow-longevity-design",
    name: "Moscow Longevity Design",
    backgroundImage: "/assets/template1.png",
    qrCodePosition: {
      desktop: {
        x: 22,
        y: 44,
        width: 75,
        height: 75,
      },
      mobile: {
        x: 12,
        y: 53,
        width: 45,
        height: 45,
      },
    },
    textPosition: {
      desktop: {
        x: 20,
        y: 34,
        maxWidth: 205,
        fontSize: 27,
        color: "#ffffff",
      },
      mobile: {
        x: 20,
        y: 20,
        maxWidth: 130,
        fontSize: 16,
        color: "#ffffff",
      },
    },
  },
  fields: [
    {
      id: "link",
      name: "link",
      label: "Ссылка на канал долголетия",
      type: "url",
      required: true,
      placeholder: "Введите ссылку на канал",
      validation: {
        pattern: /https:\/\/max\.ru/,
        message: "Поле заполнено неверно. Используйте ссылку MAX",
      },
      help: "поле для ссылки на канал",
    },
    {
      id: "region",
      name: "region",
      label: "Регион",
      type: "select",
      required: true,
      placeholder: "Выберите регион",
      help: "список регионов",
    },
    {
      id: "center_name",
      name: "center_name",
      label: "Название центра долголетия",
      type: "text",
      required: true,
      placeholder: "Введите название центра",
      help: "поле для названия центра",
    },
    {
      id: "age_group",
      name: "age_group",
      label: "Возрастная группа",
      type: "select",
      required: false,
      placeholder: "Выберите возрастную группу",
      options: [
        { value: "50-60", label: "50-60 лет" },
        { value: "60-70", label: "60-70 лет" },
        { value: "70+", label: "70+ лет" },
      ],
      help: "выбор возрастной группы",
    },
  ],
  metadata: {
    version: "1.0.0",
    author: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Шаблон для пушкинской карты
export const pushkinCardTemplate: Template = {
  id: "pushkin-card",
  name: "pushkin-card",
  label: "Пушкинская карта",
  description: "Культурные события с Пушкинской картой в MAX",
  category: "government",
  image: "/assets/template2.png",
  serverId: 7,
  design: {
    id: "pushkin-card-design",
    name: "Pushkin Card Design",
    backgroundImage: "/assets/template2.png",
    qrCodePosition: {
      desktop: {
        x: 22,
        y: 44,
        width: 75,
        height: 75,
      },
      mobile: {
        x: 12,
        y: 53,
        width: 45,
        height: 45,
      },
    },
    textPosition: {
      desktop: {
        x: 20,
        y: 34,
        maxWidth: 205,
        fontSize: 27,
        color: "#ffffff",
      },
      mobile: {
        x: 20,
        y: 20,
        maxWidth: 130,
        fontSize: 16,
        color: "#ffffff",
      },
    },
  },
  fields: [
    {
      id: "link",
      name: "link",
      label: "Ссылка на чат Пушкинской карты",
      type: "url",
      required: true,
      placeholder: "Введите ссылку на чат",
      validation: {
        pattern: /https:\/\/max\.ru/,
        message: "Поле заполнено неверно. Используйте ссылку MAX",
      },
      help: "поле для ссылки на чат",
    },
    {
      id: "region",
      name: "region",
      label: "Регион",
      type: "select",
      required: true,
      placeholder: "Выберите регион",
      help: "список регионов",
    },
    {
      id: "cultural_institution",
      name: "cultural_institution",
      label: "Культурное учреждение",
      type: "text",
      required: true,
      placeholder: "Введите название учреждения",
      help: "поле для названия учреждения",
    },
    {
      id: "event_type",
      name: "event_type",
      label: "Тип мероприятия",
      type: "select",
      required: false,
      placeholder: "Выберите тип мероприятия",
      options: [
        { value: "theater", label: "Театр" },
        { value: "museum", label: "Музей" },
        { value: "concert", label: "Концерт" },
        { value: "exhibition", label: "Выставка" },
        { value: "cinema", label: "Кино" },
      ],
      help: "выбор типа мероприятия",
    },
  ],
  metadata: {
    version: "1.0.0",
    author: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Шаблон для домового чата
export const houseChatTemplate: Template = {
  id: "house-chat",
  name: "house-chat",
  label: "Чат с управляющей организацией",
  description: "Общение с соседями в домовом чате MAX",
  category: "business",
  image: "/assets/template3.png",
  serverId: 8,
  design: {
    id: "house-chat-design",
    name: "House Chat Design",
    backgroundImage: "/assets/template3.png",
    qrCodePosition: {
      desktop: {
        x: 22,
        y: 44,
        width: 75,
        height: 75,
      },
      mobile: {
        x: 12,
        y: 53,
        width: 45,
        height: 45,
      },
    },
    textPosition: {
      desktop: {
        x: 20,
        y: 34,
        maxWidth: 205,
        fontSize: 27,
        color: "#ffffff",
      },
      mobile: {
        x: 20,
        y: 20,
        maxWidth: 130,
        fontSize: 16,
        color: "#ffffff",
      },
    },
  },
  fields: [
    {
      id: "link",
      name: "link",
      label: "Ссылка на Чат с управляющей организацией",
      type: "url",
      required: true,
      placeholder: "Введите ссылку на чат",
      validation: {
        pattern: /https:\/\/max\.ru/,
        message: "Поле заполнено неверно. Используйте ссылку MAX",
      },
      help: "поле для ссылки на чат",
    },
    {
      id: "region",
      name: "region",
      label: "Регион",
      type: "select",
      required: true,
      placeholder: "Выберите регион",
      help: "список регионов",
    },
    {
      id: "building_address",
      name: "building_address",
      label: "Адрес дома",
      type: "text",
      required: true,
      placeholder: "Введите адрес дома",
      help: "поле для адреса дома",
    },
    {
      id: "management_company",
      name: "management_company",
      label: "Управляющая компания",
      type: "text",
      required: false,
      placeholder: "Введите название УК",
      help: "поле для названия УК",
    },
    {
      id: "building_type",
      name: "building_type",
      label: "Тип дома",
      type: "select",
      required: false,
      placeholder: "Выберите тип дома",
      options: [
        { value: "apartment", label: "Многоквартирный дом" },
        { value: "townhouse", label: "Таунхаус" },
        { value: "cottage", label: "Коттеджный поселок" },
      ],
      help: "выбор типа дома",
    },
  ],
  metadata: {
    version: "1.0.0",
    author: "System",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

// Функция для регистрации новых шаблонов
export function registerExampleTemplates(templateRegistry: any) {
  templateRegistry.registerTemplate(moscowLongevityTemplate);
  templateRegistry.registerTemplate(pushkinCardTemplate);
  templateRegistry.registerTemplate(houseChatTemplate);
}
