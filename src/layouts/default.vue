<template>
  <div
    class="min-h-screen bg-black flex flex-col w-full pt-[39px] font-vk mobile:pt-[23px] min-w-screen"
  >
    <img
      class="fixed top-[-158px] left-[472px] z-0"
      src="/src/assets/right-bg.png"
      alt="shape-1"
    />
    <!-- Мобильная версия фона -->
    <div class="px-[60px] mobile:px-[20px] flex-1 relative z-10">
      <!-- Header -->
      <Header />
      <!-- Main content -->
      <main class="flex-1">
        <slot />
      </main>
      <!-- Footer -->
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>
