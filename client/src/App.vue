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
function testAPI() {
  fetch('http://localhost:3000/api/test')
    .then(res => res.json())
    .then(data => console.log(data))
}

testAPI()

</script>

