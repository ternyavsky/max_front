<script setup lang="ts">
import { computed } from "vue";
import type { Template } from "@/types/template";
import Select from "@/components/ui/Select.vue";

interface Props {
  templates: Template[];
  modelValue: string;
  error?: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

// Создаем простой список опций без группировки
const selectOptions = computed(() => {
  return props.templates.map((template) => ({
    name: template.name,
    label: template.label,
  }));
});

const handleChange = (value: string) => {
  emit("update:modelValue", value);
};
</script>

<template>
  <div class="template-selector">
    <Select
      :options="selectOptions"
      :model-value="modelValue"
      @update:model-value="handleChange"
      :error="error"
      placeholder="Выберите шаблон объявления"
    />

    <!-- Справка -->
    <div class="text-gray-500 text-sm mt-1">список доступных шаблонов</div>
  </div>
</template>
