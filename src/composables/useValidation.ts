import { ref, computed } from "vue";

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function useValidation() {
  const errors = ref<string[]>([]);
  const touched = ref(false);

  const validate = (
    value: string,
    rules: ValidationRule[]
  ): ValidationResult => {
    const validationErrors: string[] = [];

    for (const rule of rules) {
      if (rule.required && (!value || value.trim() === "")) {
        validationErrors.push("Поле обязательно для заполнения");
        continue;
      }

      if (value && rule.minLength && value.length < rule.minLength) {
        validationErrors.push(`Минимальная длина: ${rule.minLength} символов`);
      }

      if (value && rule.maxLength && value.length > rule.maxLength) {
        validationErrors.push(`Максимальная длина: ${rule.maxLength} символов`);
      }

      if (value && rule.pattern && !rule.pattern.test(value)) {
        validationErrors.push("Неверный формат");
      }

      if (value && rule.custom) {
        const customError = rule.custom(value);
        if (customError) {
          validationErrors.push(customError);
        }
      }
    }

    errors.value = validationErrors;
    return {
      isValid: validationErrors.length === 0,
      errors: validationErrors,
    };
  };

  const markAsTouched = () => {
    touched.value = true;
  };

  const hasError = computed(() => errors.value.length > 0 && touched.value);
  const firstError = computed(() => (hasError.value ? errors.value[0] : null));

  return {
    errors,
    touched,
    validate,
    markAsTouched,
    hasError,
    firstError,
  };
}

// Предустановленные правила валидации
export const validationRules = {
  required: { required: true },
  url: {
    required: true,
    pattern: /^https?:\/\/.+/,
    custom: (value: string) => {
      if (!value.includes("max.") && !value.includes("t.me")) {
        return "Поле заполнено неверно. Используйте ссылку MAX";
      }
      return null;
    },
  },
  inn: {
    required: true,
    pattern: /^\d{10}$|^\d{12}$/,
    custom: (value: string) => {
      if (value.length === 10 || value.length === 12) {
        return null;
      }
      return "ИНН должен содержать 10 или 12 цифр";
    },
  },
  organization: {
    required: true,
    minLength: 2,
  },
};
