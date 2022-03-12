<template>
  <div @click="goToWeather" class="city">
      <i v-if="edit" @click="removeCity" class="far fa-trash-alt edit" ref="edit"></i>
      <span>{{this.city.city}}</span>
      <div class="weather">
        <img class="icon" :src="require(`../../public/conditions/${this.city.currentWeather.weather[0].icon}.svg`)" alt="">
        <span>{{Math.round(this.city.currentWeather.main.temp)}} &deg;C</span>
      </div>
      <div class="video">
        <video 
            autoplay 
            muted 
            loop 
            :src="require(`../../public/videos/${this.city.currentWeather.weather[0].icon}.mp4`)">
        </video>
        <div class="bg-overlay">

        </div>
      </div>
  </div>
</template>

<script>
import { db } from '../firebase/firebase';
import { collection, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
export default {
    name: "city",
    props: ['city', 'edit'],
    created() {
    },
    data() {
        return {
            id: null
        }
    },
    methods: {
        async removeCity() {
            const querySnapshot = await getDocs(query(collection(db, 'cities'), where('city', '==', `${this.city.city}`)))
            querySnapshot.forEach(doc => {
                this.id = doc.id;
            })
            await deleteDoc(doc(db, 'cities', this.id));
        },

        goToWeather(e) {
            if (e.target === this.$refs.edit) {
                // dont do anything
            } else {
                this.$router.push({ name: "Weather", params: { city: this.city.city } });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .city{
        display: flex;
        position: relative;
        flex-direction: column;
        padding: 20px;
        flex-basis: 50%;
        min-height: 250px;
        color: #fff;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        margin: 0 2px;

        span {
        z-index: 1;
        text-transform: capitalize;
        display: block;
        font-size: 25px;
        font-weight: 600;
        }

        .edit {
            border-radius: 15px 0px 15px 0px;
            border: 10px solid rgb(155, 35, 35);
            background-color: rgb(77, 77, 77);
            z-index: 1;
            font-size: 20px;
            position: absolute;
            top: 0px;
            right: 0px;
            cursor: pointer;
        }

        .weather {
            display: flex;
            z-index: 1;
            justify-content: flex-end;
            align-items: flex-end;
            flex: 1;

            span {
                font-size: 35px;
                margin-right: 8px;
            }

            img {
                height: 25px;
                width: auto;
                margin-bottom: 20px;
                margin-right: 10px;
            }
        }

        .video {
            overflow: hidden;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;

            video {
                height: 100%;

                @media (min-width: 900px) {
                    height: auto;
                    width: 100%;
                }
            }

            .bg-overlay {
                position: absolute;
                height: 100%;
                width: 100%;
                top: 0;
                background-color: rgba(0,0,0,0.2);
            }
        }
    }
</style>