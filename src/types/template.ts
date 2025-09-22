// Типы для системы шаблонов

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: "text" | "select" | "textarea" | "number" | "url" | "email";
  required: boolean;
  placeholder?: string;
  maxLength?: number;
  options?: { value: string; label: string }[];
  validation?: {
    pattern?: RegExp;
    message?: string;
  };
  help?: string;
}

export interface TemplateDesign {
  id: string;
  name: string;
  backgroundImage: string;
  // Размеры контейнера для PDF
  containerWidth?: number;
  containerHeight?: number;
  padding?: number;
  // Размеры QR-кода для PDF
  qrCodeSize?: {
    width: number;
    height: number;
  };
  // Дополнительные отступы для QR-кода в PDF
  qrCodeOffset?: {
    x: number;
    y: number;
  };
  qrCodePosition: {
    desktop: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    mobile: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  };
  textPosition: {
    desktop: {
      x: number;
      y: number;
      maxWidth: number;
      fontSize: number;
      color: string;
      fontFamily?: string;
    };
    mobile: {
      x: number;
      y: number;
      maxWidth: number;
      fontSize: number;
      color: string;
      fontFamily?: string;
    };
  };
  customStyles?: Record<string, any>;
}

export interface Template {
  id: string;
  name: string;
  label: string;
  description: string;
  category: string;
  image: string;
  svgImage?: string; // SVG version for better quality
  serverId: number; // ID для отправки на сервер
  design: TemplateDesign;
  fields: TemplateField[];
  validation?: {
    customRules?: Array<{
      fieldId: string;
      rule: (value: any) => boolean;
      message: string;
    }>;
  };
  metadata?: {
    version: string;
    author?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface TemplateRegistry {
  categories: TemplateCategory[];
  templates: Template[];
  getTemplateById: (id: string) => Template | undefined;
  getTemplatesByCategory: (categoryId: string) => Template[];
  getAllTemplates: () => Template[];
  registerTemplate: (template: Template) => void;
  unregisterTemplate: (templateId: string) => void;
}
