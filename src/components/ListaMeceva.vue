<template>
  <div class="container">
    <div v-on:click="openFullscreen()" class="enterFs">
      <img src="../assets/images/logo2.png" alt="">
      <p>Kliknite bilo gde za prelaz u Fullscreen</p>
    </div>
    <div class="row">
      <table class="table full">
        <thead>
          <tr>
            <th
              :style="{ textAlign: header.align }"
              v-for="header in tableHeaders"
              :key="header.title"
            >
              <span>{{ header.title }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="matchRow" v-for="match in data" :key="match.sifra">
            <td
              v-if="match.odlozen == 0 && match.prekid == 0"
              class="time"
              v-bind:style="{
                color:
                  match.period == 'FT'
                    ? 'red'
                    : match.period == 'HT'
                    ? 'white'
                    : 'white',
              }"
            >
              {{
                getPeriod(
                  match.period,
                  match.minut,
                  match.status,
                  match.dan_vreme
                )
              }}
            </td>
            <td style="text-align:left"
              v-bind:class="{
                sifraMeca:true
              }"
            >
              {{match.sifra}}
            </td>
            <td v-if="match.odlozen != 0 || match.prekid != 0" class="time">
              <img src="../assets/images/odlozen.png" class="odlozen" />
            </td>
            <td
              v-bind:class="{
                home: true,
                crvena: doesWin(match, 'h'),
                zelena: isGoal(match, 'h'),
              }"
            >
              {{ match.domacin }}
              <img
                v-if="match.d_ck == 1"
                class="red"
                src="../assets/images/red1.png"
              />
              <img
                v-if="match.d_ck == 2"
                class="red"
                src="../assets/images/red2.png"
              />
              <img
                v-if="match.d_ck == 3"
                class="red"
                src="../assets/images/red3.png"
              />
              <span
                v-if="
                  match.d_pen == 1 && match.status != 11 && match.status != 40
                "
                class="blinking crvena razmak"
                >Pen.</span
              >
              <span
                v-if="
                  match.d_pen == -1 && match.status != 11 && match.status != 40
                "
                class="blinking crvena razmak"
                >Pen. Miss</span
              >
            </td>
            <td
              v-bind:class="{
                away: true,
                crvena: doesWin(match, 'a'),
                zelena: isGoal(match, 'a'),
              }"
            >
              {{ match.gost }}
              <img
                v-if="match.g_ck == 1"
                class="red2"
                src="../assets/images/red1.png"
              />
              <img
                v-if="match.g_ck == 2"
                class="red2"
                src="../assets/images/red2.png"
              />
              <img
                v-if="match.g_ck == 3"
                class="red2"
                src="../assets/images/red3.png"
              />
              <span
                v-if="
                  match.g_pen == 1 && match.status != 11 && match.status != 40
                "
                class="blinking crvena razmak"
                >Pen.</span
              >
              <span
                v-if="
                  match.g_pen == -1 && match.status != 11 && match.status != 40
                "
                class="blinking crvena razmak"
                >Pen. Miss</span
              >
            </td>
            <td v-bind:class="{ odd: true, zelena: isGoal(match) }">
              {{ determineOdd(match.d_k, match.g_k, match) }}
            </td>
            <td
              v-bind:class="{
                result: true,
                crvena: isFinished(match.period),
              }"
            >
              <span
                v-if="match.status != 0"
                v-bind:class="{
                  domacin: true,
                  zelena: isGoal(match, 'h'),
                  blinking: isGoal(match, 'h') && isBlinking(match),
                }"
                >{{ match.d_k }}</span
              ><span v-if="match.status != 0">:</span
              ><span
                v-if="match.status != 0"
                v-bind:class="{
                  gost: true,
                  zelena: isGoal(match, 'a'),
                  blinking: isGoal(match, 'a') && isBlinking(match),
                }"
                >{{ match.g_k }}</span
              >
            </td>
            <td v-if="match.prekid == 0 && match.odlozen == 0" class="halftime">
              <div v-if="match.d_p != null && match.g_p != null">
                <span class="domacinPoluvreme">({{ match.d_p }}</span
                >:<span class="gostPoluvreme">{{ match.g_p }})</span>
                {{ match.izmena }}
              </div>
            </td>
            <td
              class="halftime crvena"
              v-if="match.prekid != 0 || match.odlozen != 0"
            >
              <p v-if="match.odlozen != 0">ODLOŽENO</p>
              <p v-if="match.prekid != 0">
                {{
                  match.razlog_prekida
                    ? match.razlog_prekida.toUpperCase()
                    : "PREKID"
                }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <Promene />
    </div>
  </div>
</template>


<script>
import Promene from "./Promene.vue";
export default {
  name: "ListaMeceva",
  methods: {
    isBlinking(match) {
      return this.blinkingData
        .filter((x) => x.entry_time != null)
        .map((x) => x.sifra)
        .includes(match.sifra);
    },
    isPeriod(match) {
      if (typeof match.ch == "string" && match.period != "FT") {
        return true;
      }
    },
    isGoal(match, checkTeam = "") {
      if (match.pos_gol == 0) return false;
      if (
        match.ch &&
        match.d_pen == 0 &&
        match.g_pen == 0 &&
        match.period != "FT" &&
        match.period != "HT"
      ) {
        if (!checkTeam) return true;
        if (checkTeam == "h") {
          return match.pos_gol == 1;
        }
        if (checkTeam == "a") {
          return match.pos_gol == 2;
        }
      }
      return false;
    },
    doesWin(match, checkTeam) {
      if (match.period == "FT") {
        let home = match.d_k;
        let away = match.g_k;
        if (home == away) {
          return false;
        }
        if (checkTeam == "h") {
          return home > away;
        }
        if (checkTeam == "a") {
          return home < away;
        }
      }
      return false;
    },
    isFinished(period) {
      return period == "FT";
    },
    isPaused(period) {
      return period == "HT" || period == "FT";
    },
    getPeriod(period, minut, status, dan_vreme) {
      if (minut == 0) return dan_vreme;
      if (period == "HT" || period == "FT") return period;
      if ((minut >= 45 && status == 1) || (minut >= 90 && status == 2)) {
        if (minut > 45 && status == 1) {
          minut = 45;
        }
        if (minut > 90 && status == 2) {
          minut = 90;
        }
        return minut + "+";
      } else {
        return period;
      }
    },
    getMatchTime(time) {
      return time.slice(11, 16);
    },
    extractTime(datetime) {
      return datetime.slice(2, datetime.length);
    },
    determineOdd(home, away, match) {
      if (this.$store.getters.noOddLeagues.includes(match.liga.toLowerCase()))
        return "";
      if (home == away) {
        return parseFloat(match.iks).toFixed(2);
      } else if (home > away) {
        return parseFloat(match.kec).toFixed(2);
      } else {
        return parseFloat(match.dva).toFixed(2);
      }
    },
    trackFS() {
      document.addEventListener("fullscreenchange", function () {
        var full_screen_element = document.fullscreenElement;
        if (full_screen_element !== null)
          console.log("Page has entered fullscreen mode");
        else console.log("Page has exited fullscreen mode");
      });
      document.addEventListener("mozfullscreenchange", function () {
        var full_screen_element = document.fullscreenElement;
        if (full_screen_element !== null)
          console.log("Page has entered fullscreen mode");
        else console.log("Page has exited fullscreen mode");
      });
      document.addEventListener("webkitfullscreenchange", function () {
        var full_screen_element = document.fullscreenElement;
        if (full_screen_element !== null)
          console.log("Page has entered fullscreen mode");
        else console.log("Page has exited fullscreen mode");
      });
      document.addEventListener("msfullscreenchange", function () {
        var full_screen_element = document.fullscreenElement;
        if (full_screen_element !== null)
          console.log("Page has entered fullscreen mode");
        else console.log("Page has exited fullscreen mode");
      });
    },
    /* Function to open fullscreen mode */
    openFullscreen() {
      var elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) {
        /* Firefox */
        elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        /* IE/Edge */
        elem = window.top.document.body; //To break out of frame in IE
        elem.msRequestFullscreen();
      }
      this.$store.dispatch("getInitialData");
      setInterval(() => {
        this.$store.dispatch("getDifferences");
      }, 6000);
      document.getElementsByClassName("enterFs")[0].style.display = "none";
    },
  },
  computed: {
    data() {
      let obj = this.$store.getters.data; //.slice(0,3)
      return obj;
    },
    tableHeaders() {
      return this.$store.getters.tableHeaders;
    },
    blinkingData() {
      return this.$store.getters.blinking;
    },
  },
  components: {
    Promene,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
@keyframes blinker {
  50% {
    opacity: 0;
  }
}
.blinking {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  animation: blinker 1s linear infinite;
  -webkit-animation: blinker 1s linear infinite;
  width: calc(90%);
}
@font-face {
  font-family: lgFont;
  src: url("../assets/fonts/LG_smart/LgRegular.ttf");
}
@font-face {
  font-family: mySecondFont;
  src: url("../assets/fonts/Roboto_Mono/RobotoMon.ttf");
}
@font-face {
  font-family: myFirstFont;
  src: url("../assets/fonts/Montserrat/Montserrat.ttf");
}
@font-face {
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
}
table tr th:last-child {
  padding-left: 20px !important;
}
table thead tr th {
  font-weight: bold !important;
  font-size: 31px;
  color: #4bff00;
  background: rgb(29, 29, 29);
  line-height: 23px;
}
table tr td{
    vertical-align: middle;

}
/* .table > :not(caption) > * > * {
  padding:0px!important;
} */
table {
  letter-spacing: 0.7px;
  color: #ececec;
  padding-top: 0px;
  font-weight: bold;
}
table tbody {
  border-color: #4bff00 !important;
  border-bottom: 2px solid;
}
table tbody tr {
  height: 4.5vh !important;
  font-size: 37px;
  
}
table tbody tr td {
  padding: 0px !important;
  /* padding-top: 0.5% !important; */
  letter-spacing: 2px;
}
table tr:nth-child(odd) {
  background-color: rgba(48, 48, 48, 0.5) !important;
  border-color: rgba(82, 82, 82, 0.1);
}

table tr:nth-child(even) {
  background-color: rgba(29, 29, 29, 0.5) !important;
  border-color: rgba(29, 29, 29, 0.5);
}
.halftime {
  text-align: left;
  padding-left: 45px !important;
}
.crvena {
  color: red;
}
.razmak {
  padding-left: 5px;
}
.zelena {
  color: #6fd84f;
}
.halftime,
.result {
  letter-spacing: 1.5px !important;
}
h3 {
  margin: 20px 0 0;
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
  color: #4bff00;
}
.red,
.red2,
.odlozen {
  padding-right: 5px;
  width: 23px;
  padding-bottom: 4px;
}

.full {
  margin-bottom: 0px !important;
}

/* columns */

.time {
  width: 10%;
  /* background:rgb(59, 61, 63)!important; */
  --bs-table-accent-bg: none !important;
  /* border-bottom: solid 1px #5e5e5e */
}

.home {
  text-align: left;
  width: 22%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.away {
  text-align: left;
  width: 20%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.odd {
  width: 12%;
}
.result {
  width: 15%;
  /* background:#171A1B!important; */
  --bs-table-accent-bg: none !important;
}
table {
  font-family: lgFont !important;
  font-size: 24px !important;
}
.matchRow {
  /* border-bottom-width: 1px;
  border-color:#ccc */
}

thead {
  border-top: 1px solid #0d672b;
  border-bottom: 1px solid #ccc;
}

#lastChange {
  text-align: center;
  color: #6fd84f;
  font-size: 25px;
  text-shadow: 1px 1px 0 #000;
  font-family: lgFont !important;
  text-transform: uppercase;
  height: 11vh;
  position: relative;
}

.info {
  position: relative;
  bottom: -520px;
  color: #ececec;
  font-family: lgFont;
}
@media (min-width: 1400px) {
  .container-xxl,
  .container-xl,
  .container-lg,
  .container-md,
  .container-sm,
  .container {
    max-width: 95%;
  }
}
.vueperslides:not(.no-shadow):not(.vueperslides--3d)
  .vueperslides__parallax-wrapper:after,
.vueperslides:not(.no-shadow):not(.vueperslides--3d)
  .vueperslides__parallax-wrapper:before {
  box-shadow: none !important;
}

p {
  margin-bottom: 5px !important;
}
.enterFs {
  position: absolute;
  width: 100%;
  height: 100%;
  padding-top: 22%;
  top: 0;
  left: 0;
 background: rgb(0,0,0);
background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(14,45,8,1) 39%, rgba(103,175,107,1) 99%);
  z-index: 9000;
  display: block;

} 

.enterFs p {
  color: white;
  font-size: 42px;
  font-family: myFirstFont;
  word-spacing: 3px;
  text-transform: uppercase;
  text-shadow:  8px 2px 7px #1d1d1d;
}
.enterFs img{
position:absolute;
top: 10%;
right:42%;
width:270px;

}

.sifraMeca{
  width:10%;
  color:#ffffff;
}
</style>
