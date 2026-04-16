<!--client/src/components/SearchBar.vue-->

<template>
  <input
    v-model="search"
    placeholder="Search landmarks..."
    @input="$emit('update-search', search)"
  />
</template>

<script>
export default {
  data() {
    return {
      search: ''
    };
  }
};
</script>