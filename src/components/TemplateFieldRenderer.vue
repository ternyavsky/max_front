<script setup lang="ts">
import { computed } from "vue";
import type { TemplateField } from "@/types/template";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import SearchableSelect from "@/components/ui/SearchableSelect.vue";
import SearchableInput from "@/components/ui/SearchableInput.vue";

interface Props {
  field: TemplateField;
  modelValue: any;
  error?: string;
  availableRegions?: { name: string; label: string }[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "update:modelValue": [value: any];
  select: [organization: any];
}>();

// Преобразуем опции для Select компонента
const selectOptions = computed(() => {
  if (props.field.options) {
    return props.field.options.map((option) => ({
      name: option.value,
      label: option.label,
    }));
  }
  return [];
});

// Определяем, нужно ли использовать SearchableSelect для региона
const isRegionField = computed(() => {
  return props.field.id === "region" && props.availableRegions;
});

// Определяем, нужно ли использовать SearchableInput для организации
const isOrganizationField = computed(() => {
  return props.field.id === "organization";
});

const handleInput = (value: any) => {
  emit("update:modelValue", value);
};

const handleSelect = (organization: any) => {
  emit("select", organization);
};
</script>

<template>
  <div class="template-field">
    <!-- Обычный Input -->
    <Input
      v-if="field.type === 'text' && !isOrganizationField"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
      :maxlength="field.maxLength?.toString()"
    />

    <!-- Textarea -->
    <textarea
      v-else-if="field.type === 'textarea'"
      :value="modelValue"
      @input="handleInput(($event.target as HTMLTextAreaElement).value)"
      :placeholder="field.placeholder"
      :maxlength="field.maxLength?.toString()"
      :class="[
        'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
        error ? 'border-red-500' : 'border-gray-300',
      ]"
      rows="3"
    ></textarea>

    <!-- Number Input -->
    <Input
      v-else-if="field.type === 'number'"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
    />

    <!-- URL Input -->
    <Input
      v-else-if="field.type === 'url'"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
      type="url"
    />

    <!-- Email Input -->
    <Input
      v-else-if="field.type === 'email'"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
      type="email"
    />

    <!-- Select с опциями -->
    <Select
      v-else-if="
        field.type === 'select' && selectOptions.length > 0 && !isRegionField
      "
      :options="selectOptions"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :error="error"
    />

    <!-- SearchableSelect для регионов -->
    <SearchableSelect
      v-else-if="isRegionField"
      :options="availableRegions || []"
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
    />

    <!-- SearchableInput для организаций -->
    <SearchableInput
      v-else-if="isOrganizationField"
      :model-value="modelValue"
      @update:model-value="handleInput"
      @select="handleSelect"
      :placeholder="field.placeholder"
      :debounce-ms="500"
      :error="error"
    />

    <!-- Fallback для неизвестных типов -->
    <Input
      v-else
      :model-value="modelValue"
      @update:model-value="handleInput"
      :placeholder="field.placeholder"
      :error="error"
    />

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="text-red-500 text-sm mt-1">
      {{ error }}
    </div>

    <!-- Справка -->
    <div v-if="field.help && !error" class="text-gray-500 text-sm mt-1">
      {{ field.help }}
    </div>
  </div>
</template>
