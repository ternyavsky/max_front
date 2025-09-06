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
    console.log("scrollToErrorField called with fieldIndex:", fieldIndex);

    // if (!isMobile.value) {
    //   console.log("Не мобильное устройство, прокрутка не выполняется");
    //   return;
    // }

    // Небольшая задержка для того, чтобы DOM обновился с ошибками
    setTimeout(() => {
      console.log("Ищем элемент с data-field-index:", fieldIndex);

      // Ищем элемент по data-field-index атрибуту
      const element = document.querySelector(
        `[data-field-index="${fieldIndex}"]`
      ) as HTMLElement;

      console.log("Найденный элемент:", element);

      if (element) {
        console.log("Элемент найден, выполняем прокрутку");
        scrollToElement(element, 120); // 120px отступ от верха
      } else {
        console.log("Элемент не найден, пробуем fallback селекторы");
        // Fallback на старые селекторы, если data-field-index не работает
        const fieldSelectors = [
          'input[placeholder*="заголовок"]', // Поле заголовка
          'input[placeholder*="ссылку"]', // Поле ссылки
          'input[placeholder*="регион"]', // Поле региона
          'input[placeholder*="организации"]', // Поле организации
        ];

        const selector = fieldSelectors[fieldIndex];
        console.log("Fallback селектор:", selector);

        if (selector) {
          const fallbackElement = document.querySelector(
            selector
          ) as HTMLElement;
          console.log("Fallback элемент найден:", fallbackElement);
          if (fallbackElement) {
            scrollToElement(fallbackElement, 120);
          }
        }
      }
    }, 100);
  };

  // Функция для скролла к первому полю с ошибкой
  const scrollToFirstError = (errorFields: number[]) => {
    console.log("scrollToFirstError called");
    console.log("isMobile.value:", isMobile.value);
    console.log("errorFields:", errorFields);

    if (!isMobile.value || errorFields.length === 0) {
      console.log(
        "Прокрутка не выполняется - не мобильное устройство или нет ошибок"
      );
      return;
    }

    const firstErrorIndex = errorFields[0];
    console.log("Прокрутка к полю с индексом:", firstErrorIndex);
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
