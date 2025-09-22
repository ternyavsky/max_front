import { ref } from "vue";
import type {
  Template,
  TemplateCategory,
  TemplateRegistry,
} from "@/types/template";

const categories: TemplateCategory[] = [];

const baseTemplates: Template[] = [
  {
    id: "universal-1",
    name: "universal-1",
    label: "Универсальный шаблон",
    description: "максимум возможностей для общения",
    category: "universal",
    image: "/assets/template1.svg",
    svgImage: "/assets/template1.svg",
    serverId: 1,
    design: {
      id: "universal-1-design",
      name: "Universal Design 1",
      backgroundImage: "/assets/template1.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 44,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 35,
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
        label: "Ссылка на чат, канал или чат-бот",
        type: "url",
        required: true,
        placeholder: "Введите ссылку на чат, канал или чат-бот",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
        },
        help: "поле для ссылки",
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
        id: "organization",
        name: "organization",
        label: "Наименование учреждения или ИНН",
        type: "text",
        required: true,
        placeholder: "Введите ИНН или название организации",
        help: "поле для названия или ИНН",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "universal-2",
    name: "universal-2",
    label: "Универсальный шаблон 2",
    description: "российский мессенджер для миллионов людей",
    category: "universal",
    image: "/assets/template2.svg",
    svgImage: "/assets/template2.svg",
    serverId: 2,
    design: {
      id: "universal-2-design",
      name: "Universal Design 2",
      backgroundImage: "/assets/template2.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 44,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 40,
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
        label: "Ссылка на чат, канал или чат-бот",
        type: "url",
        required: true,
        placeholder: "Введите ссылку на чат, канал или чат-бот",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
        },
        help: "поле для ссылки",
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
        id: "organization",
        name: "organization",
        label: "Наименование учреждения или ИНН",
        type: "text",
        required: true,
        placeholder: "Введите ИНН или название организации",
        help: "поле для названия или ИНН",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "mfc-chatbot",
    name: "mfc-chatbot",
    label: "Шаблон для МФЦ",
    description: "Чат-бот МФЦ в российском мессенджере MAX",
    category: "government",
    image: "/assets/template3.svg",
    svgImage: "/assets/template3.svg",
    serverId: 3,
    design: {
      id: "mfc-design",
      name: "MFC Design",
      backgroundImage: "/assets/template3.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 44,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 40,
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
        label: "Ссылка на чат-бот МФЦ",
        type: "url",
        required: true,
        placeholder: "Введите ссылку на чат-бот МФЦ",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
        },
        help: "поле для ссылки на чат-бот",
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
        id: "mfc_name",
        name: "mfc_name",
        label: "Название МФЦ",
        type: "text",
        required: true,
        placeholder: "Введите название МФЦ",
        help: "поле для названия МФЦ",
      },
      {
        id: "services",
        name: "services",
        label: "Основные услуги",
        type: "textarea",
        required: false,
        placeholder: "Перечислите основные услуги МФЦ",
        help: "список основных услуг",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "student-digital",
    name: "student-digital",
    label: "Шаблон для вузов",
    description: "Твой цифровой студенческий в мессенджере MAX",
    category: "education",
    image: "/assets/template4.svg",
    svgImage: "/assets/template4.svg",
    serverId: 4,
    design: {
      id: "student-design",
      name: "Student Design",
      backgroundImage: "/assets/template4.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 44,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 40,
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
        label: "Ссылка на студенческий чат",
        type: "url",
        required: true,
        placeholder: "Введите ссылку на студенческий чат",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
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
        id: "university",
        name: "university",
        label: "Название университета",
        type: "text",
        required: true,
        placeholder: "Введите название университета",
        help: "поле для названия университета",
      },
      {
        id: "faculty",
        name: "faculty",
        label: "Факультет",
        type: "text",
        required: false,
        placeholder: "Введите название факультета",
        help: "поле для названия факультета",
      },
      {
        id: "course",
        name: "course",
        label: "Курс",
        type: "select",
        required: false,
        placeholder: "Выберите курс",
        options: [
          { value: "1", label: "1 курс" },
          { value: "2", label: "2 курс" },
          { value: "3", label: "3 курс" },
          { value: "4", label: "4 курс" },
          { value: "5", label: "5 курс" },
          { value: "6", label: "6 курс" },
        ],
        help: "выбор курса",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "student-confirmation",
    name: "student-confirmation",
    label: "Шаблон для вузов 2",
    description: "Нужно подтвердить, что ты студент? Покажи MAX!",
    category: "education",
    image: "/assets/template5.svg",
    svgImage: "/assets/template5.svg",
    serverId: 5,
    design: {
      id: "student-confirmation-design",
      name: "Student Confirmation Design",
      backgroundImage: "/assets/template5.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 44,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 40,
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
        label: "Ссылка на чат подтверждения",
        type: "url",
        required: true,
        placeholder: "Введите ссылку на чат подтверждения",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
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
        id: "university",
        name: "university",
        label: "Название университета",
        type: "text",
        required: true,
        placeholder: "Введите название университета",
        help: "поле для названия университета",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
  {
    id: "house-chat",
    name: "house-chat",
    label: "Чат с управляющей организацией",
    description: "для общения жителей дома",
    category: "community",
    image: "/assets/template6.svg",
    svgImage: "/assets/template6.svg",
    serverId: 6,
    design: {
      id: "house-chat-design",
      name: "House Chat Design",
      backgroundImage: "/assets/template6.svg",
      qrCodePosition: {
        desktop: {
          x: 22,
          y: 48,
          width: 75,
          height: 75,
        },
        mobile: {
          x: 12,
          y: 40,
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
        placeholder: "Введите ссылку на Чат с управляющей организацией",
        validation: {
          pattern: /^https:\/\/max\.ru(\/[a-zA-Z].+|\/?)$/,
          message:
            "Неправильный формат ссылки. Введите адрес вида https://max.ru/...",
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
        id: "address",
        name: "address",
        label: "Адрес дома",
        type: "text",
        required: true,
        placeholder: "Введите адрес дома",
        help: "поле для адреса дома",
      },
    ],
    metadata: {
      version: "1.0.0",
      author: "System",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  },
];

// Реестр шаблонов
const templates = ref<Template[]>([...baseTemplates]);

export function useTemplateRegistry(): TemplateRegistry {
  const getTemplateById = (id: string): Template | undefined => {
    return templates.value.find((template) => template.id === id);
  };

  const getTemplatesByCategory = (categoryId: string): Template[] => {
    return templates.value.filter(
      (template) => template.category === categoryId
    );
  };

  const getAllTemplates = (): Template[] => {
    return [...templates.value];
  };

  const registerTemplate = (template: Template): void => {
    const existingIndex = templates.value.findIndex(
      (t) => t.id === template.id
    );
    if (existingIndex >= 0) {
      // Обновляем существующий шаблон
      templates.value[existingIndex] = {
        ...template,
        metadata: {
          version: template.metadata?.version || "1.0.0",
          author: template.metadata?.author,
          createdAt: template.metadata?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };
    } else {
      // Добавляем новый шаблон
      templates.value.push({
        ...template,
        metadata: {
          version: template.metadata?.version || "1.0.0",
          author: template.metadata?.author,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
  };

  const unregisterTemplate = (templateId: string): void => {
    const index = templates.value.findIndex((t) => t.id === templateId);
    if (index >= 0) {
      templates.value.splice(index, 1);
    }
  };

  return {
    categories,
    templates: templates.value,
    getTemplateById,
    getTemplatesByCategory,
    getAllTemplates,
    registerTemplate,
    unregisterTemplate,
  };
}
