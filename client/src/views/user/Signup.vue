<template>
  <div class="signup wrapper">
    <div class="container">
      <div class="item" style="font-size: 3rem; text-align: center;">
        <span>{{text('signup')}}</span>
      </div>
      <div class="item" style="text-align: center; color: red; font-size: 1rem;">
        <span>{{ text(error) }}</span>
      </div>
      <md-field class="item" md-clearable>
        <label class="label">{{ text('name') }}</label>
        <md-input v-model="name.value" @keyup.enter="$refs.email.$el.focus()"></md-input>
        <span
          class="md-helper-text helper"
          v-if="name.helper"
          style="color: green;"
        >{{ text(name.helper) }}</span>
        <span
          class="md-helper-text error"
          v-if="name.error"
          style="color: red;"
        >{{ text(name.error) }}</span>
      </md-field>
      <div class="space" style="height: 20px"></div>
      <md-field class="item" md-clearable>
        <label class="label">{{ text('email') }}</label>
        <md-input
          v-model="email.value"
          type="email"
          ref="email"
          @keyup.enter="$refs.password.$el.focus()"
        ></md-input>
        <span
          class="md-helper-text helper"
          v-if="email.helper"
          style="color: green;"
        >{{ text(email.helper) }}</span>
        <span
          class="md-helper-text error"
          v-if="email.error"
          style="color: red;"
        >{{ text(email.error) }}</span>
      </md-field>
      <div class="space" style="height: 20px"></div>
      <md-field class="item">
        <label class="label">{{ text('password') }}</label>
        <md-input
          v-model="password.value"
          type="password"
          ref="password"
          @keyup.enter="$refs.passwordConfirm.$el.focus()"
        ></md-input>
        <span
          class="md-helper-text helper"
          v-if="password.helper"
          style="color: green;"
        >{{ text(password.helper) }}</span>
        <span
          class="md-helper-text error"
          v-if="password.error"
          style="color: red;"
        >{{ text(password.error) }}</span>
      </md-field>
      <div class="space" style="height: 20px"></div>
      <md-field class="item">
        <label class="label">{{ text('passwordConfirm') }}</label>
        <md-input
          v-model="password.confirm"
          type="password"
          ref="passwordConfirm"
          @keyup.enter="signup"
        ></md-input>
        <span
          class="md-helper-text helper"
          v-if="password.helper"
          style="color: green;"
        >{{ text(password.helper) }}</span>
        <span
          class="md-helper-text error"
          v-if="password.error"
          style="color: red;"
        >{{ text(password.error) }}</span>
      </md-field>
      <div class="space" style="height: 40px"></div>
      <md-button
        class="item btn md-raised"
        style="background-color: black; color:white;"
        @click="signup"
      >
        <span>{{ text('signup') }}</span>
      </md-button>
      <!-- <md-button class="md-raised item">
        <span>{{text('signupGoogle')}}</span>
      </md-button>
      <md-button class="md-raised item">
        <span>{{text('signupFacebook')}}</span>
      </md-button> -->
    </div>
    <SnackAlert
      v-bind:duration="3000"
      :message="text('signupSuccess')"
      :showSnackAlert="isSuccess"
    />
  </div>
</template>

<script>
import service from "@/services/UserService"
import { mixins } from "@/mixins/validations"
import { mapGetters } from "vuex"
import SnackAlert from "@/components/SnackAlert"

export default {
  name: "signup",
  components: { SnackAlert },
  computed: {
    ...mapGetters(["text"])
  },
  data() {
    return {
      email: {
        value: "",
        helper: null,
        error: null,
        valid: false
      },
      password: {
        value: "",
        confirm: null,
        helper: null,
        error: null,
        valid: false
      },
      name: {
        value: "",
        helper: null,
        error: null,
        valid: false
      },
      error: null,
      isSuccess: false
    }
  },
  methods: {
    async signup() {
      if (
        this.email.value.length === 0 ||
        this.password.value.length === 0 ||
        this.name.value.length === 0
      ) {
        this.error = "loginError"
        return
      }
      if (!this.email.valid || !this.password.valid || !this.name.valid) {
        this.error = "validError"
        return
      } else {
        this.error = null
      }
      const res = await service.signup({
        name: this.name.value,
        email: this.email.value,
        password: this.password.value
      })
      if (!res.data.success) this.error = res.data.message
      if (res.data.success) {
        this.error = null
        this.isSuccess = true
        setTimeout(() => {
          this.$router.push({ name: "home" })
        }, 2000)
      }
    }
  },
  watch: {
    "name.value": function() {
      this.validateName(this.name)
    },
    "email.value": function() {
      this.validateEmail(this.email)
    },
    "password.value": function() {
      this.validatePassword(this.password)
    },
    "password.confirm": function() {
      this.validatePassword(this.password)
    }
  },
  mixins: [mixins]
}
</script>

<style scoped>
.wrapper {
  padding: 20px;
}
.container {
  margin-left: auto;
  margin-right: auto;
  padding: 50px;
  width: 600px;
  border: 1px solid black;

  display: flex;
  flex-direction: column;
  /* align-items: center; */
}
/* .btn:active, */
.btn:hover {
  cursor: pointer;
  font-weight: 400;
}
.signup img {
  margin-bottom: 20px;
  width: 400px;
  align-self: center;
}
.signup .title {
  font-size: 2rem;
  text-align: center;
}
.signup .item {
  margin: 10px;
}
.item .label {
  color: darkgrey;
}
.signup .btn {
  font-size: 1.5rem;
}
.oauth {
  display: flex;
  flex-wrap: wrap;
  padding: 0;
  margin: 0;
}
.oauth > .item {
  flex-grow: 1;
}
@media screen and (max-width: 800px) {
  .container {
    width: 95%;
    margin-top: 10px;
    padding: 20px;
  }
  .signup .item {
    width: 95%;
    margin: 10px auto;
    padding: 10px 0;
  }
  .signup .btn {
    font-size: 1rem;
  }
}
</style>

