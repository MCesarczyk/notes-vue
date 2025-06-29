<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
    <div class="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-slide-up">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900">
          {{ isEditing ? 'Edit Note' : 'Create New Note' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 p-6 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Title -->
          <div>
            <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              v-model="form.title"
              type="text"
              class="input-field text-lg font-medium"
              placeholder="Enter note title..."
              required
            >
          </div>

          <!-- Category and Tags row -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Category -->
            <div>
              <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                v-model="form.category"
                class="input-field"
              >
                <option value="" disabled>Select a category</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <!-- Tags -->
            <div>
              <label for="tags" class="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div class="relative">
                <input
                  v-model="tagInput"
                  @keydown.enter.prevent="addTag"
                  @keydown.comma.prevent="addTag"
                  type="text"
                  class="input-field pr-10"
                  placeholder="Add tags (press Enter or comma)"
                >
                <button
                  type="button"
                  @click="addTag"
                  class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              
              <!-- Current tags -->
              <div v-if="form.tags.length > 0" class="flex flex-wrap gap-2 mt-2">
                <span
                  v-for="tag in form.tags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  {{ tag }}
                  <button
                    type="button"
                    @click="removeTag(tag)"
                    class="hover:text-primary-600"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div>
            <label for="content" class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              v-model="form.content"
              rows="12"
              class="input-field resize-none"
              placeholder="Write your note content here..."
            ></textarea>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end space-x-4 p-6 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('close')"
          class="btn-secondary"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          class="btn-primary"
        >
          {{ isEditing ? 'Update Note' : 'Create Note' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import type { Note, Category } from '../types';

interface Props {
  note?: Note;
  categories: Category[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  save: [note: Partial<Note>];
}>();

const isEditing = ref(!!props.note);
const tagInput = ref('');

const form = reactive({
  title: props.note?.title || '',
  content: props.note?.content || '',
  category: props.note?.category || props.categories[0]?.id || '',
  tags: [...(props.note?.tags || [])]
});

const addTag = () => {
  const tag = tagInput.value.trim().replace(',', '');
  if (tag && !form.tags.includes(tag)) {
    form.tags.push(tag);
    tagInput.value = '';
  }
};

const removeTag = (tag: string) => {
  const index = form.tags.indexOf(tag);
  if (index > -1) {
    form.tags.splice(index, 1);
  }
};

const handleSubmit = () => {
  if (!form.title.trim()) {
    alert('Please enter a title for your note.');
    return;
  }

  emit('save', {
    id: props.note?.id,
    title: form.title.trim(),
    content: form.content.trim(),
    category: form.category,
    tags: form.tags
  });
};

// Set default category if none selected
watch(() => props.categories, (newCategories) => {
  if (!form.category && newCategories.length > 0) {
    form.category = newCategories[0].id;
  }
}, { immediate: true });
</script>