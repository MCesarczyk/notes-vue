<template>
  <div class="card group relative animate-slide-up">
    <!-- Pin indicator -->
    <div 
      v-if="note.pinned" 
      class="absolute top-2 right-2 text-accent-500"
      title="Pinned note"
    >
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>

    <!-- Content -->
    <div class="cursor-pointer" @click="$emit('edit', note)">
      <h3 class="font-semibold text-lg text-gray-900 mb-2 pr-6">{{ note.title }}</h3>
      <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ note.content }}</p>
    </div>

    <!-- Tags -->
    <div v-if="note.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
      <span 
        v-for="tag in note.tags" 
        :key="tag" 
        class="tag text-xs"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Footer -->
    <div class="flex items-center justify-between text-sm text-gray-500">
      <div class="flex items-center space-x-4">
        <span class="flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {{ categoryName }}
        </span>
        <span>{{ formattedDate }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          @click.stop="$emit('toggle-pin', note.id)"
          :class="[
            'p-1 rounded hover:bg-gray-100 transition-colors duration-200',
            note.pinned ? 'text-accent-500' : 'text-gray-400'
          ]"
          :title="note.pinned ? 'Unpin note' : 'Pin note'"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 6.707 6.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
        </button>
        
        <button
          @click.stop="$emit('duplicate', note.id)"
          class="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          title="Duplicate note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          @click.stop="$emit('delete', note.id)"
          class="p-1 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors duration-200"
          title="Delete note"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { Note, Category } from '../types';

interface Props {
  note: Note;
  categories: Category[];
}

defineProps<Props>();
defineEmits<{
  edit: [note: Note];
  delete: [id: string];
  'toggle-pin': [id: string];
  duplicate: [id: string];
}>();

const props = defineProps<Props>();

const categoryName = computed(() => {
  const category = props.categories.find(c => c.id === props.note.category);
  return category?.name || 'Uncategorized';
});

const formattedDate = computed(() => {
  return props.note.updatedAt.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: props.note.updatedAt.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
});
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>