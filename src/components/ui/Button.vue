<script setup lang="ts">
import { computed } from "vue";

interface Props {
  variant?: "primary" | "outline" | "close";
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  class: "",
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => {
  const baseClasses = [
    "inline-flex items-center justify-center font-medium rounded-[20px] transition-all duration-200  h-[64px] text-[24px] cursor-pointer hover:opacity-80",
  ];

  const variantClasses = {
    close: "close-btn-gradient text-white",
    primary: "btn-gradient text-white",
    outline: "bg-white border-[##191D86] text-[#191D86] border-1",
  };

  return [...baseClasses, variantClasses[props.variant], props.class];
});
</script>

<template>
  <button :class="buttonClasses" @click="$emit('click', $event)">
    <slot />
  </button>
</template>
