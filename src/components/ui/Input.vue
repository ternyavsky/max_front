<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps<{
  modelValue: string;
  label?: string;
  type?: string;
  placeholder?: string;
  id?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const inputValue = ref(props.modelValue);

watch(inputValue, (newValue) => {
  emit("update:modelValue", newValue);
});
</script>

<template>
  <div class="custom-input bg-white">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700"
    >
      {{ label }}
    </label>
    <input
      :id="id"
      :type="type"
      v-model="inputValue"
      :placeholder="placeholder"
      class="mt-1 block w-full px-3 py-2 border border-[#E8ECF5] focus:outline-none h-[52px]"
    />
  </div>
</template>

<style scoped>
.custom-input {
  margin-bottom: 1rem;
}
</style>
