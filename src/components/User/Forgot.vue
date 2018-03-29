<template>
    <div class="">
        <input class="uk-input input" type="text" placeholder="Email" v-model="email"/>
        <input class="" type="submit" @click="forgot"/>
    </div>
</template>

<script>
export default {
  name: 'Forgot',
  data () {
    return {
      email: "",
    }
  },
  methods: {
      forgot() {

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
