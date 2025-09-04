<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center font-vk mobile:items-start mobile:pt-[70px] mobile:pb-[20px]"
        @click="handleBackdropClick"
      >
        <!-- Размытый фон - не затрагивает футер -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

        <!-- Модальное окно -->
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative bg-white rounded-2xl p-8 max-w-[836px] w-full mx-4 shadow-2xl border border-blue-200 max-h-[276px] h-full mobile:max-w-[90%] mobile:max-h-[calc(100vh-140px)] mobile:p-6"
            @click.stop
          >
            <!-- Кнопка закрытия -->
            <button
              @click="$emit('close')"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <!-- Контент модалки -->
            <div
              class="flex items-start h-full relative gap-8 mobile:flex-col mobile:items-center mobile:gap-2 flex-row"
            >
              <img
                src="/src/assets/success-teddy.svg"
                alt="success"
                class="w-[208px] mobile:w-[120px]"
              />

              <div
                class="flex items-center gap-2 justify-start h-full mobile:flex-col mobile:items-center mobile:gap-3"
              >
                <img
                  src="/src/assets/success.svg"
                  alt="success"
                  class="w-fit h-fit absolute left-48 top-[-5px] mobile:relative mobile:left-0 mobile:top-0"
                />
                <div
                  class="flex flex-col justify-between h-full mobile:items-center mobile:gap-4"
                >
                  <p
                    class="font-medium text-[32px] text-sign-primary max-w-[400px] leading-[100%] mobile:text-[20px] mobile:text-center"
                  >
                    Ваше объявление успешно загружено!
                  </p>
                  <Button
                    variant="close"
                    class="w-full max-w-[144px] mb-7 mobile:mb-0 mobile:max-w-full"
                    @click="$emit('close')"
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from "./Button.vue";
interface Props {
  isOpen: boolean;
}

interface Emits {
  (e: "close"): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const handleBackdropClick = (event: MouseEvent) => {
  if (event.target === event.currentTarget) {
    // Клик по фону - закрываем модалку
    emit("close");
  }
};
</script>
