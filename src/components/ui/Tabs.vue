<script setup lang="ts">
import { ref, watch, computed } from "vue";

interface Tab {
  name: string;
  label: string;
}

const props = defineProps<{
  tabs: Tab[];
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
}>();

const selectedIndex = ref(props.modelValue ?? 0);

watch(
  () => props.modelValue,
  (val) => {
    if (typeof val === "number") selectedIndex.value = val;
  }
);

function selectTab(idx: number) {
  selectedIndex.value = idx;
  emit("update:modelValue", idx);
  emit("change", idx);
}
</script>

<template>
  <div>
    <div class="flex gap-[13px]">
      <button
        v-for="(tab, idx) in tabs"
        :key="tab.name"
        @click="selectTab(idx)"
        :class="[
          'px-6 py-3 font-medium text-[20px] border-2 rounded-full cursor-pointer max-w-fit w-full max-h-[52px] h-full flex items-center',
          idx === selectedIndex
            ? 'border-white text-white'
            : 'border-tabs-inactive text-tabs-inactive',
        ]"
        type="button"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="mt-4">
      <slot :name="tabs[selectedIndex]?.name"></slot>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: color 0.2s, border-color 0.2s;
}
</style>
