import { ref } from "vue";
// @ts-ignore
import html2canvas from "html2canvas";
// @ts-ignore
import jsPDF from "jspdf";
import axios from "axios";
import type { Template } from "@/types/template";

export function usePdfGeneration() {
  const resData = ref({
    pathImg: "",
    idLink: "",
  });

  const downloadImage = async (params: {
    value: number;
    idLink?: string;
    template?: Template;
  }): Promise<void> => {
    const selectedTab = { value: params.value };
    const template = params.template;
    try {
      const el = document.getElementById("pdf-block");

      if (!el) {
        return;
      }

      let originalViewport = null;
      let originalContent = "";
      let scrollY = 0;

      // Всегда применяем мобильные настройки для PDF генерации
      {
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

      const originalElStyle = el.style.cssText;

      // Используем размеры из дизайна шаблона или стандартные
      const containerWidth = template?.design?.containerWidth || 947;
      const containerHeight = template?.design?.containerHeight || 655;
      const padding = template?.design?.padding || 42;

      el.style.width = `${containerWidth}px`;
      el.style.height = `${containerHeight}px`;
      el.style.minWidth = `${containerWidth}px`;
      el.style.minHeight = `${containerHeight}px`;
      el.style.maxWidth = `${containerWidth}px`;
      el.style.position = "fixed";
      el.style.left = "0";
      el.style.top = "0";
      el.style.zIndex = "9999";
      el.style.margin = "0";
      // Check if template has SVG - if yes, remove padding completely to eliminate white margins
      const hasSvg = template?.svgImage;
      el.style.padding = hasSvg ? "0" : `${padding}px`;
      el.style.transform = "none";

      qrCode = el.querySelector('img[alt="qr-code"]') as HTMLElement;
      if (qrCode) {
        const computedStyle = window.getComputedStyle(qrCode);
        originalQrStyle = `width: ${computedStyle.width}; height: ${computedStyle.height}; max-width: ${computedStyle.maxWidth}; max-height: ${computedStyle.maxHeight}; min-width: ${computedStyle.minWidth}; min-height: ${computedStyle.minHeight}; left: ${computedStyle.left}; bottom: ${computedStyle.bottom}; border-radius: ${computedStyle.borderRadius}; z-index: ${computedStyle.zIndex}; position: ${computedStyle.position}; object-fit: ${computedStyle.objectFit}; object-position: ${computedStyle.objectPosition};`;

        // Для PDF используем размеры из дизайна шаблона или стандартные
        const qrPosition = template?.design?.qrCodePosition;
        const qrWidth = template?.design?.qrCodeSize?.width || 155;
        const qrHeight = template?.design?.qrCodeSize?.height || 155;
        // Для PDF используем увеличенные отступы для лучшего позиционирования
        // For SVG templates, adjust positioning for better layout
        const extraOffset = hasSvg ? 0 : 20;
        const qrLeft =
          (qrPosition?.desktop?.x || 42) +
          (template?.design?.qrCodeOffset?.x || extraOffset) +
          (hasSvg ? 15 : 0); // Add left margin for SVG templates
        const qrBottom =
          (qrPosition?.desktop?.y || 61) +
          (template?.design?.qrCodeOffset?.y || extraOffset) +
          (hasSvg ? 15 : 0); // Raise QR code slightly for SVG templates

        qrCode.style.width = `${qrWidth}px`;
        qrCode.style.height = `${qrHeight}px`;
        qrCode.style.maxWidth = `${qrWidth}px`;
        qrCode.style.maxHeight = `${qrHeight}px`;
        qrCode.style.minWidth = `${qrWidth}px`;
        qrCode.style.minHeight = `${qrHeight}px`;
        qrCode.style.left = `${qrLeft}px`;
        qrCode.style.bottom = `${qrBottom}px`;
        qrCode.style.borderRadius = "8px";
        qrCode.style.zIndex = "10";
        qrCode.style.position = "absolute";
        qrCode.style.objectFit = "contain";
        qrCode.style.objectPosition = "center";
      }

      if (selectedTab.value === 1) {
        titleElement = el.querySelector("h4") as HTMLElement;
        if (titleElement) {
          // Не сохраняем margin-left, так как он должен браться из CSS классов

          // Для PDF всегда используем десктопные размеры независимо от устройства
          titleElement.style.fontSize = "57px";
          titleElement.style.maxWidth = "430px";
          titleElement.style.marginTop = "0";
          titleElement.style.marginLeft = "26px"; // Больше отступа чем у QR кода (left: 22px)
          titleElement.style.color = "#ffffff";
        }
      } else if (template && template.design) {
        // Применяем стили из дизайна шаблона
        titleElement = el.querySelector("h4") as HTMLElement;
        if (titleElement) {
          const design = template.design.textPosition;
          // Для PDF всегда используем десктопные параметры
          const textPos = design.desktop;
          titleElement.style.fontSize = `${textPos.fontSize}px`;
          titleElement.style.maxWidth = `${textPos.maxWidth}px`;
          titleElement.style.marginTop = "0";
          titleElement.style.color = textPos.color;
          if (textPos.fontFamily) {
            titleElement.style.fontFamily = textPos.fontFamily;
          }
        }
      }

      if (selectedTab.value === 1) {
        gradientTexts = Array.from(el.querySelectorAll(".text-gradient"));

        originalStyles = [];
        gradientTexts.forEach((text: Element, index) => {
          originalStyles[index] = (text as HTMLElement).style.cssText;
          (text as HTMLElement).style.background = "none";
          (text as HTMLElement).style.color = "#43D6FF";
        });
      }

      // Handle SVG elements for better PDF generation
      const svgElements = el.querySelectorAll("svg");
      const originalSvgStyles: string[] = [];
      svgElements.forEach((svg, index) => {
        // Сохраняем оригинальные стили SVG
        originalSvgStyles[index] = (
          svg as unknown as HTMLElement
        ).style.cssText;
        const originalPreserveAspectRatio = svg.getAttribute(
          "preserveAspectRatio"
        );
        (svg as any).__originalPreserveAspectRatio =
          originalPreserveAspectRatio;

        // Scale SVG to fill container completely for PDF
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
        svg.style.margin = "0";
        svg.style.padding = "0";
        svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
      });

      // Ensure SVG containers have proper overflow settings for PDF
      const svgContainers = el.querySelectorAll("div[style*='line-height: 0']");
      svgContainers.forEach((container) => {
        (container as HTMLElement).style.overflow = "hidden"; // Prevent white margins in PDF
        (container as HTMLElement).style.margin = "0";
        (container as HTMLElement).style.padding = "0";
      });

      // Handle other containers that might contain SVG
      const allContainers = el.querySelectorAll("div");
      allContainers.forEach((container) => {
        if (container.querySelector("svg")) {
          (container as HTMLElement).style.overflow = "hidden";
        }
      });

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = "0";
      container.style.width = `${containerWidth}px`;
      container.style.height = `${containerHeight}px`;
      container.style.overflow = "hidden";
      container.style.zIndex = "10000";
      container.style.margin = "0";
      container.style.padding = "0";
      container.style.background = "transparent";
      container.appendChild(el.cloneNode(true));

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        useCORS: true,
        allowTaint: false,
        scale: 3,
        backgroundColor: null, // Remove white background
        width: 947,
        height: 655,
        logging: false,
      });

      document.body.removeChild(container);

      el.style.cssText = originalElStyle;

      const currentQrCode = el.querySelector(
        'img[alt="qr-code"]'
      ) as HTMLElement;
      if (currentQrCode && originalQrStyle) {
        currentQrCode.style.cssText = originalQrStyle;
      }

      if (selectedTab.value === 1 || (template && template.design)) {
        const currentTitleElement = el.querySelector("h4") as HTMLElement;
        if (currentTitleElement) {
          // Полностью очищаем inline стили и позволяем CSS классам работать
          currentTitleElement.style.cssText = "";

          // Принудительно восстанавливаем критически важные стили
          if (selectedTab.value === 1) {
            // Восстанавливаем десктопные стили для всех устройств
            currentTitleElement.style.fontSize = "27px";
            currentTitleElement.style.maxWidth = "205px";
            currentTitleElement.style.marginTop = "0";
            currentTitleElement.style.color = "#ffffff";
            currentTitleElement.style.fontWeight = "bold";
          }
        }
      }

      if (selectedTab.value === 1) {
        gradientTexts.forEach((text: Element, index) => {
          (text as HTMLElement).style.cssText = originalStyles[index];
        });
      }

      // Восстанавливаем стили SVG элементов
      const currentSvgElements = el.querySelectorAll("svg");
      currentSvgElements.forEach((svg, index) => {
        if (originalSvgStyles[index]) {
          (svg as unknown as HTMLElement).style.cssText =
            originalSvgStyles[index];
        }
        if ((svg as any).__originalPreserveAspectRatio) {
          svg.setAttribute(
            "preserveAspectRatio",
            (svg as any).__originalPreserveAspectRatio
          );
        }
      });

      if (originalViewport) {
        originalViewport.setAttribute("content", originalContent);
        window.scrollTo(0, scrollY);
      }

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [containerWidth, containerHeight],
      });

      pdf.addImage(canvas, "PNG", 0, 0, containerWidth, containerHeight);

      const pdfBlob = pdf.output("blob");
      const blobUrl = URL.createObjectURL(pdfBlob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = "advertisement-max.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      markAsDownloaded(params.idLink);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
      return;
    } catch (error) {
      let originalViewport = document.querySelector('meta[name="viewport"]');
      let originalContent = originalViewport?.getAttribute("content") || "";
      let scrollY = window.scrollY;

      if (originalViewport && originalContent) {
        originalViewport.setAttribute("content", originalContent);
        window.scrollTo(0, scrollY);
      }

      throw error;
    }
  };

  const markAsDownloaded = async (idLink?: string) => {
    if (!idLink) {
      return;
    }

    await axios.post(`${import.meta.env.VITE_API_URL}/api/pdf/download`, {
      idLink: idLink,
    });
  };

  const handleImageError = () => {};

  return {
    resData,
    downloadImage,
    markAsDownloaded,
    handleImageError,
  };
}
