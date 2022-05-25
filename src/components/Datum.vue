<template>
  <div class="container-fluid">
    <span>
      {{ datetime }}
    </span>
  </div>
</template>

<script>
import { getMonths, getDays } from "../helpers/date.ts";
export default {
  name: "Datum",
  props: {
    title: String,
  },
  data: () => ({
    months: getMonths(),
    days: getDays(),
    datetime: null,
  }),
  created() {},
  mounted() {
    setInterval(() => {
      this.countDown();
    }, 1000);
  },
  components: {},
  methods: {
    checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    },
    countDown() {
      var today = new Date();
      var h = today.getHours();
      var m = today.getMinutes();
      // var s = today.getSeconds();
      // add a zero in front of numbers<10
      m = this.checkTime(m);
      // s = this.checkTime(s);
      this.datetime =
        new Date().getDate() +
        "." +
        this.months[new Date().getMonth()] +
        ", " +
        this.days[new Date().getDay()] +
        ", " +
        h +
        ":" +
        m;
      /*
         +
        ":" +
        s;
        */
    },
  },
};
</script>

<style scoped>
@font-face {
  font-family: myFirstFont;
  src: url("../assets/fonts/Montserrat/Montserrat.ttf");
}
@font-face {
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
}
@font-face {
  font-family: lgFont;
  src: url("../assets/fonts/LG_smart/LgRegular.ttf");
}
div{
  font-family:lgFont;
  font-weight: bold;
  letter-spacing: 1.8px;
}
@media (min-width: 1400px) {
  .container-xxl,
  .container-xl,
  .container-lg,
  .container-md,
  .container-sm,
  .container {
    max-width: 100%;
  }
}
span {
  margin-right: -38px;
  font-style: italic;
}

</style>