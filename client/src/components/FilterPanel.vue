<template>
  <select v-model="selected" @change="$emit('update-filter', selected)">
    <option value="">All</option>
    <option value="Canada">Canada</option>
    <option value="USA">USA</option>
  </select>
</template>

<script>
export default {
  data() {
    return {
      selected: ''
    };
  }
};
</script>