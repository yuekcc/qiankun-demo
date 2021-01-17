<template>
  <div>
    <div>Home.vue</div>
    <div>
      <router-link to="/applets/blogs/">BLOG</router-link>
      <router-link to="/applets/about-me/">about</router-link>
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
