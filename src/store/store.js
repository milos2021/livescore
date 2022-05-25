import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
// eslint-disable-next-line no-console
import _ from 'lodash';

Vue.use(Vuex)
/*
ako je d_pen=1 i statusi nisu 11 i 40, to je Penal
ako je d_pen=-1 to je Promasen Penal
ako je ch true to je znak da se nesto desava, ako nije penal, onda je gol
ovde cemo raditi poredjenje sa prethodnim stateom ovog meca, uzecemo u obzir sta se razlikuje
ako je razlika u d_k ili g_k, gledamo pos_gol i naznacavamo promenu kod domacina odnosno gosta
izbaciti soccer fudbal
*/
export default new Vuex.Store({
    state: {
        mec_uzivos: {
            FD: []
        },
        mec_zavrsenos: {
            FD: []
        },
        mec_najavas: {
            FD: []
        },
        mec_uzivos_full: {
            FD: []
        },
        mec_zavrsenos_full: {
            FD: []
        },
        mec_najavas_full: {
            FD: []
        },
        uzivo_promene: [],
        uzivo_history: [],
        last_change: null,
        time_n: 0,
        igracs: [],
        time_i: 0,
        time_z: 0,
        internal_data: {
            column_names: [

                {
                    title: "Minut",
                    align: "center"
                },
                {
                    title:"Šifra",
                    align:"left"
                },
                {
                    title: "Domaćin",
                    align: "left"
                },
                {
                    title: "Gost",
                    align: "left"
                },
                {
                    title: "Kvota",
                    align: "center"
                },
                {
                    title: "Rezultat",
                    align: "center"
                },
                {
                    title: "Poluvreme",
                    align: "left"
                }
            ],
            no_odd_leagues: ["soccer fudbal"]
        },
        today: new Date().toISOString()
    },

    getters: {
        uzivoPromene: state => {
            return state.uzivo_promene
        },
        blinking: state => {
            return state.uzivo_promene
        },
        lastChange: state => {
            return state.last_change
        },
        data: state => {
            return (state.mec_najavas.FD ? state.mec_najavas.FD : []).concat(state.mec_zavrsenos.FD ? state.mec_zavrsenos.FD : []).concat(state.mec_uzivos.FD)
        },
        times: state => {
            return {
                time_i: state.time_i,
                time_n: state.time_n,
                time_z: state.time_z,
                time_u: state.time_u
            }
        },
        tableHeaders: state => {
            return state.internal_data.column_names
        },
        noOddLeagues: state => {
            return state.internal_data.no_odd_leagues
        }
    },

    mutations: {
        //odlozen u zavrsene, prekinut u najavu
        SET_INITIAL_DATA(state, data) {
            var full = _.cloneDeep(data.data);
            var liveAll = _.cloneDeep(data.full);

            liveAll.forEach(match => {
                if (match.poslednja_promena == null) {
                    match.poslednja_promena = match.vreme
                }
            })

            liveAll = liveAll.sort(function (a, b) {
                return new Date(b.poslednja_promena) - new Date(a.poslednja_promena)
            })
            full.mec_zavrsenos.FD = full.mec_zavrsenos.FD.sort(function (a, b) {
                return new Date(b.vreme) - new Date(a.vreme)
            })
            full.mec_najavas.FD = full.mec_najavas.FD.sort(function (a, b) {
                return new Date(b.poslednja_promena_ck_pen ? b.poslednja_promena_ck_pen : b.vreme) - new Date(a.poslednja_promena_ck_pen ? a.poslednja_promena_ck_pen : a.vreme)
            })
            calculateNumberOfMatchesAndSetState(state, full, liveAll)
            state.last_change = liveAll.length > 0 ? getLastElement(liveAll) : (full.mec_zavrsenos.FD.length > 0 ? getLastElement(full.mec_zavrsenos.FD) : getLastElement(full.mec_najavas.FD))
            let sifra = state.last_change['sifra']
            state.mec_uzivos.FD = state.mec_uzivos.FD.filter(x => x.sifra != sifra)
            state.mec_zavrsenos.FD = state.mec_zavrsenos.FD.filter(x => x.sifra != sifra)
            state.last_change.ch = true
            state.mec_zavrsenos_full = full.mec_zavrsenos
            state.mec_najavas_full = full.mec_najavas
            state.time_i = full.time_i
            state.time_n = full.time_n
            state.time_u = full.time_u
            state.time_z = full.time_z
            checkBlinking(state)
        },
        CHANGE_MATCH(state, change) {
            var full = _.cloneDeep(change.full);

            full.forEach(match => {
                if (match.poslednja_promena == null) {
                    var vreme = new Date(match.vreme)
                    vreme.setSeconds(vreme.getSeconds() + match.minut)
                    match.poslednja_promena = new Date(vreme).toISOString()
                }
            })



            change = _.cloneDeep(change.data);

            change.mec_uzivos.FD.forEach(match => {
                if (match.poslednja_promena == null) {
                    var vreme = new Date(match.vreme)
                    vreme.setSeconds(vreme.getSeconds() + match.minut)
                    match.poslednja_promena = new Date(vreme).toISOString()
                }
            })

            if (change.mec_najavas.FD.length > 0) {
                state.mec_najavas_full = change.mec_najavas
            }

            if (change.mec_zavrsenos.FD.length > 0) {
                state.mec_zavrsenos_full = change.mec_zavrsenos
            }

            var d = new Date()
            d.setSeconds(d.getSeconds() - 15);

            for (let i = 0; i < change.mec_uzivos.FD.length; i++) {
                for (let j = 0; j < state.mec_najavas_full.FD.length; j++) {
                    if (state.mec_najavas_full.FD[j].sifra == change.mec_uzivos.FD[i].sifra) {
                        change.mec_uzivos.FD.filter(x => x.sifra != state.mec_najavas_full.FD[j].sifra)
                    }
                }
            }

            for (let i = 0; i < change.mec_uzivos.FD.length; i++) {
                for (let j = 0; j < state.mec_zavrsenos_full.FD.length; j++) {
                    if (state.mec_zavrsenos_full.FD[j].sifra == change.mec_uzivos.FD[i].sifra) {
                        change.mec_uzivos.FD.filter(x => x.sifra != state.mec_najavas_full.FD[j].sifra)
                    }
                }
            }

            let najavaPop = []
            for (let i = 0; i < state.mec_najavas_full.FD.length; i++) {
                for (let j = 0; j < change.mec_uzivos.FD.length; j++) {
                    if (state.mec_najavas_full.FD[i].sifra == change.mec_uzivos.FD[j].sifra) {
                        najavaPop.push(state.mec_najavas_full.FD[i].sifra)
                    }
                }
            }

            let zavrsenoPop = []
            for (let i = 0; i < state.mec_zavrsenos_full.FD.length; i++) {
                for (let j = 0; j < change.mec_uzivos.FD.length; j++) {
                    if (state.mec_zavrsenos_full.FD[i].sifra == change.mec_uzivos.FD[j].sifra) {
                        zavrsenoPop.push(state.mec_najavas_full.FD[i].sifra)
                    }
                }
            }

            state.mec_najavas_full.FD = state.mec_najavas_full.FD.filter(x => !najavaPop.includes(x.sifra))
            state.mec_zavrsenos_full.FD = state.mec_zavrsenos_full.FD.filter(x => !zavrsenoPop.includes(x.sifra))

            change.mec_uzivos.FD = change.mec_uzivos.FD.sort(function (a, b) {
                return new Date(b.poslednja_promena) - new Date(a.poslednja_promena)
            })
            change.mec_zavrsenos.FD = change.mec_zavrsenos.FD.sort(function (a, b) {
                return new Date(b.vreme) - new Date(a.vreme)
            })
            change.mec_najavas.FD = change.mec_najavas.FD.sort(function (a, b) {
                return new Date(b.poslednja_promena_ck_pen ? b.poslednja_promena_ck_pen : b.vreme) - new Date(a.poslednja_promena_ck_pen ? a.poslednja_promena_ck_pen : a.vreme)
            })

            let raspodela = calculateNumberOfMatches(state, change); /*uzivo,zavrseno,najava,mec_uzivos,mec_zavrsenos,mec_najavas*/
            raspodela.mec_uzivos = raspodela.mec_uzivos.sort(function (a, b) {
                return new Date(a.poslednja_promena) - new Date(b.poslednja_promena)
            })
            state.mec_uzivos.FD = raspodela.mec_uzivos
            if (raspodela.uzivo > 0) {
                if (state.uzivo_promene.length == 0) {
                    state.uzivo_promene = addEntryTimes(raspodela.mec_uzivos, false, state)
                } else {
                    let incomingMatches = []
                    for (let i = 0; i < raspodela.mec_uzivos.length; i++) {
                        for (let j = 0; j < state.uzivo_promene.length; j++) {
                            if (raspodela.mec_uzivos[i]['sifra'] == state.uzivo_promene[j]['sifra']) {
                                let newChange = raspodela.mec_uzivos[i]
                                let oldChange = state.uzivo_promene[j]
                                if (oldChange.poslednja_promena != newChange.poslednja_promena) {
                                    incomingMatches.push(newChange.sifra)
                                }


                            }
                        }
                    }

                    let flag = addEntryTimes(raspodela.mec_uzivos, incomingMatches, state);
                    if (flag != -1) {
                        state.uzivo_promene = flag
                    }

                    incomingMatches = []



                }
            }


            state.last_change = raspodela.mec_uzivos.length > 0 ? getLastElement(raspodela.mec_uzivos) : (raspodela.mec_zavrsenos.length > 0 ? getLastElement(raspodela.mec_zavrsenos) : getLastElement(raspodela.mec_najavas))
            let sifra = state.last_change['sifra']
            state.uzivo_history = state.uzivo_history.sort(function (a, b) {
                return new Date(a.poslednja_promena) - new Date(b.poslednja_promena)
            })
            state.mec_uzivos.FD = state.mec_uzivos.FD.filter(x => x.sifra != sifra)
            state.mec_zavrsenos.FD = raspodela.mec_zavrsenos.filter(x => x.sifra != sifra)
            for (let i = 0; i < full.length; i++) {
                for (let j = 0; j < state.mec_uzivos.FD.length; j++) {
                    if (full[i]['sifra'] == state.mec_uzivos.FD[j]['sifra']) {
                        state.mec_uzivos.FD[j]['minut'] = full[i]['minut']
                        state.mec_uzivos.FD[j]['period'] = full[i]['period']
                    }
                }

            }

        },
        CHANGE_TIMES(state, times) {
            Object.keys(times).forEach(key => {
                if (times[key]) {
                    state[key] = times[key]
                }
            })
        }
    },

    actions: {
        getInitialData({ commit, state }) {
            var data = JSON.stringify({ "today": state.today, "time_u": state.time_u, "time_n": state.time_n, "time_z": state.time_z, "time_i": state.time_i })
            var config = {
                method: 'post',
                url: 'http://rezultati.soccerbet.rs/live_score_danas/',
                data: data
            };
            axios(config).then(
                response => {
                    var full;
                    if (!Object.prototype.hasOwnProperty.call(response.data, "mec_uzivos")) {
                        response.data["mec_uzivos"] = { FD: [] }
                    } else {
                        if (!Object.prototype.hasOwnProperty.call(response.data.mec_uzivos, "FD")) {
                            response.data["mec_uzivos"] = { FD: [] }
                            full = _.cloneDeep(response.data.mec_uzivos.FD)
                        } else {
                            full = _.cloneDeep(response.data.mec_uzivos.FD)
                            response.data.mec_uzivos.FD = response.data.mec_uzivos.FD.filter(x => x.ch != false);
                        }
                    }
                    if (!Object.prototype.hasOwnProperty.call(response.data, "mec_zavrsenos")) {
                        response.data["mec_zavrsenos"] = { FD: [] }
                    } else {
                        if (!Object.prototype.hasOwnProperty.call(response.data.mec_zavrsenos, "FD")) {
                            response.data["mec_zavrsenos"] = { FD: [] }
                        } else {
                            response.data.mec_zavrsenos.FD = response.data.mec_zavrsenos.FD.filter(x => x.prekid == 0 && x.odlozen == 0)
                        }
                    }
                    if (!Object.prototype.hasOwnProperty.call(response.data, "mec_najavas")) {
                        response.data["mec_najavas"] = { FD: [] }
                    } else {
                        if (!Object.prototype.hasOwnProperty.call(response.data.mec_najavas, "FD")) {
                            response.data["mec_najavas"] = { FD: [] }
                        } else {
                            response.data.mec_najavas.FD = response.data.mec_najavas.FD.filter(x => x.prekid == 0 && x.odlozen == 0)
                        }
                    }
                    commit("SET_INITIAL_DATA", { data: response.data, full: full ? full : [] })
                }
            )
        },
        getDifferences({ state, commit }) {
            var data = JSON.stringify({ "today": state.today, "time_u": state.time_u, "time_n": state.time_n, "time_z": state.time_z, "time_i": state.time_i })
            var config = {
                method: 'post',
                url: 'http://rezultati.soccerbet.rs/live_score_danas/',
                data: data
            };
            axios(config).then(
                response => {
                    if (response.data) {
                        let times = {
                            time_i: Object.prototype.hasOwnProperty.call(response.data, "time_i") ? response.data.time_i : null,
                            time_n: Object.prototype.hasOwnProperty.call(response.data, "time_n") ? response.data.time_n : null,
                            time_u: Object.prototype.hasOwnProperty.call(response.data, "time_u") ? response.data.time_u : null,
                            time_z: Object.prototype.hasOwnProperty.call(response.data, "time_z") ? response.data.time_z : null
                        }
                        commit('CHANGE_TIMES', times)
                    }
                    if (Object.keys(response.data).length > 0) {
                        if (!Object.prototype.hasOwnProperty.call(response.data, "mec_uzivos")) {
                            response.data["mec_uzivos"] = { FD: [] }
                        } else {
                            if (!Object.prototype.hasOwnProperty.call(response.data.mec_uzivos, "FD")) {
                                response.data["mec_uzivos"] = { FD: [] }
                            } else {
                                var full = _.cloneDeep(response.data.mec_uzivos.FD)
                                response.data.mec_uzivos.FD = response.data.mec_uzivos.FD.filter(x => x.ch != false);
                            }
                        }
                        if (!Object.prototype.hasOwnProperty.call(response.data, "mec_zavrsenos")) {
                            response.data["mec_zavrsenos"] = { FD: [] }
                        } else {
                            if (!Object.prototype.hasOwnProperty.call(response.data.mec_zavrsenos, "FD")) {
                                response.data["mec_zavrsenos"] = { FD: [] }
                            } else {
                                response.data.mec_zavrsenos.FD = response.data.mec_zavrsenos.FD.filter(x => x.prekid == 0 && x.odlozen == 0)
                            }
                        }
                        if (!Object.prototype.hasOwnProperty.call(response.data, "mec_najavas")) {
                            response.data["mec_najavas"] = { FD: [] }
                        } else {
                            if (!Object.prototype.hasOwnProperty.call(response.data.mec_najavas, "FD")) {
                                response.data["mec_najavas"] = { FD: [] }
                            } else {
                                response.data.mec_najavas.FD = response.data.mec_najavas.FD.filter(x => x.prekid == 0 && x.odlozen == 0)
                            }
                        }
                        commit('CHANGE_MATCH', { data: response.data, full: full ? full : [] })
                    }

                }
            )
        }
    }
});
// function addEntryTimes(state){
//     state.uzivo_promene.forEach(match=>{
//         match['entry_time'] = new Date().getTime()
//     })
// }
function vh(v) {
    var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}
function calculateNumberOfMatchesAndSetState(state, data, liveAll) {
    const HEADER_HEIGHT = vh(13 + 4)+5
    const FOOTER_HEIGHT = vh(11);
    const ROW_HEIGHT = vh(4.5);


    let numberOfMatches = Math.floor((window.screen.height - HEADER_HEIGHT - FOOTER_HEIGHT) / ROW_HEIGHT) - 2;
    var uzivo, zavrseno, najava;
    var mec_zavrsenos = []
    var mec_najavas = [];
    let uzivoDuzina = liveAll.length;

    uzivo = uzivoDuzina
    zavrseno = data.mec_zavrsenos.FD.length
    najava = data.mec_najavas.FD.length;
    if (uzivo >= numberOfMatches) {
        liveAll = liveAll.slice(0, numberOfMatches);
    } else if (uzivo < numberOfMatches) {
        liveAll = uzivo > 0 ? liveAll.slice(0, uzivo) : []
        if (numberOfMatches - uzivo <= zavrseno) {
            mec_zavrsenos = zavrseno > 0 ? data.mec_zavrsenos.FD.slice(0, numberOfMatches - uzivo) : []
            mec_najavas = []
        } else {
            mec_zavrsenos = zavrseno > 0 ? data.mec_zavrsenos.FD.slice(0, numberOfMatches - uzivo) : []
            mec_najavas = najava > 0 ? data.mec_najavas.FD.filter(x => x.prekid == 0 && x.odlozen == 0).slice(0, numberOfMatches - uzivo - zavrseno) : []
        }
    }
    liveAll = liveAll.sort(function (a, b) {
        return new Date(a.poslednja_promena) - new Date(b.poslednja_promena)
    })

    mec_zavrsenos = mec_zavrsenos.sort(function (a, b) {
        return new Date(a.poslednja_promena) - new Date(b.poslednja_promena)
    })
    mec_najavas = mec_najavas.sort(function (a, b) {
        return new Date(a.poslednja_promena_ck_pen ? a.poslednja_promena_ck_pen : a.vreme) - new Date(b.poslednja_promena_ck_pen ? b.poslednja_promena_ck_pen : b.vreme)
    })
    state.mec_uzivos.FD = liveAll ? liveAll : [];
    state.mec_zavrsenos.FD = mec_zavrsenos ? mec_zavrsenos : [];
    state.mec_najavas.FD = mec_najavas ? mec_najavas : [];

    state.uzivo_history = liveAll ? liveAll : [];

    // state.uzivo_promene = addEntryTimes(liveAll, false)

}

function calculateNumberOfMatches(state, data) {
    data.mec_zavrsenos.FD =
        data.mec_zavrsenos.FD.length > 0 ?
            data.mec_zavrsenos.FD :
            state.mec_zavrsenos_full.FD
    data.mec_najavas.FD =
        data.mec_najavas.FD.length > 0 ?
            data.mec_najavas.FD :
            state.mec_najavas_full.FD

    const HEADER_HEIGHT = vh(13 + 4)+5
    const FOOTER_HEIGHT = vh(11);
    const ROW_HEIGHT = vh(4.5);
    let numberOfMatches = Math.floor((window.screen.height - HEADER_HEIGHT - FOOTER_HEIGHT) / ROW_HEIGHT)-1;
    var uzivo, zavrseno
    var mec_uzivos, mec_zavrsenos, mec_najavas;

    zavrseno = data.mec_zavrsenos.FD.length
    let foundExisting = false;
    var newMatches = []
    for (let i = 0; i < data.mec_uzivos.FD.length; i++) {
        for (let j = 0; j < state.uzivo_history.length; j++) {
            if (data.mec_uzivos.FD[i]['sifra'] == state.uzivo_history[j]['sifra']) {
                foundExisting = true;
                state.uzivo_history[j] = Object.assign({}, data.mec_uzivos.FD[i])
            }
        }
        if (!foundExisting) {
            newMatches.push(data.mec_uzivos.FD[i])
        } else {
            foundExisting = false;
        }
    }
    state.uzivo_history = state.uzivo_history.concat(newMatches)
    state.uzivo_history = state.uzivo_history.sort(function (a, b) {
        return new Date(b.poslednja_promena) - new Date(a.poslednja_promena)
    })

    uzivo = state.uzivo_history.length
    if (uzivo >= numberOfMatches) {
        mec_uzivos = state.uzivo_history.slice(0, numberOfMatches);
        mec_zavrsenos = []
        mec_najavas = []
    } else if (uzivo < numberOfMatches) {
        if (uzivo == 0) {
            mec_uzivos = []
        } else {
            mec_uzivos = state.uzivo_history.slice(0, uzivo)

        }
        if (numberOfMatches - uzivo <= zavrseno) {
            mec_zavrsenos = data.mec_zavrsenos.FD.slice(0, numberOfMatches - uzivo)
            mec_najavas = []
        } else {
            mec_zavrsenos = data.mec_zavrsenos.FD.slice(0, numberOfMatches - uzivo)
            mec_najavas = data.mec_najavas.FD.filter(x => x.prekid == 0 && x.odlozen == 0).slice(0, numberOfMatches - uzivo - zavrseno)
        }
    }

    mec_uzivos = mec_uzivos.sort(function (a, b) {
        return new Date(b.poslednja_promena) - new Date(a.poslednja_promena)
    })
    mec_zavrsenos = mec_zavrsenos.sort(function (a, b) {
        return new Date(b.vreme) - new Date(a.vreme)
    })
    mec_najavas = mec_najavas.sort(function (a, b) {
        return new Date(b.poslednja_promena_ck_pen ? b.poslednja_promena_ck_pen : b.vreme) - new Date(a.poslednja_promena_ck_pen ? a.poslednja_promena_ck_pen : a.vreme)
    })
    return {
        uzivo: mec_uzivos.length,
        zavrseno: mec_zavrsenos.length,
        najava: mec_najavas.length,
        mec_uzivos: mec_uzivos.length > 0 ? mec_uzivos : [],
        mec_zavrsenos: mec_zavrsenos.length > 0 ? mec_zavrsenos : [],
        mec_najavas: mec_najavas.length > 0 ? mec_najavas : [],
    }
}


function addEntryTimes(arr, include, state) {
    let found = false;
    arr.forEach(match => {
        if (include.constructor === Array) {
            if (include.includes(match.sifra)) {
                //console.log("DODAT DODATNI ENTRY TIME MECU " + match['domacin'] + ":" + match['gost'])
                match['entry_time'] = _.cloneDeep(new Date().getTime())
            } else {
                match['entry_time'] = state.uzivo_promene.filter(x => x.sifra == match.sifra)[0] ? state.uzivo_promene.filter(x => x.sifra == match.sifra)[0]['entry_time'] : _.cloneDeep(new Date().getTime())
            }
            found = true;
        } if (include == false && include.constructor !== Array) {
            //console.log("DODAT ENTRY TIME MECU " + match['domacin'] + ":" + match['gost'])
            match['entry_time'] = _.cloneDeep(new Date().getTime())
        }
    })
    return found || include.constructor !== Array ? _.cloneDeep(arr) : -1
}

function getLastElement(arr) {
    return arr[arr.length - 1]
}

function checkBlinking(state) {
    setInterval(() => {
        var d = new Date()
        d.setSeconds(d.getSeconds() - 15);

        for (let i = 0; i < state.uzivo_promene.length; i++) {
            if (state.uzivo_promene[i].entry_time <= d.getTime() && state.uzivo_promene[i].entry_time != null) {
                //console.log("Ukinut " + state.uzivo_promene[i].domacin)
                let obj = state.uzivo_promene[i]
                obj.entry_time = null;
                state.uzivo_promene[i] = Object.assign({}, obj)
            }
        }
        state.uzivo_promene = [...state.uzivo_promene]
    }, 1000);
}