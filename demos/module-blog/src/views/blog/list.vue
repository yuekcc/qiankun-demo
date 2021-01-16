<template>
  <div>
    <ul>
      <li v-for="blog in blogList" :key="blog.id">
        <router-link :to="'/blog/details/' + blog.id">{{ blog.title }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { blogService } from './blog.service';

export default {
  data() {
    return {
      blogList: [],
      blogService,
    };
  },
  mounted() {
    this.blogService.listAll().then((list) => {
      this.blogList = list;
    });
  },
};
</script>
