<template>
  <div class="dino-game">
    <iframe
      src="https://chromedino.com/"
      frameborder="0"
      scrolling="no"
      width="800px"
      height="900px"
      loading="lazy"
    ></iframe>
  </div>
</template>

<script>
import PostCreate from "@/components/PostCreate.vue";
import PostList from "@/components/PostList.vue";
import { mapActions, mapState } from "vuex";
export default {
  name: "about-view",
  data() {
    return {
      posts: [],
    };
  },
  computed: {
    user() {
      return this.$store.state.stuff.data;
    },
  },
  methods: {
    ...mapActions({
      getUserByUid: "stuff/getUserStuff",
    }),
    createPost(post) {
      this.posts.unshift(post);
    },
  },
  components: {
    PostCreate,
    PostList,
  },
  beforeMount() {
    this.getUserByUid();
  },
};
</script>
<style scoped>
.dino-game {
  display: flex;
  justify-content: center;
}
</style>
