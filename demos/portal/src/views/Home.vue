<template>
  <div>
    <div>Home.vue</div>
    <div>
      <router-link to="/blog/">BLOG</router-link>
      <router-link to="/about/">about</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {},
};
</script>
