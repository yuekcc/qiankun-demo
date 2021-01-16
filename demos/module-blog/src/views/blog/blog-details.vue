<template>
  <div>
    <div v-if="post">
      <h1>{{ post.title }}</h1>
      <h3>{{ post.id }}</h3>
      <div v-html="post.context"></div>
    </div>
  </div>
</template>

<script>
import { blogService } from './blog.service';
import marked from 'marked';

export default {
  data() {
    return {
      postRaw: null,
      blogService,
    };
  },
  computed: {
    post() {
      if (!this.postRaw) {
        return null;
      }

      return {
        id: this.postRaw.id,
        title: this.postRaw.title,
        context: marked(this.postRaw.markdownText),
      };
    },
  },
  mounted() {
    this.blogService.loadDetails(this.$route.params.postId).then((post) => (this.postRaw = post));
  },
};
</script>
