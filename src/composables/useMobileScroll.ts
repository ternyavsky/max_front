import { ref, onMounted, onUnmounted } from "vue";

export function useMobileScroll() {
  const isMobile = ref(false);

  // Функция для определения мобильного разрешения
  const checkIsMobile = () => {
    isMobile.value = window.innerWidth <= 400;
  };

  // Функция для плавного скролла к элементу
  const scrollToElement = (
    element: HTMLElement | null,
    offset: number = 100
  ) => {
    if (!element) return;

    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  // Функция для скролла к полю с ошибкой
  const scrollToErrorField = (fieldIndex: number) => {
    if (!isMobile.value) return;

    // Небольшая задержка для того, чтобы DOM обновился с ошибками
    setTimeout(() => {
      // Ищем элемент по data-field-index атрибуту
      const element = document.querySelector(
        `[data-field-index="${fieldIndex}"]`
      ) as HTMLElement;

      if (element) {
        scrollToElement(element, 120); // 120px отступ от верха
      } else {
        // Fallback на старые селекторы, если data-field-index не работает
        const fieldSelectors = [
          'input[placeholder*="заголовок"]', // Поле заголовка
          'input[placeholder*="ссылку"]', // Поле ссылки
          'input[placeholder*="регион"]', // Поле региона
          'input[placeholder*="организации"]', // Поле организации
        ];

        const selector = fieldSelectors[fieldIndex];
        if (selector) {
          const fallbackElement = document.querySelector(
            selector
          ) as HTMLElement;
          scrollToElement(fallbackElement, 120);
        }
      }
    }, 100);
  };

  // Функция для скролла к первому полю с ошибкой
  const scrollToFirstError = (errorFields: number[]) => {
    if (!isMobile.value || errorFields.length === 0) return;

    const firstErrorIndex = errorFields[0];
    scrollToErrorField(firstErrorIndex);
  };

  onMounted(() => {
    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", checkIsMobile);
  });

  return {
    isMobile,
    scrollToElement,
    scrollToErrorField,
    scrollToFirstError,
  };
}
