<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useWindowSize } from '../src/utils';
// Uncomment import and local "components" registration if library is not registered globally.
import { Rive, SimpleRive } from '@/entry.esm';

export default defineComponent({
  name: 'ServeDev',
  components: {
    Rive,
    SimpleRive,
  },
  setup() {
    const rive = ref(null);
    const size = useWindowSize();
    const riveParams = {
      src: 'https://public.rive.app/community/runtime-files/2396-4820-animated-head.riv',
      autoplay: true,
      animations: 'idlePreview',
      onLoad: () => {
        console.log('Rive loaded');
      },
    };
    const riveOptions = {
      //   fitCanvasToArtboardHeight: true,
      //   useOffscreenRenderer: true,
    };
    onMounted(() => {
      if (rive.value) {
        console.log('Rive Instance: ', rive.value);
      }
    });
    return {
      size,
      riveParams,
      riveOptions,
    };
  },
});
</script>

<template>
  <div id="app">
    <Rive
      class="rive"
      ref="rive"
      :rive-params="riveParams"
      :options="riveOptions"
    />
    {{ size }}
  </div>
</template>

<style scoped>
#app {
  width: 100vw;
  height: 100vh;
}
.rive {
  width: 50vw;
  height: 500px;
}
</style>
