import { computed } from "vue";

// Функция для измерения ширины текста
function measureTextWidth(
  text: string,
  fontSize: string = "57px",
  fontWeight: string = "bold"
): number {
  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      // Fallback: приблизительный расчет с учетом размера экрана
      const isMobile = window.innerWidth < 401;
      const charWidth = isMobile ? 12 : 34; // 12px на символ для 20px, 34px для 57px
      return text.length * charWidth;
    }

    context.font = `${fontWeight} ${fontSize} VKSansDisplay-Regular, sans-serif`;
    return context.measureText(text).width;
  } catch (error) {
    console.warn("Ошибка измерения текста:", error);
    // Fallback: приблизительный расчет с учетом размера экрана
    const isMobile = window.innerWidth < 401;
    const charWidth = isMobile ? 12 : 34; // 12px на символ для 20px, 34px для 57px
    return text.length * charWidth;
  }
}

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

  const updateMaxWidth = () => (window.innerWidth < 401 ? 150 : 430);
  const getFontSize = () => (window.innerWidth < 401 ? "20px" : "57px");
  let maxWidth = updateMaxWidth();
  let fontSize = getFontSize();
  window.addEventListener("resize", () => {
    maxWidth = updateMaxWidth();
    fontSize = getFontSize();
  });
  console.log("maxWidth:", maxWidth);
  let currentText = "";
  let firstLineWords = 0;

  for (let i = 0; i < words.length; i++) {
    const testText = currentText + (currentText ? " " : "") + words[i];
    const textWidth = measureTextWidth(testText, fontSize);

    // Если текст помещается в строку
    if (textWidth <= maxWidth) {
      currentText = testText;
      firstLineWords = i + 1;
    } else {
      // Если текст не помещается, останавливаемся
      break;
    }
  }

  // Если ни одно слово не поместилось, берем хотя бы первое
  if (firstLineWords === 0) {
    firstLineWords = 1;
  }

  // Дополнительная проверка: если первое слово слишком длинное, обрезаем его
  if (firstLineWords === 1) {
    const firstWord = words[0];
    if (measureTextWidth(firstWord, fontSize) > maxWidth) {
      // Обрезаем слово до максимальной ширины
      let truncatedWord = "";
      for (let i = 0; i < firstWord.length; i++) {
        const testChar = truncatedWord + firstWord[i];
        if (measureTextWidth(testChar, fontSize) <= maxWidth) {
          truncatedWord = testChar;
        } else {
          break;
        }
      }
      return {
        firstLine: truncatedWord,
        restLines:
          firstWord.slice(truncatedWord.length) +
          (words.slice(1).length > 0 ? " " + words.slice(1).join(" ") : ""),
      };
    }
  }

  const firstLine = words.slice(0, firstLineWords).join(" ");
  const restLines = words.slice(firstLineWords).join(" ");

  return { firstLine, restLines };
}

export function useTextProcessing(
  selectedTab: any,
  selectedTemplate: any,
  frameObjects: any
) {
  // Вычисляемое свойство для текущего текста шаблона
  const currentTemplateText = computed(() => {
    console.log("useTextProcessing - selectedTab:", selectedTab.value);
    console.log("useTextProcessing - frameObjects:", frameObjects.value);
    console.log(
      "useTextProcessing - selectedTemplate:",
      selectedTemplate.value
    );

    if (selectedTab.value === 1) {
      // Для индивидуального макета берем текст из инпута
      const inputText = frameObjects.value[0]?.inputValue || "";
      console.log("Current input text:", inputText);
      console.log("FrameObjects[0]:", frameObjects.value[0]);
      return inputText;
    }
    // Для готовых объявлений берем текст из выбранного шаблона
    return selectedTemplate.value?.text || "";
  });

  // Вычисляемое свойство для разделенного текста
  const splitText = computed(() => {
    console.log("splitText computed called");
    const result = splitTextIntoLines(currentTemplateText.value);
    // Отладочная информация
    if (currentTemplateText.value) {
      console.log("Исходный текст:", currentTemplateText.value);
      console.log("Первая строка:", result.firstLine);
      console.log("Остальные строки:", result.restLines);
      console.log("Ширина первой строки:", measureTextWidth(result.firstLine));
    } else {
      console.log("currentTemplateText is empty");
    }
    return result;
  });

  return {
    currentTemplateText,
    splitText,
    measureTextWidth,
    splitTextIntoLines,
  };
}

// Экспортируем функцию для использования в других компонентах
export { splitTextIntoLines };
