<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from "vue";

export interface Organization {
  inn: string;
  name: string;
  address?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<{
  modelValue: string;
  placeholder?: string;
  class?: string;
  debounceMs?: number;
  error?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "select", organization: Organization): void;
}>();

const searchQuery = ref(props.modelValue);
const isOpen = ref(false);
const organizations = ref<Organization[]>([]);
const isLoading = ref(false);
const selectedOrganization = ref<Organization | null>(null);
const debounceTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const isSelecting = ref(false);
const isUserSelected = ref(false);

// Следим за изменениями modelValue извне
watch(
  () => props.modelValue,
  (newValue) => {
    searchQuery.value = newValue;
  }
);

// Обработка ввода с дебаунсом
watch(searchQuery, (newQuery) => {
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }

  debounceTimer.value = setTimeout(() => {
    if (newQuery.length >= 1) {
      // Проверяем, не является ли текущий запрос уже выбранной организацией
      if (
        isUserSelected.value &&
        selectedOrganization.value &&
        selectedOrganization.value.name === newQuery
      ) {
        // Если это уже выбранная организация, не ищем заново
        isOpen.value = false;
        return;
      }

      // Сбрасываем флаг выбора, если пользователь начал новый поиск
      if (
        isUserSelected.value &&
        selectedOrganization.value &&
        selectedOrganization.value.name !== newQuery
      ) {
        isUserSelected.value = false;
        selectedOrganization.value = null;
      }

      searchOrganizations(newQuery);
    } else {
      organizations.value = [];
      isOpen.value = false;
      isUserSelected.value = false;
      selectedOrganization.value = null;
    }
  }, props.debounceMs || 50);
});

// Поиск организаций через API
async function searchOrganizations(query: string) {
  try {
    const response = await fetch("https://test333.na4u.ru/api/dadata/", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      redirect: "follow",
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    organizations.value = data.organizations || [];
    data.suggestions.map((suggestion: any) => {
      organizations.value.push({
        inn: suggestion.data.inn,
        name: suggestion.value,
        address: suggestion.data.address.value,
      });
    });
    isOpen.value = true;
  } catch (error) {
    console.error("Ошибка поиска организаций:", error);
    organizations.value = [];
  } finally {
    isLoading.value = false;
  }

  return;
}

// Обработка выбора организации
function selectOrganization(organization: Organization) {
  if (isSelecting.value) return; // Предотвращаем двойное срабатывание

  isSelecting.value = true;
  selectedOrganization.value = organization;
  searchQuery.value = organization.name;
  isUserSelected.value = true; // Отмечаем, что пользователь выбрал организацию

  // Небольшая задержка перед закрытием, чтобы избежать конфликтов с handleClickOutside
  setTimeout(() => {
    isOpen.value = false;
    isSelecting.value = false;
  }, 100);

  emit("update:modelValue", organization.name);
  emit("select", organization);
}

// Обработка клика вне компонента
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement;
  if (!target.closest(".searchable-input") && !isSelecting.value) {
    // Небольшая задержка, чтобы дать время selectOrganization сработать
    setTimeout(() => {
      isOpen.value = false;
    }, 50);
  }
}

// Обработка клавиш
function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    isOpen.value = false;
  }
}

// Обработка фокуса
function handleFocus() {
  // Не открываем список, если уже выбрана организация и текст совпадает
  if (
    isUserSelected.value &&
    selectedOrganization.value &&
    selectedOrganization.value.name === searchQuery.value
  ) {
    isOpen.value = false;
    return;
  }

  if (organizations.value.length > 0) {
    isOpen.value = true;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("keydown", handleKeydown);
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value);
  }
});
</script>

<template>
  <div class="searchable-input relative" :class="class">
    <!-- Поле ввода -->
    <div
      class="bg-white border border-[#E8ECF5] h-[52px] flex items-center justify-between"
      :class="error ? 'border-error' : ''"
    >
      <input
        v-model="searchQuery"
        @focus="handleFocus"
        :placeholder="placeholder || 'Введите ИНН или название организации'"
        class="w-full px-4 py-3 pr-10 focus:outline-none h-[52px]"
        v-bind="$attrs"
      />
      <div
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
      >
        <div
          v-if="isLoading"
          class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"
        ></div>
        <img
          v-else-if="!error"
          src="/assets/select-icon.svg"
          alt="search"
          class="w-3 h-3 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
        />
        <img v-else src="/assets/error.svg" alt="error" class="w-4 h-4" />
      </div>
    </div>

    <!-- Выпадающий список с результатами -->
    <div
      v-if="isOpen && organizations.length > 0"
      class="absolute z-50 w-full mt-1 bg-white border border-[#E8ECF5] shadow-lg max-h-60 overflow-y-auto"
    >
      <div
        v-for="organization in organizations"
        :key="organization.inn"
        @click="selectOrganization(organization)"
        class="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
      >
        <div class="font-medium text-gray-900">{{ organization.name }}</div>
        <div class="text-sm text-gray-600">ИНН: {{ organization.inn }}</div>
        <div v-if="organization.address" class="text-xs text-gray-500 mt-1">
          {{ organization.address }}
        </div>
      </div>
    </div>

    <!-- Сообщение о загрузке -->
    <div
      v-if="isOpen && isLoading"
      class="absolute z-50 w-full mt-1 bg-white border border-[#E8ECF5] shadow-lg"
    >
      <div class="px-4 py-3 text-center text-gray-500">
        <div
          class="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-2"
        ></div>
        Поиск организаций...
      </div>
    </div>

    <!-- Сообщение "ничего не найдено" -->
    <div
      v-if="
        isOpen &&
        !isLoading &&
        organizations.length === 0 &&
        searchQuery.length >= 3
      "
      class="absolute z-50 w-full mt-1 bg-white border border-[#E8ECF5] shadow-lg"
    >
      <div class="px-4 py-3 text-gray-500">Организации не найдены</div>
    </div>
  </div>

  <!-- Сообщение об ошибке -->
  <div v-if="error" class="text-error text-[14px] flex justify-end">
    {{ error }}
  </div>
</template>

<style scoped>
/* Стили для SearchableInput */
</style>
