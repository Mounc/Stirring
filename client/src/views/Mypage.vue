<template>
  <div class="my-page">
    <md-card class="tabs-view" v-if="user">
      <!-- <md-tabs md-sync-route md-alignment="fixed">
        <md-tab id="tab-profile" md-label="profile" @click="$router.push('/mypage/profile')"></md-tab>
        <md-tab id="tab-posts" md-label="posts" @click="$router.push('/mypage/posts')"></md-tab>
        <md-tab id="tab-collections" md-label="collections">collections</md-tab>
        <md-tab id="tab-likes" md-label="likes">likes</md-tab>
        <md-tab id="tab-followings" md-label="followings">followings</md-tab>
      </md-tabs>-->
      <Profile :user="user"/>
      <div class="tabs-container">
        <div class="tabs-navs">
          <!-- <md-button v-bind:class="isActive('profile')" @click="$router.push(`/${id}/profile`)">profile</md-button> -->
          <span v-bind:class="isActive('posts')" class="btn" @click="$router.push(`/${id}/posts`)">
            <span class="large">{{text('posts') | upperCase}}</span>
            <span class="small">
              <i class="far fa-image"></i>
            </span>
            {{user.posts.length}}
          </span>
          <span
            v-bind:class="isActive('collections')"
            class="btn"
            @click="$router.push(`/${id}/collections`)"
          >
            <span class="large">{{text('collections') | upperCase}}</span>
            <span class="small">
              <i class="far fa-star"></i>
            </span>
            {{user.collections.length}}
          </span>
          <span v-bind:class="isActive('likes')" class="btn" @click="$router.push(`/${id}/likes`)">
            <span class="large">{{text('likes') | upperCase}}</span>
            <span class="small">
              <i class="far fa-heart"></i>
            </span>
            {{user.likes.length}}
          </span>
          <span
            v-bind:class="isActive('followings')"
            class="btn"
            @click="$router.push(`/${id}/followings`)"
          >
            <span class="large">{{text('followings') | upperCase}}</span>
            <span class="small">
              <i class="fas fa-walking"></i>
            </span>
            {{user.followings.length}}
          </span>
        </div>
        <div class="tabs-content">
          <router-view :id="id" :user="user"></router-view>
        </div>
      </div>
    </md-card>
  </div>
</template>

<script>
import UserService from "@/services/UserService"
import Profile from "@/components/Profile"
import { EventBus } from "@/mixins/EventBus"
import { mapGetters } from "vuex"

export default {
  components: { Profile },
  props: ["id"],
  data() {
    return {
      user: null
    }
  },
  computed: {
    ...mapGetters(["text"])
  },
  methods: {
    isActive(name) {
      return this.$route.name === name ? "selected" : null
    },
    async loadUser() {
      const res = await UserService.getUser(this.id, {
        count: { new: 2, old: 0 }
      })
      this.user = res.data.user[0]
    }
  },
  mounted() {
    EventBus.$on("loadUser", () => {
      this.loadUser()
    })
    this.loadUser()
  },
  watch: {
    id() {
      this.loadUser()
    }
  }
}
</script>

<style scoped>
.my-page {
  width: 100%;
  padding: 20px 3%;
}
.tabs-view {
  padding: 10px;
  border-radius: 1em;
  overflow: hidden;
}
.tabs-container {
  border: 1px solid lightgray;
  margin: 20px 10px;
  border-radius: 0.5rem;
  overflow: hidden;
}
.tabs-navs {
  border-bottom: 1px solid lightgray;
  display: flex;
}
.tabs-content {
  min-height: 100px;
  padding: 10px 10px;
}
.selected {
  /* border: 1px solid lightblue; */
  background-color: ghostwhite;
  color: steelblue;
}
.btn {
  display: inline-block;
  border-radius: 1em;
  overflow: hidden;
  padding: 10px;
  margin: 5px;
  font-size: 1rem;
}
/* .btn:active, */
.btn:hover {
  cursor: pointer;
  color: steelblue;
}
.large {
  display: inline;
}
.small {
  display: none;
}

@media screen and (max-width: 800px) {
  .my-page {
    width: 100%;
    margin: 0px auto;
  padding: 10px 0%;
  }
  .tabs-view {
    padding: 0px;
  }
  .tabs-container {
    border: 1px solid lightgray;
    margin: 5px 1px;
    border-radius: 1em;
    overflow: hidden;
  }
  .tabs-navs {
    border-bottom: 1px solid lightgray;
    justify-content: center;
  }

  .tabs-content {
    min-height: 100px;
    padding: 0px;
  }
  .btn {
    font-size: 1rem;
    text-emphasis: center;
    margin: 5px 2px;
    padding: 5px 10px;
  }
  .large {
    display: none;
  }
  .small {
    display: inline;
  }
}
</style>


