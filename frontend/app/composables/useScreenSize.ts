// frontend/app/composables/useScreenSize.ts
import { useMediaQuery } from '@vueuse/core';

export const useScreenSize = () => {
  // Tailwinds md breakpoint
  const isMobile = useMediaQuery('(max-width: 768px)');

  return {
    isMobile,
  };
};
