<!--client/src/App.vue-->
<template>

  <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/landmarks">Landmarks</router-link>
      <router-link to="/store">Store</router-link>
      <router-link to="/about">About</router-link>
    </nav>

    <router-view />
  </div>
</template>

<script setup>
import { getLocations,getLandmark,newLandmark,updateLandmark,deleteLandmark,updateFavourite } from './services/clientServices.js'

async function testServices(){ 
  const landmarks = await getLocations();
  console.log("GET LOCATION RESPONSE:",landmarks.data);
  const id = 1;
  const landmark = await getLandmark(id);
  console.log("GET LANDMARK RESPONSE: ",landmark.data);
  const data = {
      name: "TESTS TOWER",
      country: "TESTLAND",
      city: "TESTCITY",
      type: "TEST",
      yearBuilt: 1970,
      description: "A famous communications and observation tower in TESTLAND.",
      latitude: 43.6426,
      longitude: -79.3871,
      favourite: false,
      image: "/images/cnTower.jpg"
    };
  const newMark = await newLandmark(data);
  console.log("NEW LANDMARK RESPONSE: ", newMark.data);
  data.name = "UPDATED TEST TOWER!";
  const updateMark =  await updateLandmark(newMark.data.id,data);
  console.log("UPDATE LANDMARK RESPONSE: ",updateMark.data);
  const favMark = await updateFavourite(newMark.data.id);
  console.log("UPDATE FAV LANDMARK: ",favMark.data);
  const deleteMark = await deleteLandmark(newMark.data.id);
  console.log("DELETE LANDMARK: ",deleteMark.data);
}  

function testAPI() {
  fetch('http://localhost:3000/api/test')
    .then(res => res.json())
    .then(data => console.log(data))
}

testAPI()
testServices()

</script>

