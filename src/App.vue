<template>
  <div class="main">
    <Modal v-if="modalOpen" v-on:close-modal="toggleModal" :APIkey="APIkey" />
    <Navigation v-on:add-city="toggleModal" v-on:edit-cities="toggleEdit" />
    <router-view v-bind:cities="cities" v-bind:edit="edit" :APIkey="APIkey"  />
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
      APIkey: process.env.VUE_APP_API_KEY,
      cities: [],
      modalOpen: null,
      edit: null,
      addCityActive: null
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
</style>
