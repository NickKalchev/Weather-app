<template>
  <div class="main">
      <div v-if="loading" class="loading">
          <span></span>
      </div>
      <div v-else class="weather" :class="{day: isDay, night: isNight}">
          <div class="weather-wrap">

          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
    name: 'Weather',
    props: ["APIkey", "isDay", "isNight"],
    data() {
        return {
            forecast: null,
            currentWeather: null,
            loading: true,
            currentTime: null
        };
    },
    created() {
        this.getWeather();
    },
    beforeDestroy() {
        this.$emit('resetDays');
    },
    methods: {
        async getWeather() {
            const q = query(collection(db, 'cities'), where("city", "==", `${this.$route.params.city}`))
            
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(doc => {
                this.currentWeather = doc.data().currentWeather;
                axios.get(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${doc.data().currentWeather.coord.lat}&lon=${doc.data().currentWeather.coord.lon}&exclude=current,minutely,alerts&units=imperial&appid=${this.APIkey}`
                ).then(res => {
                    this.forecast = res.data;
                }).then(() => {
                    this.loading = false;
                    this.getCurrentTime();
                });
            })

        },
        getCurrentTime() {
            const dateObject = new Date();
            this.currentTime = dateObject.getHours();
            const sunrise = new Date(this.currentWeather.sys.sunrise * 1000).getHours();
            const sunset = new Date(this.currentWeather.sys.sunset * 1000).getHours();

            if (this.currentTime > sunrise && this.currentTime < sunset) {
                this.$emit('is-day');
            } else {
                this.$emit('is-night');
            }
        }
    }

};
</script>

<style lang="scss" scoped>
    .loading {
        @keyframes spin {
            to {
                transform: rotateZ(360deg)
            }
        }
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        span {
            display: block;
            width: 60px;
            height: 60px;
            margin: 0 auto;
            border: 2px solid transparent;
            border-top-color: #142a5f;
            border-radius: 50%;
            animation: spin ease 1000ms infinite;
        }
    }
    .weather {
        transition: 500ms ease;
        overflow: scroll;
        width: 100%;
        height: 100%;

        .weather-wrap {
            overflow: hidden;
            max-width: 1024px;
            margin: 0 auto;
        }
    }


</style>