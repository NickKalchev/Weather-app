<template>
  <div class="main">
    <Modal v-if="modalOpen" v-on:close-modal="toggleModal" :APIkey="APIkey" />
    <Navigation v-on:add-city="toggleModal" v-on:edit-cities="toggleEdit" :addCityActive="addCityActive" :isDay="isDay" :isNight="isNight" />
    <router-view v-bind:cities="cities" v-bind:edit="edit" :APIkey="APIkey" v-on:is-day="dayTime" v-on:is-night="nightTime" v-on:resetDays="resetDays" :isDay="isDay" :isNight="isNight" />
  </div>
</template>

<script>
import axios from 'axios';
import { db } from './firebase/firebase';
import { onSnapshot, collection, updateDoc, doc } from '@firebase/firestore';
import Navigation from './components/Navigation.vue';
import Modal from './components/Modal.vue';
export default {
  name: 'App',
  components: {
    Navigation,
    Modal
  },
  data() {
    return {
      isDay: null,
      isNight: null,
      APIkey: process.env.VUE_APP_API_KEY,
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null,
    }
  },
  created() {
    this.getCityWeather();
    this.checkRoute();
  },
  methods: {
    getCityWeather() {
      let database = collection(db, 'cities');

      const unsubscribe = onSnapshot(database, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added' && !change.doc.Nd) {
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
          } else if (change.type === 'added' && change.doc.Nd) {
            this.cities.push(change.doc.data())
          } else if (change.type === 'removed') {
            this.cities = this.cities.filter(c => c.city !== change.doc.data().city);
          }
        })
      })
      return unsubscribe;
    },
    toggleModal() {
      this.modalOpen = !this.modalOpen;
    },
    toggleEdit() {
      this.edit = !this.edit;
    },
    checkRoute() {
      if(this.$route.name === 'AddCity') {
        this.addCityActive = true;
      } else {
        this.addCityActive = false;
      }
    },
    dayTime() {
      this.isDay = !this.isDay;
    },
    nightTime() {
      this.isNight = !this.isNight;
    },
    resetDays() {
      this.isDay = false;
      this.isNight = false;
    }
  },
  watch: {
    $route() {
      this.checkRoute();
    }
  }
};
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

.day {
  transition: 500ms ease all;
  background-color: rgb(0, 81, 255);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}

.night {
  transition: 500ms ease all;
  background-color: rgb(20, 42, 95);
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
}
</style>
