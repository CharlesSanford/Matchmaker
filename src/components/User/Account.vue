<template>
    <div class="">
        <div class=" uk-container-center uk-container uk-width-medium-2-3">
            <div class="">

                <h1 class="user-block__header">Account</h1>

                <div class="user-block__content">
                    <v-form  v-on:submit.prevent autocomplete="off">
                        <div
                            class="uk-form-row"
                            v-bind:class="{ 'uk-form-danger': $v.credentials.firstName.$error, 'uk-form-success': !$v.credentials.firstName.$invalid && $v.credentials.firstName.$dirty }" >

                            <v-text-field
                                label="First Name"
                                autofocus
                                autocomplete=""
                                type="text"
                                name="signup-form-firstName"
                                aria-describedby="First Name"
                                v-model.trim="credentials.firstName"
                                @input="$v.credentials.firstName.$touch()"
                                v-bind:class="{ 'uk-form-danger': $v.credentials.firstName.$error, 'uk-form-success': !$v.credentials.firstName.$invalid && $v.credentials.firstName.$dirty }"
                            ></v-text-field>
                            <div class="form-group__message" v-if="$v.credentials.firstName.$error">Please enter your first name.</div>
                        </div>

                        <div
                            class="uk-form-row"
                            v-bind:class="{ 'uk-form-danger': $v.credentials.lastName.$error, 'uk-form-success': !$v.credentials.lastName.$invalid && $v.credentials.lastName.$dirty }" >

                            <v-text-field
                                label="Last Name"
                                type="text"

                                name="signup-form-lastName"
                                aria-describedby="Last Name"
                                v-model.trim="credentials.lastName"
                                @input="$v.credentials.lastName.$touch()"
                            ></v-text-field>
                            <div class="form-group__message" v-if="$v.credentials.lastName.$error">Please enter your last name.</div>
                        </div>

                        <div
                            class="uk-form-row"
                            v-bind:class="{ 'uk-form-danger': $v.credentials.username.$error, 'uk-form-success': !$v.credentials.username.$invalid && $v.credentials.username.$dirty }" >
                            <v-text-field
                                label="Username"
                                type="text"
                                name="signup-form-username"
                                aria-describedby="Username"
                                v-model.trim="credentials.username"
                                @input="$v.credentials.username.$touch()"
                            ></v-text-field>
                            <div class="form-group__message" v-if="!$v.credentials.username.$minLength && $v.credentials.username.$error">Username must be at least 3 characters.</div>
                            <div class="form-group__message" v-if="$v.credentials.username.$error">Please enter your username.</div>
                        </div>

                        <div
                            class="uk-form-row"
                            v-bind:class="{ 'uk-form-danger': $v.credentials.email.$error, 'uk-form-success': !$v.credentials.email.$invalid && $v.credentials.email.$dirty }" >
                            <v-text-field
                                label="Email"
                                type="text"

                                name="signup-form-email"
                                aria-describedby="Email"
                                v-model.trim="credentials.email"
                                @input="$v.credentials.email.$touch()"
                            ></v-text-field>
                            <div class="form-group__message" v-if="$v.credentials.email.$error">Please enter a valid email address.</div>
                        </div>

                         <v-expansion-panel>
                            <v-expansion-panel-content>
                            <div slot="header">Game Usernames</div>
                            <v-card>
                                <v-card-text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <v-btn
                            id="signup-submit-button"
                            @click="submit()"
                        >
                        <span v-if="pending"><i class="fa fa-circle-o-notch fa-spin fa-fw"></i></span>
                        <span v-else>Update Account</span>
                        </v-btn>
                    </v-form>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import { required, minLength, sameAs, email } from "vuelidate/lib/validators";
import { mapState } from "vuex";

export default {
  name: "Account",
  data() {
    return {
      credentials: {
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
      },
      pending: false
    };
  },
  computed: {
    ...mapState({
        user: state => state.user.user,
        queue: state => state.queue,
        socket: state => state.socket,
        lobby: state => state.lobby,
    }),
  },
  methods: {
    forgot() {},
    submit() {}
  },
  validations: {
    credentials: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      username: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(8)
      },
      passwordConfirm: {
        sameAs: sameAs("password")
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
