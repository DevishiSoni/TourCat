<template>
  <div class="card">
    <img :src="landmark.image" alt="" class="card-img" />

    <h3>{{ landmark.name }}</h3>
    <p>{{ landmark.city }}</p>
    <p>{{ landmark.description }}</p>
  </div>
</template>

<script>
export default {
  props: {
    landmark: Object
  }
};
</script>

<style>
.card {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 10px;
}
.card-img {
  width: 100%;
  height: 150px;
  object-fit: cover;
}
</style>