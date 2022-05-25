<template>
  <!-- <h3 class="appTitle">{{title}}</h3> -->
  <div class="container">
    <div class="row header">
     

      <div class="col-md-12 notifications">
        <NewMessages />
      </div>
      
    </div>
    <div class="row">
       <div class="col-md-3 logo">
        <img src="../assets/images/logo3.png" alt="" />
      </div>
      <div class="col-md-6 title">
        <h3>FUDBAL POSLEDNjE PROMENE</h3>
      </div>
      <div class="col-md-3 time" id="datum">
        <Datum />
      </div>
    </div>
   
  </div>
</template>

<script>
// import axios from 'axios';
import Datum from "./Datum.vue";
import NewMessages from "./NewMessages.vue";

export default {
  name: "Header",
  props: {
    title: String,
  },
  created() {},
  components: {
    Datum,
    NewMessages,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header,
.notifications {
  /* background: #0f1412; */
  /* background: rgba(29, 29, 29, 0.1); */
  /* background: linear-gradient(to bottom, #0d1b0e 1%,#0a160a 41%,#071309 100%); */
}
.notifications{
    margin-top: 1%;

}
.header {
  padding-top: 1%;
    padding-bottom: 3%;

  color: #ececec;
  font-family: myThirdFont;
  vertical-align: baseline !important;
    max-width: 100%;

}
.containter {
  max-width: 100% !important;
}

@font-face {
  font-family: lgFont;
  src: url("../assets/fonts/LG_smart/LgRegular.ttf");
}
@font-face {
  font-family: myFirstFont;
  src: url("../assets/fonts/Montserrat/Montserrat.ttf");
}
@font-face {
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
}
.title h3 {
  padding-top: 1%;
  text-align: center;
  color: #6fd84f;
  font-weight: bold;
  font-size: 2.1rem;
  letter-spacing: 2px;
  font-family: myFirstFont !important;
  text-shadow: 2px 2px rgb(0, 0, 0)!important;

  /* text-shadow: 1px 1px 0 #000,
    -1px 1px 0 #000,
    1px -1px 0 #000,
    -1px -1px 0 #000,
    0px 1px 0 #000,
    0px -1px 0 #000,
    -1px 0px 0 #000,
    1px 0px 0 #000,
    2px 2px 0 #000,
    -2px 2px 0 #000,
    2px -2px 0 #000,
    -2px -2px 0 #000,
    0px 2px 0 #000,
    0px -2px 0 #000,
    -2px 0px 0 #000,
    2px 0px 0 #000,
    1px 2px 0 #000,
    -1px 2px 0 #000,
    1px -2px 0 #000,
    -1px -2px 0 #000,
    2px 1px 0 #000,
    -2px 1px 0 #000,
    2px -1px 0 #000,
    -2px -1px 0 #000; */
}
.title {
  /* border-top: thin solid #1d221d; */
}
.appTitle {
  margin: 20px 0 20px;
}
.logo {
  /* height: 60px; */
  float: left !important;
  padding-left: 0px;
}
.logo img {
  text-align: center;
  display: flex;
  /* margin-left: 25%; */
  width: 71%;
  float: left !important;
   margin-top:-7.9%!important;

}
.notifications .containter {
  margin: 0px !important;
  padding: 0px !important;
  width: 140% !important;
  flex-grow: 6 !important;
}
.vueperslides {
  width: 600px !important;
}

.container{
  height: 13vh!important;
}
#datum{
  margin-top:0.7%;
  font-size:26px;
  /* position: relative; */
  /* left:4.8%; */
  color:#6fd84f;
  
text-align: right


}
@media (min-width: 1400px) {
  .container-xxl,
  .container-xl,
  .container-lg,
  .container-md,
  .container-sm,
  .container {
    max-width: 95%;
    /* height: 100px !important; */
  }
}
</style>
