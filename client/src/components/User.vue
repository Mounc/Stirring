<template>
  <div class="user" @click="$router.push(`/${user._id}`)">
    <md-card class="card">
      <div class="content">
        <div class="image">
          <img
            class="img"
            style="display: block;"
            :src="`http://${apiAddress}:${apiPort}/static/profile-images/`+ user.image "
            alt
          >
        </div>
        <div class="info">
          <div class="name">{{user.name}}</div>
          <div style="display: flex;">
            <div style="margin: 5px;">{{text('posts')}}: {{user.posts.length}}</div>
            <div style="margin: 5px;">{{text('followers')}}: {{user.followers.length}}</div>
          </div>
        </div>
      </div>
      <div style="margin: 5px;" class="interests">
        {{text('interests')}}:
        <span
          style="margin:0px 2px; color: steelblue;"
          v-for="tag in user.interests"
          :key="tag"
          @click="$event.cancelBubble = true; linkByTag(tag)"
        >#{{tag}}</span>
        <span v-if="!user.interests || !user.interests.length">---</span>
      </div>
    </md-card>
  </div>
</template>

<script>
import { apiAddress, apiPort } from "@/config"
import { actions } from "@/mixins/actions"
import { mapGetters } from "vuex"

export default {
  props: ["user"],
  data() {
    return { apiAddress, apiPort }
  },
  computed: { ...mapGetters(["text"]) },
  mixins: [actions]
}
</script>

<style scoped>
.user {
  margin: 10px;
  width: 30%;
  max-width: 40%;
  /* min-width: 400px; */
}

.card {
  border-radius: 1em;
  overflow: hidden;
  padding: 10px;
}
/* .card:active, */
.card:hover {
  cursor: pointer;
  background-color: honeydew;
}
.content {
  width: 100%;
  height: 100%;
  display: flex;
}
.image {
  margin: auto 5px;
  /* width: 100px; */
  /* height: 100px; */
  overflow: hidden;
}
.img {
  display: block;
  object-fit: cover;
  border: 1px solid lightgray;
  border-radius: 50%;
  margin: 0px;
  min-width: 3rem;
  min-height: 3rem;
  width: 3rem;
  height: 3rem;
}
.name {
  font-size: 2rem;
  margin: 5px;
}

@media screen and (max-width: 1280px) {
  .user {
    width: 45%;
    max-width: 50%;
  }
}

@media screen and (max-width: 800px) {
  .user {
    width: 100%;
    max-width: 100%;
  }
  .info > .name {
    font-size: 1.5rem;
  }
  .info > div {
    font-size: 1rem;
  }
  .interests {
    display: none;
  }
}
</style>