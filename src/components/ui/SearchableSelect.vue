<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  options: string[] | { name: string; label: string }[];
  modelValue: string;
  placeholder?: string;
  class?: string;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const isOpen = ref(false);
const searchQuery = ref("");
const selectedOption = ref(props.modelValue);
const isSelecting = ref(false);

// Следим за изменениями modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    selectedOption.value = newValue;
    searchQuery.value = getDisplayValue(newValue);
  }
);

// Фильтруем опции по поисковому запросу
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options;

  return props.options.filter((option) => {
    const displayValue = typeof option === "string" ? option : option.label;
    return displayValue.toLowerCase().includes(searchQuery.value.toLowerCase());
  });
});

// Получаем отображаемое значение
function getDisplayValue(value: string): string {
  const option = props.options.find(
    (opt) => (typeof opt === "string" ? opt : opt.name) === value
  );
  return option ? (typeof option === "string" ? option : option.label) : value;
}

// Обработка клика на input
function handleInputClick() {
  if (isSelecting.value) return;

  nextTick(() => {
    isOpen.value = true;
  });
}

// Обработка фокуса на input
function handleInputFocus() {
  if (isSelecting.value) return;

  nextTick(() => {
    isOpen.value = true;
  });
}

// Обработка выбора опции
function selectOption(value: string) {
  if (isSelecting.value) return; // Предотвращаем двойное срабатывание

  isSelecting.value = true;
  selectedOption.value = value;
  searchQuery.value = getDisplayValue(value);

  // Небольшая задержка перед закрытием, чтобы избежать конфликтов с handleClickOutside
  setTimeout(() => {
    isOpen.value = false;
    isSelecting.value = false;
  }, 100);

  emit("update:modelValue", value);
}

// Обработка клика вне компонента
function handleClickOutside(event: Event) {
  if (isSelecting.value) return;

  const target = event.target as HTMLElement;
  if (!target.closest(".searchable-select")) {
    nextTick(() => {
      isOpen.value = false;
      // Восстанавливаем поисковый запрос к выбранному значению
      searchQuery.value = getDisplayValue(selectedOption.value);
    });
  }
}

// Обработка клавиш
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    isOpen.value = false;
    searchQuery.value = getDisplayValue(selectedOption.value);
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
  searchQuery.value = getDisplayValue(selectedOption.value);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <div class="searchable-select relative" :class="class">
    <!-- Поле ввода с поиском -->
    <div
      class="bg-white border border-[#E8ECF5] cursor-pointer h-[52px] flex items-center justify-between"
      :class="error ? 'border-error' : ''"
    >
      <input
        v-model="searchQuery"
        @focus="handleInputFocus"
        @click="handleInputClick"
        :placeholder="placeholder || 'Выберите...'"
        class="w-full px-4 py-3 pr-10 focus:outline-none cursor-text"
        v-bind="$attrs"
      />
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <img
          v-if="!error"
          src="/assets/select-icon.svg"
          alt="dropdown"
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
        <img v-else src="/assets/error.svg" alt="error" class="mb-4" />
      </div>
    </div>

    <!-- Выпадающий список -->
    <div
      v-if="isOpen"
      class="absolute z-50 w-full mt-1 bg-white border border-[#E8ECF5] shadow-lg max-h-60 overflow-y-auto"
    >
      <div v-if="filteredOptions.length === 0" class="px-4 py-3 text-gray-500">
        Ничего не найдено
      </div>
      <div
        v-for="option in filteredOptions"
        :key="typeof option === 'string' ? option : option.name"
        @click="selectOption(typeof option === 'string' ? option : option.name)"
        class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
        :class="{
          'bg-blue-50':
            (typeof option === 'string' ? option : option.name) ===
            selectedOption,
        }"
      >
        {{ typeof option === "string" ? option : option.label }}
      </div>
    </div>

    <!-- Сообщение об ошибке -->
    <div v-if="error" class="text-error text-[14px] flex justify-end">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
/* Стили для SearchableSelect */
</style>
