<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <svg class="w-8 h-8 text-primary-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="ml-3">
              <h1 class="text-xl font-semibold text-gray-900">Vue Notes</h1>
              <p class="text-sm text-gray-500">Organize your thoughts</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              {{ filteredNotes.length }} {{ filteredNotes.length === 1 ? 'note' : 'notes' }}
            </div>
            <button
              @click="openEditor()"
              class="btn-primary flex items-center"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Note
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Search and filters -->
      <SearchFilter
        :filter="filter"
        :categories="categories"
        :all-tags="allTags"
        :filtered-count="filteredNotes.length"
        @update:filter="updateFilter"
        @clear-filter="clearFilter"
      />

      <!-- Notes grid -->
      <div v-if="filteredNotes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <NoteCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          :categories="categories"
          @edit="openEditor"
          @delete="confirmDelete"
          @toggle-pin="togglePin"
          @duplicate="duplicateNote"
        />
      </div>

      <!-- Empty state -->
      <EmptyState
        v-else-if="notes.length === 0"
        @create-note="openEditor()"
      />

      <!-- No results -->
      <EmptyState
        v-else
        title="No notes match your search"
        description="Try adjusting your search terms or filters to find what you're looking for."
        :hide-button="true"
      />
    </main>

    <!-- Note Editor Modal -->
    <NoteEditor
      v-if="showEditor"
      :note="editingNote"
      :categories="categories"
      @close="closeEditor"
      @save="saveNote"
    />

    <!-- Delete confirmation modal -->
    <div
      v-if="noteToDelete"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in"
    >
      <div class="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-slide-up">
        <div class="flex items-center mb-4">
          <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-medium text-gray-900">Delete Note</h3>
            <p class="text-sm text-gray-500">This action cannot be undone.</p>
          </div>
        </div>
        
        <p class="text-gray-700 mb-6">
          Are you sure you want to delete "<strong>{{ noteToDelete.title }}</strong>"?
        </p>
        
        <div class="flex justify-end space-x-3">
          <button
            @click="noteToDelete = null"
            class="btn-secondary"
          >
            Cancel
          </button>
          <button
            @click="deleteNote"
            class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNotes } from './composables/useNotes';
import NoteCard from './components/NoteCard.vue';
import NoteEditor from './components/NoteEditor.vue';
import SearchFilter from './components/SearchFilter.vue';
import EmptyState from './components/EmptyState.vue';
import type { Note } from './types';

// Composables
const {
  notes,
  categories,
  filter,
  filteredNotes,
  allTags,
  createNote,
  updateNote,
  deleteNote: removeNote,
  togglePin,
  duplicateNote,
  updateFilter,
  clearFilter
} = useNotes();

// Component state
const showEditor = ref(false);
const editingNote = ref<Note | undefined>();
const noteToDelete = ref<Note | null>(null);

// Methods
const openEditor = (note?: Note) => {
  editingNote.value = note;
  showEditor.value = true;
};

const closeEditor = () => {
  showEditor.value = false;
  editingNote.value = undefined;
};

const saveNote = (noteData: Partial<Note>) => {
  if (noteData.id) {
    updateNote(noteData.id, noteData);
  } else {
    createNote(noteData);
  }
  closeEditor();
};

const confirmDelete = (id: string) => {
  const note = notes.value.find(n => n.id === id);
  if (note) {
    noteToDelete.value = note;
  }
};

const deleteNote = () => {
  if (noteToDelete.value) {
    removeNote(noteToDelete.value.id);
    noteToDelete.value = null;
  }
};
</script>