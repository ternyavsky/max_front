<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  id?: string;
  error?: string;
  maxlength?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit("update:modelValue", newValue);
});

watch(
  () => props.modelValue,
  (newValue) => {
    inputValue.value = newValue;
  }
);
</script>

<template>
  <div class="bg-white">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <div
      class="mt-1 w-full px-3 py-2 border border-[#E8ECF5] focus:outline-none h-[52px] flex items-center justify-between"
      :class="error ? 'border-error' : ''"
    >
      <input
        :id="id"
        :type="type"
        v-model="inputValue"
        :placeholder="placeholder"
        class="w-full h-[52px] focus:outline-none"
        :maxlength="maxlength"
      />
      <img src="/assets/error.svg" alt="eye" v-if="error" />
    </div>
  </div>
  <div v-if="error" class="text-error text-[14px] flex justify-end">
    {{ error }}
  </div>
</template>

<style scoped></style>
