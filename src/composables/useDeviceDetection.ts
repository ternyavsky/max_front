import { ref, onMounted, onUnmounted } from "vue";

export function useDeviceDetection() {
  const isMobile = ref(false);
  const isTablet = ref(false);
  const isDesktop = ref(false);

  const updateDeviceType = () => {
    const width = window.innerWidth;
    isMobile.value = width < 1400;
    isTablet.value = width >= 1400 && width < 1600;
    isDesktop.value = width >= 1600;
  };

  onMounted(() => {
    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
  });

  onUnmounted(() => {
    window.removeEventListener("resize", updateDeviceType);
  });

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
}
