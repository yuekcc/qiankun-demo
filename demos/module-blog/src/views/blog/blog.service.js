import File1 from './mock/1.txt';
import File2 from './mock/2.txt';

const BLOG_LIST = [
  {
    id: 'd95014802df398e67b3f0d7b3fcb6aeb106df8d71a9be880b7826dcbabcf82f1',
    title: '073.精读《sqorn 源码》',
    markdownText: File1,
  },
  {
    id: '63a1268cf0a25aaaba7ea95ecbfc3e22f3e56257d1b62a7055e62d9fe2282c3d',
    title: '069.精读《SQL vs Flux》',
    markdownText: File2,
  },
];

class BlogService {
  listAll() {
    return Promise.resolve(BLOG_LIST);
  }
  loadDetails(id) {
    const post = BLOG_LIST.find(it => it.id === id);
    return Promise.resolve(post);
  }
}

export const blogService = new BlogService();
