export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  pinned: boolean;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Filter {
  search: string;
  category: string;
  tags: string[];
  sortBy: 'createdAt' | 'updatedAt' | 'title';
  sortOrder: 'asc' | 'desc';
}