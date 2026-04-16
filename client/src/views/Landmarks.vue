<template>
  <div>
    <h1>Landmarks</h1>

    <SearchBar @update-search="search = $event" />
    <FilterPanel @update-filter="filter = $event" />

    <div class="grid">
      <LandmarkCard
        v-for="l in filteredLandmarks"
        :key="l.id"
        :landmark="l"
      />
    </div>
  </div>
</template>

<script>
import LandmarkCard from '../components/LandmarkCard.vue';
import SearchBar from '../components/SearchBar.vue';
import FilterPanel from '../components/FilterPanel.vue';
import { getLocations } from '../services/clientServices.js';

export default {
  components: { LandmarkCard, SearchBar, FilterPanel },

  data() {
    return {
      landmarks: [],
      search: '',
      filter: ''
    };
  },

  computed: {
    filteredLandmarks() {
      return this.landmarks.filter(l => {
        const matchesSearch = l.name
          .toLowerCase()
          .includes(this.search.toLowerCase());

        const matchesFilter = this.filter
          ? l.country === this.filter
          : true;

        return matchesSearch && matchesFilter;
      });
    }
  },

  async mounted() {
    const res = await getLocations();
    this.landmarks = res.data;
  }
};
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
</style>