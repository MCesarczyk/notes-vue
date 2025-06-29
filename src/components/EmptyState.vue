<template>
  <div class="text-center py-12">
    <div class="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>
    <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
    <p class="text-gray-500 mb-6 max-w-sm mx-auto">{{ description }}</p>
    <button
      v-if="!hideButton"
      @click="$emit('create-note')"
      class="btn-primary"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      Create Your First Note
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  hideButton?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: 'No notes found',
  description: 'Get started by creating your first note to capture your thoughts and ideas.',
  hideButton: false
});

defineEmits<{
  'create-note': [];
}>();
</script>