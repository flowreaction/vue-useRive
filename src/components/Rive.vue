<script setup lang="ts">
import { onMounted, onUnmounted, ref, watchEffect } from 'vue';
import { Rive, EventType } from '@rive-app/webgl';
import {
  UseRiveParameters,
  UseRiveOptions,
  //   RiveState,
  Dimensions,
} from '../types';
import { useWindowSize } from '../utils';
import { computed } from '@vue/reactivity';
/**
 * Props
 */
const props = defineProps<{
  riveParams?: UseRiveParameters;
  options?: Partial<UseRiveOptions>;
}>();

/**
 * Reactive variables
 */
const canvas = ref<HTMLCanvasElement | null>(null);
const container = ref<HTMLElement | null>(null);
const rive = ref<Rive | null>(null);
const windowSize = useWindowSize();
const dimensions = ref<Dimensions>({
  width: 0,
  height: 0,
});
const containerStyle = ref({
  width: `100%`,
  height: `100%`,
});
const isMounted = ref(false);
const options = computed(() => {
  return Object.assign({}, defaultOptions, props.options);
});

const defaultOptions = {
  useDevicePixelRatio: true,
  fitCanvasToArtboardHeight: false,
  useOffscreenRenderer: true,
};

console.log('Props: ', props);

/**
 * Watches windowsize and updates the canvas dimensions
 */
watchEffect(() => {
  //   if (!isMounted.value) return;
  if (windowSize.value && canvas.value && container.value) {
    const { width, height } = getCanvasDimensions();
    const boundsChanged =
      width !== dimensions.value.width || height !== dimensions.value.height;
    if (canvas.value && container.value && rive.value && boundsChanged) {
      if (options.value.fitCanvasToArtboardHeight) {
        container.value.style.height = `${height}px`;
      }
      if (options.value.useDevicePixelRatio) {
        const dpr = window.devicePixelRatio || 1;
        canvas.value.width = dpr * width;
        canvas.value.height = dpr * height;
        canvas.value.style.width = width + 'px';
        canvas.value.style.height = height + 'px';
      } else {
        canvas.value.width = width;
        canvas.value.height = height;
      }
      dimensions.value = { width, height };
      rive.value.startRendering();
    }
    if (rive.value) {
      rive.value.resizeToCanvas();
    }
  }
});

function getCanvasDimensions() {
  const { width, height } =
    container.value?.getBoundingClientRect() ?? new DOMRect(0, 0, 0, 0);

  if (rive.value && options.value.fitCanvasToArtboardHeight) {
    const { maxY, maxX } = rive.value.bounds;
    return { width, height: width * (maxY / maxX) };
  }
  return { width, height };
}

onMounted(() => {
  isMounted.value = true;
  if (canvas.value) {
    const { useOffscreenRenderer } = options.value;
    const r = new Rive({
      useOffscreenRenderer,
      ...props.riveParams,
      canvas: canvas.value,
    });
    r.on(EventType.Load, () => (rive.value = r));
  }
});

onUnmounted(() => {
  isMounted.value = false;
  rive.value?.stopRendering();
  rive.value = null;
});

defineExpose({
  rive,
  canvas,
});
</script>

<template>
  <div ref="container" :style="containerStyle">
    <canvas ref="canvas" style="vertical-align: top"></canvas>
  </div>
</template>

<style scoped></style>
