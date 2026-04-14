<template>
  <h1>Hello World</h1>
</template>

<script setup>
function testAPI() {
  fetch('/api/test')
    .then(res => res.json())
    .then(data => console.log(data))
}

testAPI()
</script>