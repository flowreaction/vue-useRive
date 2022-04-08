import { ref, onUnmounted, onMounted } from 'vue';
import { Dimensions } from './types';

export function useWindowSize() {
  const windowSize = ref<Dimensions>({
    width: 0,
    height: 0,
  });

  const handleResize = () => {
    windowSize.value.width = window.innerWidth;
    windowSize.value.height = window.innerHeight;
  };
  onMounted(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return windowSize;
}
