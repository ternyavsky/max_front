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

  // Получаем максимальную ширину и размер шрифта
  const updateMaxWidth = () => (window.innerWidth < 401 ? 110 : 430);
  const getFontSize = () => (window.innerWidth < 401 ? "20px" : "57px");
  let maxWidth = updateMaxWidth();
  let fontSize = getFontSize();

  // Добавляем обработчик изменения размера окна
  window.addEventListener("resize", () => {
    maxWidth = updateMaxWidth();
    fontSize = getFontSize();
  });

  const firstWord = words[0];
  const firstWordWidth = measureTextWidth(firstWord, fontSize);

  console.log("splitTextIntoLines - firstWord:", firstWord);
  console.log("splitTextIntoLines - firstWordWidth:", firstWordWidth);
  console.log("splitTextIntoLines - maxWidth:", maxWidth);

  // Если первое слово помещается в контейнер, используем его целиком
  if (firstWordWidth <= maxWidth) {
    console.log("Первое слово помещается, используем его целиком");
    return {
      firstLine: firstWord,
      restLines: words.slice(1).join(" "),
    };
  } else {
    console.log("Первое слово слишком длинное, обрезаем его");
    // Если первое слово слишком длинное, обрезаем его
    let truncatedWord = "";
    for (let i = 0; i < firstWord.length; i++) {
      const testChar = truncatedWord + firstWord[i];
      if (measureTextWidth(testChar, fontSize) <= maxWidth) {
        truncatedWord = testChar;
      } else {
        break;
      }
    }

    console.log("splitTextIntoLines - truncatedWord:", truncatedWord);
    console.log(
      "splitTextIntoLines - remaining text:",
      firstWord.slice(truncatedWord.length) +
        (words.slice(1).length > 0 ? " " + words.slice(1).join(" ") : "")
    );

    return {
      firstLine: truncatedWord,
      restLines:
        firstWord.slice(truncatedWord.length) +
        (words.slice(1).length > 0 ? " " + words.slice(1).join(" ") : ""),
    };
  }
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
    console.log("selectedTab.value:", selectedTab.value);
    console.log("currentTemplateText.value:", currentTemplateText.value);

    // Всегда используем splitTextIntoLines (теперь она работает только с первым словом)
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

// Экспортируем функции для использования в других компонентах
export { splitTextIntoLines };
