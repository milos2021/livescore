<template>
  <div class="container">
    <vueper-slides autoplay :bullets="false">
      <vueper-slide
        v-for="(slide, i) in slides"
        :key="i"
        :content="slide.content"
        :duration="duration"
      />
    </vueper-slides>
  </div>
</template>

<script>
import { VueperSlides, VueperSlide } from "vueperslides";
import "vueperslides/dist/vueperslides.css";

export default {
  data: () => ({
    duration: 15000,
    slides: [
      {
        title: "slide #1",
        content: "Pogledajte celokupnu ponudu 🎇",
      },
      {
        title: "slide #2",
        content: "www.soccerbet.rs 🎉✨",
      },
      {
        title: "slide #3",
        content: "PRAVI IGRAČI NA PRAVOM MESTU! 🎈",
      },
    ],
  }),
  name: "NewMessages",
  components: {
    VueperSlides,
    VueperSlide,
  },
  props: {
    title: String,
  },
  created() {},
  methods: {},
};
</script>

<style>
@font-face {
  font-family: myThirdFont;
  src: url("../assets/fonts/Mulish/Mulish.ttf");
}
@font-face {
  font-family: myFont;
  src: url("../assets/fonts/Montserrat/Montserrat.ttf");
}
.vueperslides {
  margin-left:10px;
  margin-top: -17.4%;
  margin-bottom: -13%;
  font-family: Helvetica;
  font-size: 1.9rem;
  /* text-transform: uppercase; */
  font-style: italic;
}
.vueperslides__bullet .default {
  width: 6px;
  height: 6px;
}
.vueperslides__bullet--active {
  border-width: 3px !important;
}
.vueperslides__bullet {
  height: 10px !important;
  margin-top: -13%;
}

.vueperslide__content-wrapper {
  margin-top: 12px !important;
}
.vueperslides__arrows > button {
  display: none !important;
  background: transparent !important;
}

.vueperslides:not(.no-shadow):not(.vueperslides--3d) .vueperslides__parallax-wrapper:after, .vueperslides:not(.no-shadow):not(.vueperslides--3d) .vueperslides__parallax-wrapper:before {
    box-shadow: none!important;
}
</style>