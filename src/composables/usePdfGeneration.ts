import { ref } from "vue";
// @ts-ignore
import html2canvas from "html2canvas";
// @ts-ignore
import jsPDF from "jspdf";
import axios from "axios";

export function usePdfGeneration() {
  const resData = ref({
    pathImg: "",
    idLink: "",
  });

  const downloadImage = async (params: {
    value: number;
    idLink?: string;
  }): Promise<void> => {
    const selectedTab = { value: params.value };
    try {
      const el = document.getElementById("pdf-block");

      if (!el) {
        console.error("Элемент pdf-block не найден");
        return;
      }

      console.log(
        "Создаем PDF для типа шаблона:",
        selectedTab.value === 1 ? "индивидуальный" : "готовый"
      );

      const isMobileDevice = window.innerWidth < 400;
      let originalViewport = null;
      let originalContent = "";
      let scrollY = 0;

      // Для мобильных устройств временно меняем viewport
      if (isMobileDevice) {
        scrollY = window.scrollY;
        originalViewport = document.querySelector('meta[name="viewport"]');
        originalContent = originalViewport?.getAttribute("content") || "";
        originalViewport?.setAttribute(
          "content",
          "width=1200, initial-scale=1.0"
        );
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      let originalStyles: string[] = [];
      let gradientTexts: Element[] = [];
      let qrCode: HTMLElement | null = null;
      let titleElement: HTMLElement | null = null;
      let originalQrStyle = "";
      let originalTitleStyle = "";

      // Сохраняем оригинальные стили элемента
      const originalElStyle = el.style.cssText;

      // Принудительно устанавливаем десктопные размеры
      el.style.width = "947px";
      el.style.height = "655px";
      el.style.minWidth = "947px";
      el.style.minHeight = "655px";
      el.style.maxWidth = "947px";
      el.style.position = "fixed";
      el.style.left = "0";
      el.style.top = "0";
      el.style.zIndex = "9999";
      el.style.margin = "0";
      el.style.padding = "42px 42px 40px 42px";
      el.style.transform = "none";

      // Принудительно устанавливаем десктопные размеры для QR-кода
      qrCode = el.querySelector('img[alt="qr-code"]') as HTMLElement;
      console.log("Найден QR-код:", qrCode);
      if (qrCode) {
        // Сохраняем computed стили, а не только inline
        const computedStyle = window.getComputedStyle(qrCode);
        originalQrStyle = `width: ${computedStyle.width}; height: ${computedStyle.height}; max-width: ${computedStyle.maxWidth}; max-height: ${computedStyle.maxHeight}; min-width: ${computedStyle.minWidth}; min-height: ${computedStyle.minHeight}; left: ${computedStyle.left}; bottom: ${computedStyle.bottom}; border-radius: ${computedStyle.borderRadius}; z-index: ${computedStyle.zIndex}; position: ${computedStyle.position}; object-fit: ${computedStyle.objectFit}; object-position: ${computedStyle.objectPosition};`;
        console.log("Оригинальные стили QR-кода:", originalQrStyle);
        qrCode.style.width = "155px";
        qrCode.style.height = "155px";
        qrCode.style.maxWidth = "155px";
        qrCode.style.maxHeight = "155px";
        qrCode.style.minWidth = "155px";
        qrCode.style.minHeight = "155px";
        qrCode.style.left = "42px";
        qrCode.style.bottom = "61px";
        qrCode.style.borderRadius = "8px";
        qrCode.style.zIndex = "10";
        qrCode.style.position = "absolute";
        qrCode.style.objectFit = "contain";
        qrCode.style.objectPosition = "center";
        qrCode.style.objectFit = "contain";
      } else {
        console.log("QR-код не найден при установке стилей");
      }

      // Принудительно устанавливаем десктопные размеры для заголовка в индивидуальном макете
      if (selectedTab.value === 1) {
        titleElement = el.querySelector("h4") as HTMLElement;
        if (titleElement) {
          // Сохраняем computed стили, а не только inline
          const computedStyle = window.getComputedStyle(titleElement);
          originalTitleStyle = `font-size: ${computedStyle.fontSize}; max-width: ${computedStyle.maxWidth}; margin-top: ${computedStyle.marginTop};`;
          titleElement.style.fontSize = "57px";
          titleElement.style.maxWidth = "430px";
          titleElement.style.marginTop = "0";
        }
      }

      // Для индивидуального макета обрабатываем градиентный текст
      if (selectedTab.value === 1) {
        gradientTexts = Array.from(el.querySelectorAll(".text-gradient"));
        console.log("Найдено элементов с градиентом:", gradientTexts.length);

        originalStyles = [];
        gradientTexts.forEach((text: Element, index) => {
          originalStyles[index] = (text as HTMLElement).style.cssText;
          (text as HTMLElement).style.background = "none";
          (text as HTMLElement).style.color = "#43D6FF";
        });
      }

      // Создаем контейнер для изоляции
      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = "947px";
      container.style.height = "655px";
      container.style.overflow = "hidden";
      container.style.zIndex = "10000";
      container.appendChild(el.cloneNode(true));

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: false,
        scale: 3,
        backgroundColor: "#ffffff",
        width: 947,
        height: 655,
        logging: false,
      });

      // Убираем контейнер
      document.body.removeChild(container);

      // Восстанавливаем оригинальные стили элемента
      el.style.cssText = originalElStyle;

      // Восстанавливаем оригинальные стили QR-кода
      const currentQrCode = el.querySelector(
        'img[alt="qr-code"]'
      ) as HTMLElement;
      console.log("Ищем QR-код для восстановления:", currentQrCode);
      console.log("Оригинальные стили для восстановления:", originalQrStyle);
      if (currentQrCode && originalQrStyle) {
        console.log("Восстанавливаем стили QR-кода:", originalQrStyle);
        currentQrCode.style.cssText = originalQrStyle;
      } else {
        console.log("QR-код не найден или нет оригинальных стилей");
      }

      // Восстанавливаем оригинальные стили заголовка (только для индивидуального макета)
      if (selectedTab.value === 1) {
        const currentTitleElement = el.querySelector("h4") as HTMLElement;
        if (currentTitleElement && originalTitleStyle) {
          console.log("Восстанавливаем стили заголовка:", originalTitleStyle);
          currentTitleElement.style.cssText = originalTitleStyle;
        } else {
          console.log("Заголовок не найден или нет оригинальных стилей");
        }
      }

      // Восстанавливаем градиентный текст
      if (selectedTab.value === 1) {
        gradientTexts.forEach((text: Element, index) => {
          (text as HTMLElement).style.cssText = originalStyles[index];
        });
      }

      // Восстанавливаем viewport для мобильных устройств
      if (isMobileDevice && originalViewport) {
        originalViewport.setAttribute("content", originalContent);
        window.scrollTo(0, scrollY);
      }

      // Создаем PDF с фиксированными размерами
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [947, 655],
      });

      pdf.addImage(canvas, "PNG", 0, 0, 947, 655);

      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      // Всегда скачиваем файл (и на мобильных, и на десктопе)
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "advertisement.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      markAsDownloaded(params.idLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      return; // Успешное завершение
    } catch (error) {
      console.error("Ошибка при создании PDF:", error);

      const isMobileDevice = window.innerWidth < 400;
      let originalViewport = document.querySelector('meta[name="viewport"]');
      let originalContent = originalViewport?.getAttribute("content") || "";
      let scrollY = window.scrollY;

      // Восстанавливаем viewport в случае ошибки
      if ((isMobileDevice || originalViewport) && originalContent) {
        originalViewport?.setAttribute("content", originalContent);
        window.scrollTo(0, scrollY);
      }

      throw error; // Пробрасываем ошибку
    }
  };

  const markAsDownloaded = async (idLink?: string) => {
    if (!idLink) {
      console.warn("idLink не передан в markAsDownloaded");
      return;
    }

    const res = await axios.post("https://test333.na4u.ru/api/pdf/download", {
      idLink: idLink,
    });
    console.log("Ответ от сервера:", res.data);
  };

  const handleImageError = (event: Event) => {
    console.error("Ошибка загрузки изображения:", event);
  };

  return {
    resData,
    downloadImage,
    markAsDownloaded,
    handleImageError,
  };
}
