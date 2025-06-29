<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
    <!-- Search bar -->
    <div class="relative mb-4">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        v-model="localFilter.search"
        type="text"
        class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors duration-200"
        placeholder="Search notes by title, content, or tags..."
      >
    </div>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <!-- Category filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select v-model="localFilter.category" class="input-field">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Sort by -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
        <select v-model="localFilter.sortBy" class="input-field">
          <option value="updatedAt">Last Modified</option>
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
        </select>
      </div>

      <!-- Sort order -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Order</label>
        <select v-model="localFilter.sortOrder" class="input-field">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>
    </div>

    <!-- Tag filters -->
    <div v-if="allTags.length > 0">
      <label class="block text-sm font-medium text-gray-700 mb-2">Filter by Tags</label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in allTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200',
            localFilter.tags.includes(tag)
              ? 'bg-primary-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Clear filters -->
    <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
      <div class="text-sm text-gray-500">
        {{ filteredCount }} {{ filteredCount === 1 ? 'note' : 'notes' }} found
      </div>
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="text-sm text-primary-600 hover:text-primary-700 font-medium"
      >
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import type { Filter, Category } from '../types';

interface Props {
  filter: Filter;
  categories: Category[];
  allTags: string[];
  filteredCount: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:filter': [filter: Filter];
  'clear-filter': [];
}>();

const localFilter = reactive({ ...props.filter });

const hasActiveFilters = computed(() => {
  return localFilter.search !== '' ||
         localFilter.category !== '' ||
         localFilter.tags.length > 0 ||
         localFilter.sortBy !== 'updatedAt' ||
         localFilter.sortOrder !== 'desc';
});

const toggleTag = (tag: string) => {
  const index = localFilter.tags.indexOf(tag);
  if (index > -1) {
    localFilter.tags.splice(index, 1);
  } else {
    localFilter.tags.push(tag);
  }
};

const clearFilters = () => {
  Object.assign(localFilter, {
    search: '',
    category: '',
    tags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });
  emit('clear-filter');
};

// Watch for changes and emit updates
watch(localFilter, (newFilter) => {
  emit('update:filter', { ...newFilter });
}, { deep: true });
</script>