<template>
  <div id="lastChange">
    <div class="row">
      <div class="col-md-12">
        <span class="change">POSLEDNjA PROMENA</span>
        <table v-if="match" class="table full">
          <tbody>
            <tr class="matchRow">
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
                    match.d_pen == -1 &&
                    match.status != 11 &&
                    match.status != 40
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
                    match.g_pen == -1 &&
                    match.status != 11 &&
                    match.status != 40
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
                  v-bind:class="{
                    domacin: true,
                    zelena: isGoal(match, 'h'),
                    blinking: isGoal(match, 'both') && isBlinking(match),
                  }"
                  >{{ match.d_k }}</span
                >
                <span
                  v-bind:class="{
                    blinking: isGoal(match, 'both') && isBlinking(match),
                  }"
                  >:</span
                >
                <span
                  v-bind:class="{
                    gost: true,
                    zelena: isGoal(match, 'a'),
                    blinking: isGoal(match, 'both') && isBlinking(match),
                  }"
                  >{{ match.g_k }}</span
                >
              </td>
              <td
                v-if="match.prekid == 0 && match.odlozen == 0"
                class="halftime"
              >
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
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Promene",
  props: {
    title: String,
  },
  data: () => ({}),
  created() {},
  components: {},
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
        if (checkTeam == "both") {
          return match.pos_gol == 1 || match.pos_gol == 2;
        }
      }
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
  },
  computed: {
    match() {
      let obj = this.$store.getters.lastChange;
      return obj;
    },
    tableHeaders() {
      return this.$store.getters.tableHeaders;
    },
    blinkingData() {
      return this.$store.getters.blinking;
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
  font-family: myFirstFont;
  src: url("../assets/fonts/Montserrat/Montserrat.ttf");
}
@font-face {
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
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
.title h3 {
  padding-top: 2px;
  padding-bottom: 2px;
  text-align: center;
  color: #4bff00;
  font-size: 22px;
  font-family: myThirdFont !important;
}
.title {
  border-top: thin solid #1d221d;
}
.full {
  margin-bottom: 0rem !important;
}
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
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
}
table tr th:last-child {
  padding-left: 20px !important;
  font-weight: bold;
}
table thead tr th {
  font-weight: bold !important;
  font-size: 18px;
  color: #4bff00;
  background: rgb(29, 29, 29);
  line-height: 20px;

}
/* .table > :not(caption) > * > * {
  padding:0px!important;
} */
.matchRow{
  /* padding-top: 17px; */
font-size: 35px;
}
table {
  letter-spacing: 0.7px;
  font-family: Helvetica !important;
  color: #ececec;
  padding-top: 0px;
}
table tbody {
  border-color: #4bff00 !important;
  font-size: 27px;
}
table tbody tr td {
  padding: 0px !important;
  font-weight: bold;
  vertical-align: middle;

}
table tbody tr {
  line-height: 8vh;
    font-size: 51px!important;

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
  text-align: right;
  border-bottom-width: 0px;
  margin-left: 35px !important;
}
.row > * {
  padding-left: 6px;
  padding-right: 6px;
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
  color: #42b983;
}
.red,
.red2,
.odlozen {
  padding-right: 5px;
  width: 20px;
  padding-bottom: 4px;
}

.full {
  margin-bottom: 0px !important;
}

/* columns */

.time {
  width: 9.8%;
  /* background:rgb(59, 61, 63)!important; */
  --bs-table-accent-bg: none !important;
  /* border-bottom: solid 1px #5e5e5e */
  border-bottom-width: 0px;
}

.home {
  text-align: left;
  width: 19.5% !important;
  overflow: hidden;
  margin-right: 11px;
  margin-left: -0.3%;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  border-bottom-width: 0px;
}
.away {
  text-align: left;
  width: 21.5% !important;
  overflow: hidden;
  margin-left: 1.9%;
  /* margin-right: 3.8%; */
  border-bottom-width: 0px;

  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.odd {
  width: 11%;
  border-bottom-width: 0px;
}
.result {
  width: 15%;
  /* background:#171A1B!important; */
  --bs-table-accent-bg: none !important;
  border-bottom-width: 0px;
}
table {
  font-family: lgFont !important;
  background: rgba(0, 255, 0, 0.1) !important;
}
.matchRow {
  border-top: 1px solid #4bff00 !important;
  border-bottom: 1px solid #4bff00 !important;
  display: flex;
}

thead {
  border-top: 1px solid #0d672b;
}


.sifraMeca{
  width:10%;
  /* color:#ffed49; */
    border-bottom-width: 0px;

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
.table > :not(:first-child) {
  border-top: 1px solid #62b449 !important;
}
p {
  margin-bottom: 5px !important;
}
.change {
  font-weight: bolder;
  text-transform: none;
  font-family: myFirstFont !important;
  letter-spacing: 5px;

  word-spacing: 7px;
}
</style>