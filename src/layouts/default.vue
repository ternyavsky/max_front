<template>
  <div
    class="min-h-screen bg-black flex flex-col w-full pt-[39px] font-vk mobile:pt-[23px] min-w-screen"
  >
    <!-- Мобильная версия фона -->
    <div
      class="px-[60px] mobile:px-[20px] flex-1 relative z-10 w-full max-w-full overflow-x-hidden"
    >
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
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
</script>
