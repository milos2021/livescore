<template>
  <div class="container-fluid">
      <Header title="Fudbal Live"/>
      <ListaMeceva/>
  </div>
  
</template>

<script>
// import axios from 'axios';
import Header from './Header.vue'
import ListaMeceva from './ListaMeceva.vue'
export default {
  name: 'FudbalPromene',
  created(){
  },
  components:{
    Header,
    ListaMeceva
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body{
  background:black
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
