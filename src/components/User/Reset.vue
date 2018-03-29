<template>
    <div class="">
        <input class="uk-input input" type="text" placeholder="First Name" v-model="firstName"/>
        <input class="uk-input input" type="text" placeholder="Last Name" v-model="lastName"/>
        <input class="uk-input input" type="text" placeholder="Username" v-model="username"/>
        <input class="uk-input input" type="text" placeholder="Email" v-model="email"/>
        <input class="uk-input input" type="password" placeholder="Password" v-model="password"/>
        <input class="" type="submit" @click="signUp"/>
    </div>
</template>

<script>
export default {
  name: 'Reset',
  data () {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
    }
  },
  methods: {
      signUp() {

      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
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
