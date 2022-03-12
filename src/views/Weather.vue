<template>
  <h4>WEATHER</h4>
</template>

<script>
import axios from 'axios';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default {
    name: 'Weather',
    props: ["APIkey"],
    data() {
        return {
            forecast: null,
            currentWeather: null,
            loading: true
        };
    },
    created() {
        this.getWeather();
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
                    console.log(this.forecast);
                    console.log(this.loading);
                });
            })

        }
    }

};
</script>

<style>
    h4 {
        padding-top: 100px;
        color: white;
    }

</style>