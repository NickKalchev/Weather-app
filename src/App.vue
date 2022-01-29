<template>
  <div class="main">
    <Navigation />
    <router-view v-bind:cities="cities" />
  </div>
</template>

<script>
import axios from 'axios';
import { db } from './firebase/firebase';
import { onSnapshot, collection, updateDoc, doc } from '@firebase/firestore';
import Navigation from './components/Navigation.vue';
export default {
  name: 'App',
  components: {
    Navigation
  },
  data() {
    return {
      APIkey: process.env.VUE_APP_API_KEY,
      cities: []
    }
  },
  created() {
    this.getCityWeather();
  },
  methods: {
    getCityWeather() {
      let database = collection(db, 'cities');

      const unsubscribe = onSnapshot(database, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            try {
              const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${change.doc.data()?.city}&units=metric&appid=${this.APIkey}`);
              const data = response.data;
              const docRef = doc(db, 'cities', change.doc.id);
              
              await updateDoc(docRef, {
                currentWeather: data
              }).then(() => {
                this.cities.push(change.doc.data())
              })
            } catch (error) {
              console.log(error); 
            }
          }
        })
      })
      return unsubscribe;
    },
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}

.main {
  height: 100vh;
}

.container {
  padding: 0 20px;
}
</style>
