<script setup lang="ts">
import {
  defineProps,
  defineEmits,
  ref,
  watch,
  onMounted,
  onUnmounted,
} from "vue";

const props = defineProps<{
  options: { name: string; label: string }[];
  modelValue: string;
  placeholder?: string;
  class?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const selectedOption = ref(props.modelValue);

// Следим за изменениями modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue;
  }
);

// Получаем отображаемое значение
function getDisplayValue(value: string): string {
  const option = props.options.find((opt) => opt.name === value);
  return option ? option.label : value;
}

// Обработка выбора опции
function selectOption(value: string) {
  selectedOption.value = value;
  isOpen.value = false;
  emit("update:modelValue", value);
}

// Обработка клика вне компонента
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest(".custom-select")) {
    isOpen.value = false;
  }
}

// Обработка клавиш
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    isOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});
</script>
<template>
  <div class="custom-select relative" :class="class">
    <!-- Поле отображения выбранного значения -->
    <div
      class="bg-white border border-[#E8ECF5] cursor-pointer h-[52px]"
      @click="isOpen = !isOpen"
    >
      <div class="w-full px-4 py-3 pr-10 flex items-center">
        <span v-if="selectedOption" class="text-gray-900">
          {{ getDisplayValue(selectedOption) }}
        </span>
        <span v-else class="text-gray-500">
          {{ placeholder || "Выберите..." }}
        </span>
      </div>
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <img
          src="/src/assets/select-icon.svg"
          alt="dropdown"
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
      </div>
    </div>

    <!-- Выпадающий список -->
    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-[#E8ECF5] shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="option in options"
        :key="option.name"
        @click="selectOption(option.name)"
        class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        :class="{
          'bg-blue-50': option.name === selectedOption,
        }"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>
