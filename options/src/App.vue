<template>
  <h1>Hello Vue 3 + webpack</h1>
  <button @click="inc" class="btn">count {{ count }}</button>
</template>

<script>
import { ref } from "vue";
export default {
  data() {
    return {};
  },
  components: {},
  setup() {
    const count = ref(0);
    const inc = () => {
      count.value++;
    };
    return {
      count,
      inc,
    };
  },
  mounted() {},
};
</script>
