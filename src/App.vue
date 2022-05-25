<template>
  <div id="app">
    <FudbalPromene />
  </div>
</template>

<script>
import FudbalPromene from "./components/FudbalPromene.vue";

export default {
  name: "App",
  components: {
    FudbalPromene,
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  background-color: #141414;
  /* background: url('assets/images/pozadina2.jpg'); */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  background-blend-mode: color-dodge;

  background-color: #19191a;

  height: 100vh;
  font-family: "Roboto";
}
</style>
