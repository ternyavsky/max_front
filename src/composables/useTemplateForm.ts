import { ref, computed } from "vue";
import { useTemplateRegistry } from "./useTemplateRegistry";
import type { Template, TemplateField } from "@/types/template";
import { SENSITIVE_REGEX, SWEAR_REGEX } from "@/utils/banRegular";

interface FormFieldValue {
  value: any;
  error: string;
}

interface FormData {
  [fieldId: string]: FormFieldValue;
}

export function useTemplateForm() {
  const templateRegistry = useTemplateRegistry();

  const selectedTemplate = ref<Template | null>(null);
  const formData = ref<FormData>({});
  const isLoading = ref(false);
  const errorMessage = ref("");
  const successMessage = ref("");

  // Инициализация формы на основе выбранного шаблона
  const initializeForm = (template: Template) => {
    selectedTemplate.value = template;
    formData.value = {};

    // Инициализируем поля формы
    template.fields.forEach((field) => {
      formData.value[field.id] = {
        value: field.type === "select" ? "" : "",
        error: "",
      };
    });
  };

  // Получение значения поля
  const getFieldValue = (fieldId: string) => {
    return formData.value[fieldId]?.value || "";
  };

  // Установка значения поля
  const setFieldValue = (fieldId: string, value: any) => {
    if (formData.value[fieldId]) {
      formData.value[fieldId].value = value;
      formData.value[fieldId].error = ""; // Очищаем ошибку при изменении
    }
  };

  // Получение ошибки поля
  const getFieldError = (fieldId: string) => {
    return formData.value[fieldId]?.error || "";
  };

  // Валидация отдельного поля
  const validateField = (field: TemplateField, value: any): string => {
    // Проверка обязательности
    if (field.required && (!value || value.toString().trim() === "")) {
      return "Поле обязательно для заполнения";
    }

    // Если поле пустое и не обязательное, пропускаем остальные проверки
    if (!value || value.toString().trim() === "") {
      return "";
    }

    const stringValue = value.toString().trim();

    // Проверка максимальной длины
    if (field.maxLength && stringValue.length > field.maxLength) {
      return `Максимальная длина ${field.maxLength} символов`;
    }

    // Проверка на нецензурную лексику
    if (SWEAR_REGEX.test(stringValue) || SENSITIVE_REGEX.test(stringValue)) {
      return "Используйте нормативную лексику";
    }

    // Проверка по регулярному выражению
    if (
      field.validation?.pattern &&
      !field.validation.pattern.test(stringValue)
    ) {
      return field.validation.message || "Неверный формат";
    }

    // Проверка типа поля
    switch (field.type) {
      case "url":
        try {
          new URL(stringValue);
        } catch {
          return "Введите корректную ссылку";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(stringValue)) {
          return "Введите корректный email";
        }
        break;
      case "number":
        if (isNaN(Number(stringValue))) {
          return "Введите корректное число";
        }
        break;
    }

    return "";
  };

  // Валидация всей формы
  const validateForm = (): boolean => {
    if (!selectedTemplate.value) {
      errorMessage.value = "Шаблон не выбран";
      return false;
    }

    let hasErrors = false;

    selectedTemplate.value.fields.forEach((field) => {
      const value = getFieldValue(field.id);
      const error = validateField(field, value);

      if (error) {
        formData.value[field.id].error = error;
        hasErrors = true;
      } else {
        formData.value[field.id].error = "";
      }
    });

    // Дополнительные кастомные правила валидации
    if (selectedTemplate.value.validation?.customRules) {
      selectedTemplate.value.validation.customRules.forEach((rule) => {
        const value = getFieldValue(rule.fieldId);
        if (!rule.rule(value)) {
          formData.value[rule.fieldId].error = rule.message;
          hasErrors = true;
        }
      });
    }

    return !hasErrors;
  };

  // Очистка всех ошибок
  const clearAllErrors = () => {
    Object.keys(formData.value).forEach((fieldId) => {
      formData.value[fieldId].error = "";
    });
    errorMessage.value = "";
  };

  // Сбор данных формы для отправки
  const collectFormData = () => {
    if (!selectedTemplate.value) {
      return null;
    }

    const data: any = {
      templateId: selectedTemplate.value.id,
      templateName: selectedTemplate.value.name,
    };

    selectedTemplate.value.fields.forEach((field) => {
      data[field.name] = getFieldValue(field.id);
    });

    return data;
  };

  // Получение полей шаблона
  const templateFields = computed(() => {
    return selectedTemplate.value?.fields || [];
  });

  // Проверка, инициализирована ли форма
  const isFormInitialized = computed(() => {
    return selectedTemplate.value !== null;
  });

  // Получение всех доступных шаблонов
  const availableTemplates = computed(() => {
    return templateRegistry.getAllTemplates();
  });

  // Получение шаблонов по категории
  const getTemplatesByCategory = (categoryId: string) => {
    return templateRegistry.getTemplatesByCategory(categoryId);
  };

  // Получение категорий
  const categories = computed(() => {
    return templateRegistry.categories;
  });

  return {
    // Состояние
    selectedTemplate,
    formData,
    isLoading,
    errorMessage,
    successMessage,

    // Вычисляемые свойства
    templateFields,
    isFormInitialized,
    availableTemplates,
    categories,

    // Методы
    initializeForm,
    getFieldValue,
    setFieldValue,
    getFieldError,
    validateField,
    validateForm,
    clearAllErrors,
    collectFormData,
    getTemplatesByCategory,
  };
}
