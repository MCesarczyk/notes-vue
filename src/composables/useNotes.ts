import { ref, computed, watch } from 'vue';
import { nanoid } from 'nanoid';
import type { Note, Category, Filter } from '../types';

const STORAGE_KEY = 'vue-notes-app';
const CATEGORIES_KEY = 'vue-notes-categories';

// Load data from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && Array.isArray(defaultValue)) {
        return parsed.map(item => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt)
        })) as T;
      }
      return parsed;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return defaultValue;
};

// Save data to localStorage
const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export function useNotes() {
  // State
  const notes = ref<Note[]>(loadFromStorage(STORAGE_KEY, []));
  const categories = ref<Category[]>(loadFromStorage(CATEGORIES_KEY, [
    { id: '1', name: 'Personal', color: '#6366f1' },
    { id: '2', name: 'Work', color: '#10b981' },
    { id: '3', name: 'Ideas', color: '#f59e0b' },
  ]));
  
  const filter = ref<Filter>({
    search: '',
    category: '',
    tags: [],
    sortBy: 'updatedAt',
    sortOrder: 'desc'
  });

  // Computed
  const filteredNotes = computed(() => {
    let filtered = [...notes.value];

    // Search filter
    if (filter.value.search) {
      const searchTerm = filter.value.search.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Category filter
    if (filter.value.category) {
      filtered = filtered.filter(note => note.category === filter.value.category);
    }

    // Tags filter
    if (filter.value.tags.length > 0) {
      filtered = filtered.filter(note => 
        filter.value.tags.every(tag => note.tags.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[filter.value.sortBy];
      const bValue = b[filter.value.sortBy];
      
      let comparison = 0;
      if (aValue instanceof Date && bValue instanceof Date) {
        comparison = aValue.getTime() - bValue.getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      
      return filter.value.sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pin notes to top
    return filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });
  });

  const allTags = computed(() => {
    const tagSet = new Set<string>();
    notes.value.forEach(note => {
      note.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  });

  // Methods
  const createNote = (noteData: Partial<Note>): Note => {
    const now = new Date();
    const note: Note = {
      id: nanoid(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      category: noteData.category || categories.value[0]?.id || '',
      tags: noteData.tags || [],
      createdAt: now,
      updatedAt: now,
      pinned: false,
      ...noteData
    };
    
    notes.value.unshift(note);
    return note;
  };

  const updateNote = (id: string, updates: Partial<Note>): Note | null => {
    const index = notes.value.findIndex(note => note.id === id);
    if (index === -1) return null;
    
    const updatedNote = {
      ...notes.value[index],
      ...updates,
      updatedAt: new Date()
    };
    
    notes.value[index] = updatedNote;
    return updatedNote;
  };

  const deleteNote = (id: string): boolean => {
    const index = notes.value.findIndex(note => note.id === id);
    if (index === -1) return false;
    
    notes.value.splice(index, 1);
    return true;
  };

  const togglePin = (id: string): boolean => {
    const note = notes.value.find(n => n.id === id);
    if (!note) return false;
    
    note.pinned = !note.pinned;
    note.updatedAt = new Date();
    return true;
  };

  const duplicateNote = (id: string): Note | null => {
    const original = notes.value.find(note => note.id === id);
    if (!original) return null;
    
    return createNote({
      ...original,
      title: `${original.title} (Copy)`,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      pinned: false
    });
  };

  const createCategory = (name: string, color: string): Category => {
    const category: Category = {
      id: nanoid(),
      name,
      color
    };
    
    categories.value.push(category);
    return category;
  };

  const updateFilter = (newFilter: Partial<Filter>): void => {
    filter.value = { ...filter.value, ...newFilter };
  };

  const clearFilter = (): void => {
    filter.value = {
      search: '',
      category: '',
      tags: [],
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    };
  };

  // Watch for changes and save to localStorage
  watch(notes, (newNotes) => {
    saveToStorage(STORAGE_KEY, newNotes);
  }, { deep: true });

  watch(categories, (newCategories) => {
    saveToStorage(CATEGORIES_KEY, newCategories);
  }, { deep: true });

  return {
    // State
    notes,
    categories,
    filter,
    
    // Computed
    filteredNotes,
    allTags,
    
    // Methods
    createNote,
    updateNote,
    deleteNote,
    togglePin,
    duplicateNote,
    createCategory,
    updateFilter,
    clearFilter
  };
}