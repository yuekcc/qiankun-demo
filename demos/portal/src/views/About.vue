<template>
  <AboutApp></AboutApp>
</template>

<script>
import { makeMicroAppContainer } from '../iapp';

const AboutApp = makeMicroAppContainer('AboutApp');
export default {
  components: {
    AboutApp,
  },
};
</script>
